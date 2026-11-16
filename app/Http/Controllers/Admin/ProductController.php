<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\PriceHistory;
use App\Models\Product;
use App\Models\ProductBundleItem;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category:id,name')
            ->withTrashed()
            ->orderBy('name');

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('status')) {
            match ($request->input('status')) {
                'active'   => $query->where('is_active', true)->whereNull('deleted_at'),
                'inactive' => $query->where('is_active', false)->whereNull('deleted_at'),
                'low_stock'=> $query->whereNull('deleted_at')->whereRaw('stock_quantity <= minimum_stock AND minimum_stock > 0'),
                'deleted'  => $query->whereNotNull('deleted_at'),
                default    => null,
            };
        }

        return Inertia::render('products/Index', [
            'products'   => $query->paginate(25)->withQueryString(),
            'categories' => Category::active()->orderBy('name')->get(['id', 'name']),
            'filters'    => $request->only(['search', 'category_id', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('products/Create', [
            'categories'  => Category::active()->orderBy('name')->get(['id', 'name']),
            'vatTypes'    => [
                ['value' => 'vatable',    'label' => 'VATable (12%)'],
                ['value' => 'vat_exempt', 'label' => 'VAT Exempt'],
                ['value' => 'zero_rated', 'label' => 'Zero Rated'],
            ],
            'allProducts' => Product::active()->orderBy('name')->get(['id', 'name', 'sku', 'selling_price']),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        $this->syncBundleItems($product, $request->input('bundle_items', []));

        AuditLog::record('product.create', $product, [], $product->toArray());

        return redirect()->route('admin.products.index')
            ->with('success', "Product \"{$product->name}\" created successfully.");
    }

    public function show(Product $product): Response
    {
        $product->load(['category:id,name', 'suppliers:id,company_name,contact_person,phone', 'bundleItems.component:id,name,sku,selling_price']);

        $recentMovements = $product->stockMovements()
            ->with('user:id,name')
            ->latest()
            ->limit(10)
            ->get();

        $recentPriceHistory = $product->priceHistory()
            ->with('changedBy:id,name')
            ->limit(5)
            ->get();

        return Inertia::render('products/Show', [
            'product'            => $product,
            'recentMovements'    => $recentMovements,
            'recentPriceHistory' => $recentPriceHistory,
            'canViewCost'        => auth()->user()->hasPermissionTo('view cost prices'),
            'canEdit'            => auth()->user()->can('update', $product),
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('products/Edit', [
            'product'    => $product->load(['category:id,name', 'bundleItems.component:id,name,sku,selling_price']),
            'categories' => Category::active()->orderBy('name')->get(['id', 'name']),
            'vatTypes'   => [
                ['value' => 'vatable',    'label' => 'VATable (12%)'],
                ['value' => 'vat_exempt', 'label' => 'VAT Exempt'],
                ['value' => 'zero_rated', 'label' => 'Zero Rated'],
            ],
            'allProducts' => Product::active()->orderBy('name')->get(['id', 'name', 'sku', 'selling_price']),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $old  = $product->toArray();
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        // Record price history if prices changed
        if ($product->cost_price !== ($data['cost_price'] ?? $product->cost_price)
            || $product->selling_price !== ($data['selling_price'] ?? $product->selling_price)
        ) {
            PriceHistory::create([
                'product_id'        => $product->id,
                'old_cost_price'    => $product->cost_price,
                'new_cost_price'    => $data['cost_price'] ?? $product->cost_price,
                'old_selling_price' => $product->selling_price,
                'new_selling_price' => $data['selling_price'] ?? $product->selling_price,
                'changed_by'        => $request->user()->id,
                'reason'            => $data['price_change_reason'] ?? null,
            ]);
        }

        unset($data['price_change_reason']);
        $product->update($data);

        $this->syncBundleItems($product, $request->input('bundle_items', []));

        AuditLog::record('product.update', $product, $old, $product->fresh()->toArray());

        return redirect()->route('admin.products.index')
            ->with('success', "Product \"{$product->name}\" updated successfully.");
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $old = $product->toArray();
        $product->delete();

        AuditLog::record('product.delete', null, $old, []);

        return redirect()->route('admin.products.index')
            ->with('success', "Product \"{$product->name}\" archived.");
    }

    public function restore(int $id): RedirectResponse
    {
        $product = Product::withTrashed()->findOrFail($id);
        $this->authorize('restore', $product);

        $product->restore();

        AuditLog::record('product.restore', $product, [], $product->toArray());

        return back()->with('success', "Product \"{$product->name}\" restored.");
    }

    public function bulkPriceIndex(Request $request): Response
    {
        $this->authorize('update', new Product());

        $query = Product::with('category:id,name')
            ->active()
            ->orderBy('name');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        return Inertia::render('products/BulkPrice', [
            'products'   => $query->get(['id', 'name', 'sku', 'selling_price', 'cost_price', 'category_id']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters'    => $request->only(['category_id', 'search']),
        ]);
    }

    public function bulkPriceUpdate(Request $request): RedirectResponse
    {
        $this->authorize('update', new Product());

        $data = $request->validate([
            'ids'      => ['required', 'array', 'min:1'],
            'ids.*'    => ['integer', 'exists:products,id'],
            'method'   => ['required', 'in:percent_increase,percent_decrease,fixed_increase,fixed_decrease,set_price'],
            'value'    => ['required', 'numeric', 'min:0'],
            'rounding' => ['required', 'in:none,peso,five,ten'],
            'reason'   => ['nullable', 'string', 'max:255'],
        ]);

        $products = Product::whereIn('id', $data['ids'])->get();
        $count    = 0;

        foreach ($products as $product) {
            $old  = $product->selling_price;
            $raw  = match ($data['method']) {
                'percent_increase' => (int) round($old * (1 + $data['value'] / 100)),
                'percent_decrease' => (int) round($old * (1 - $data['value'] / 100)),
                'fixed_increase'   => $old + (int) round($data['value'] * 100),
                'fixed_decrease'   => max(1, $old - (int) round($data['value'] * 100)),
                'set_price'        => (int) round($data['value'] * 100),
            };

            $new = match ($data['rounding']) {
                'peso' => (int) round($raw / 100) * 100,
                'five' => (int) round($raw / 500) * 500,
                'ten'  => (int) round($raw / 1000) * 1000,
                default => $raw,
            };
            $new = max(1, $new);

            if ($new === $old) {
                continue;
            }

            $product->update(['selling_price' => $new]);

            PriceHistory::create([
                'product_id'        => $product->id,
                'old_cost_price'    => $product->cost_price,
                'new_cost_price'    => $product->cost_price,
                'old_selling_price' => $old,
                'new_selling_price' => $new,
                'changed_by'        => auth()->id(),
                'reason'            => $data['reason'] ?? 'Bulk price update',
            ]);

            $count++;
        }

        AuditLog::record('product.bulk_price_update', new Product(), [], [
            'count'  => $count,
            'method' => $data['method'],
            'value'  => $data['value'],
            'reason' => $data['reason'] ?? null,
        ]);

        return redirect()->route('admin.products.bulk-price')
            ->with('success', "{$count} product price" . ($count === 1 ? '' : 's') . " updated.");
    }

    public function labels(Request $request): Response
    {
        $this->authorize('viewAny', Product::class);

        $ids = array_filter(array_map('intval', (array) $request->input('ids', [])));

        abort_if(empty($ids), 400, 'No products selected.');
        abort_if(count($ids) > 100, 400, 'Too many products (max 100).');

        $products = Product::whereIn('id', $ids)
            ->with('category:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'barcode', 'selling_price', 'category_id']);

        return Inertia::render('products/Labels', [
            'products'         => $products,
            'business_name'    => Setting::get('business_name',  'My Store'),
            'business_address' => Setting::get('business_address', ''),
        ]);
    }

    private function syncBundleItems(Product $product, array $bundleItems): void
    {
        if (! $product->is_bundle) {
            $product->bundleItems()->delete();
            return;
        }

        $product->bundleItems()->delete();

        foreach ($bundleItems as $item) {
            $componentId = (int) ($item['component_id'] ?? 0);
            $quantity    = max(1, (int) ($item['quantity'] ?? 1));

            if ($componentId && $componentId !== $product->id) {
                ProductBundleItem::create([
                    'bundle_id'    => $product->id,
                    'component_id' => $componentId,
                    'quantity'     => $quantity,
                ]);
            }
        }
    }
}
