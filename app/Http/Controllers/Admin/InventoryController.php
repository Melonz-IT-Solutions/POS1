<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StockAdjustmentRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function __construct(private readonly InventoryService $inventory) {}

    public function index(Request $request): Response
    {
        $query = Product::with('category:id,name')
            ->active()
            ->orderBy('name');

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('stock_status')) {
            match ($request->input('stock_status')) {
                'low'     => $query->lowStock(),
                'out'     => $query->where('stock_quantity', 0),
                'in_stock'=> $query->where('stock_quantity', '>', 0),
                default   => null,
            };
        }

        $products = $query->paginate(30)->withQueryString();

        $stats = [
            'total_products'  => Product::active()->count(),
            'low_stock_count' => Product::active()->lowStock()->count(),
            'out_of_stock'    => Product::active()->where('stock_quantity', 0)->count(),
            'total_value'     => (int) Product::active()->selectRaw('SUM(CAST(stock_quantity AS DECIMAL(20,0)) * CAST(cost_price AS DECIMAL(20,0))) as total')->value('total'),
        ];

        return Inertia::render('inventory/Index', [
            'products'   => $products,
            'stats'      => $stats,
            'categories' => \App\Models\Category::active()->orderBy('name')->get(['id', 'name']),
            'filters'    => $request->only(['search', 'category_id', 'stock_status']),
        ]);
    }

    public function adjust(StockAdjustmentRequest $request, Product $product): RedirectResponse
    {
        DB::transaction(function () use ($request, $product) {
            $this->inventory->adjust(
                $product,
                $request->input('new_quantity'),
                $request->input('reason'),
                $request->user(),
            );
        });

        return back()->with('success', "Stock for \"{$product->name}\" adjusted to {$request->input('new_quantity')} units.");
    }

    public function movements(Request $request, Product $product): Response
    {
        $movements = StockMovement::where('product_id', $product->id)
            ->with('user:id,name')
            ->latest()
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('inventory/Movements', [
            'product'   => $product->load('category:id,name'),
            'movements' => $movements,
        ]);
    }

    public function reorder(Request $request): Response
    {
        abort_unless($request->user()->hasPermissionTo('view inventory'), 403);

        $products = Product::with(['category:id,name', 'suppliers:id,company_name,phone,email'])
            ->active()
            ->where(function ($q) {
                $q->lowStock()->orWhere('stock_quantity', 0);
            })
            ->orderBy('name')
            ->get();

        $canCreatePO = $request->user()->can('create', \App\Models\PurchaseOrder::class);

        return Inertia::render('inventory/Reorder', [
            'products'    => $products,
            'canCreatePO' => $canCreatePO,
            'stats'       => [
                'low_stock'    => $products->filter(fn ($p) => $p->stock_quantity > 0 && $p->stock_quantity <= $p->minimum_stock)->count(),
                'out_of_stock' => $products->where('stock_quantity', 0)->count(),
                'suppliers'    => $products->flatMap->suppliers->pluck('id')->unique()->filter()->count(),
            ],
        ]);
    }

    public function valuation(Request $request): Response
    {
        abort_unless($request->user()->hasPermissionTo('view inventory'), 403);

        $query = Product::with('category:id,name')
            ->active()
            ->orderBy('name');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('stock_status')) {
            match ($request->input('stock_status')) {
                'low'      => $query->lowStock(),
                'out'      => $query->where('stock_quantity', 0),
                'in_stock' => $query->where('stock_quantity', '>', 0),
                default    => null,
            };
        }

        $products = $query
            ->get(['id', 'name', 'sku', 'stock_quantity', 'minimum_stock',
                   'selling_price', 'cost_price', 'category_id', 'vat_type'])
            ->map(function (Product $p) {
                $qty         = $p->stock_quantity;
                $costValue   = $qty * $p->cost_price;
                $retailValue = $qty * $p->selling_price;
                $grossProfit = $retailValue - $costValue;
                $margin      = $retailValue > 0
                    ? round($grossProfit / $retailValue * 100, 1)
                    : 0.0;

                return [
                    'id'           => $p->id,
                    'name'         => $p->name,
                    'sku'          => $p->sku,
                    'category'     => $p->category?->name,
                    'stock_qty'    => $qty,
                    'min_stock'    => $p->minimum_stock,
                    'cost_price'   => $p->cost_price,
                    'selling_price'=> $p->selling_price,
                    'cost_value'   => $costValue,
                    'retail_value' => $retailValue,
                    'gross_profit' => $grossProfit,
                    'margin_pct'   => $margin,
                ];
            });

        $summary = [
            'total_skus'        => $products->count(),
            'total_units'       => $products->sum('stock_qty'),
            'total_cost_value'  => $products->sum('cost_value'),
            'total_retail_value'=> $products->sum('retail_value'),
            'total_gross_profit'=> $products->sum('gross_profit'),
        ];

        $summary['overall_margin'] = $summary['total_retail_value'] > 0
            ? round($summary['total_gross_profit'] / $summary['total_retail_value'] * 100, 1)
            : 0.0;

        $categories = \App\Models\Category::active()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('inventory/Valuation', [
            'products'   => $products->values(),
            'summary'    => $summary,
            'categories' => $categories,
            'filters'    => $request->only('category_id', 'stock_status'),
        ]);
    }

    public function export(Request $request): HttpResponse
    {
        abort_unless($request->user()->hasPermissionTo('view inventory'), 403);

        $query = Product::with('category:id,name')->active()->orderBy('name');

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('stock_status')) {
            match ($request->input('stock_status')) {
                'low'      => $query->lowStock(),
                'out'      => $query->where('stock_quantity', 0),
                'in_stock' => $query->where('stock_quantity', '>', 0),
                default    => null,
            };
        }

        $products = $query->get();
        $filename = 'inventory-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($products) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Name', 'SKU', 'Category', 'Stock Qty', 'Min Stock',
                'Selling Price (₱)', 'Cost Price (₱)', 'Stock Value (₱)',
            ]);

            foreach ($products as $p) {
                fputcsv($handle, [
                    $p->name,
                    $p->sku,
                    $p->category?->name ?? '',
                    $p->stock_quantity,
                    $p->minimum_stock,
                    number_format($p->selling_price / 100, 2),
                    number_format($p->cost_price / 100, 2),
                    number_format($p->stock_quantity * $p->cost_price / 100, 2),
                ]);
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    public function physicalCount(Request $request): Response
    {
        abort_unless($request->user()->hasPermissionTo('adjust inventory'), 403);

        $products = Product::with('category:id,name')
            ->active()
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'stock_quantity', 'minimum_stock', 'category_id']);

        return Inertia::render('inventory/PhysicalCount', [
            'products' => $products,
        ]);
    }

    public function applyPhysicalCount(Request $request): RedirectResponse
    {
        abort_unless($request->user()->hasPermissionTo('adjust inventory'), 403);

        $request->validate([
            'reason'                => ['required', 'string', 'min:5', 'max:255'],
            'counts'                => ['required', 'array', 'min:1'],
            'counts.*.product_id'   => ['required', 'integer', 'exists:products,id'],
            'counts.*.actual_count' => ['required', 'integer', 'min:0'],
        ]);

        $counts = collect($request->input('counts'));
        $productIds = $counts->pluck('product_id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $adjusted = 0;

        DB::transaction(function () use ($counts, $products, $request, &$adjusted) {
            foreach ($counts as $item) {
                $product = $products->get($item['product_id']);
                if (! $product) {
                    continue;
                }

                $actual = (int) $item['actual_count'];
                if ($actual === $product->stock_quantity) {
                    continue; // no change
                }

                $this->inventory->adjust($product, $actual, $request->input('reason'), $request->user());
                $adjusted++;
            }
        });

        return redirect()->route('admin.inventory.index')
            ->with('success', "Physical count complete — {$adjusted} product(s) adjusted.");
    }

    public function allMovements(Request $request): Response
    {
        $query = StockMovement::with(['product:id,name,sku', 'user:id,name'])
            ->latest();

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        return Inertia::render('inventory/AllMovements', [
            'movements'      => $query->paginate(50)->withQueryString(),
            'movementTypes'  => array_map(
                fn ($case) => ['value' => $case->value, 'label' => $case->label()],
                \App\Enums\StockMovementType::cases()
            ),
            'filters'        => $request->only(['product_id', 'type', 'date_from', 'date_to']),
        ]);
    }
}
