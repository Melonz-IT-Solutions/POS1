<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StockAdjustmentRequest;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            'total_value'     => (int) Product::active()->selectRaw('SUM(stock_quantity * cost_price) as total')->value('total'),
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
