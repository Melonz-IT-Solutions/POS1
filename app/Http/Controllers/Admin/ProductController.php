<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\PriceHistory;
use App\Models\Product;
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
            'categories' => Category::active()->orderBy('name')->get(['id', 'name']),
            'vatTypes'   => [
                ['value' => 'vatable',    'label' => 'VATable (12%)'],
                ['value' => 'vat_exempt', 'label' => 'VAT Exempt'],
                ['value' => 'zero_rated', 'label' => 'Zero Rated'],
            ],
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        AuditLog::record('product.create', $product, [], $product->toArray());

        return redirect()->route('admin.products.index')
            ->with('success', "Product \"{$product->name}\" created successfully.");
    }

    public function show(Product $product): RedirectResponse
    {
        return redirect()->route('admin.products.edit', $product);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('products/Edit', [
            'product'    => $product->load('category:id,name'),
            'categories' => Category::active()->orderBy('name')->get(['id', 'name']),
            'vatTypes'   => [
                ['value' => 'vatable',    'label' => 'VATable (12%)'],
                ['value' => 'vat_exempt', 'label' => 'VAT Exempt'],
                ['value' => 'zero_rated', 'label' => 'Zero Rated'],
            ],
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
}
