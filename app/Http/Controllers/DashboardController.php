<?php

namespace App\Http\Controllers;

use App\Enums\PurchaseOrderStatus;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        // ── Today's KPIs ────────────────────────────────────────────────────
        $todayRow = Sale::completed()
            ->whereDate('created_at', today())
            ->selectRaw('COUNT(*) as cnt, SUM(total_amount) as revenue, SUM(vat_amount) as vat, SUM(discount_amount) as discounts')
            ->first();

        $yesterdayRow = Sale::completed()
            ->whereDate('created_at', today()->subDay())
            ->selectRaw('COUNT(*) as cnt, SUM(total_amount) as revenue')
            ->first();

        $monthRow = Sale::completed()
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->selectRaw('COUNT(*) as cnt, SUM(total_amount) as revenue')
            ->first();

        $todayRevenue      = (int) ($todayRow->revenue ?? 0);
        $todayTransactions = (int) ($todayRow->cnt ?? 0);

        $today = [
            'revenue'      => $todayRevenue,
            'transactions' => $todayTransactions,
            'vat'          => (int) ($todayRow->vat ?? 0),
            'discounts'    => (int) ($todayRow->discounts ?? 0),
            'avg_sale'     => $todayTransactions > 0 ? intdiv($todayRevenue, $todayTransactions) : 0,
        ];

        $yesterday = [
            'revenue'      => (int) ($yesterdayRow->revenue ?? 0),
            'transactions' => (int) ($yesterdayRow->cnt ?? 0),
        ];

        $month = [
            'revenue'      => (int) ($monthRow->revenue ?? 0),
            'transactions' => (int) ($monthRow->cnt ?? 0),
        ];

        // ── Low-stock alerts ────────────────────────────────────────────────
        $lowStockItems = Product::active()
            ->lowStock()
            ->select('id', 'name', 'sku', 'stock_quantity', 'minimum_stock')
            ->orderByRaw('stock_quantity - minimum_stock ASC')
            ->limit(10)
            ->get();

        // ── Recent sales ────────────────────────────────────────────────────
        $recentSales = Sale::completed()
            ->with(['cashier:id,name', 'customer:id,name'])
            ->latest()
            ->limit(8)
            ->get(['id', 'receipt_number', 'total_amount', 'cashier_id', 'customer_id', 'created_at']);

        // ── Top 5 products today ─────────────────────────────────────────────
        $topProducts = SaleItem::whereHas(
            'sale',
            fn ($q) => $q->completed()->whereDate('created_at', today())
        )
            ->selectRaw('product_name, product_sku, SUM(quantity) as qty, SUM(line_total) as revenue')
            ->groupBy('product_name', 'product_sku')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        // ── Pending purchase orders ──────────────────────────────────────────
        $pendingPOs = PurchaseOrder::whereIn('status', [
            PurchaseOrderStatus::Ordered,
            PurchaseOrderStatus::PartiallyReceived,
        ])
            ->with('supplier:id,company_name')
            ->orderBy('expected_date')
            ->limit(5)
            ->get(['id', 'po_number', 'status', 'supplier_id', 'expected_date', 'subtotal']);

        return Inertia::render('Dashboard', [
            'today'          => $today,
            'yesterday'      => $yesterday,
            'month'          => $month,
            'lowStockItems'  => $lowStockItems,
            'recentSales'    => $recentSales,
            'topProducts'    => $topProducts,
            'pendingPOs'     => $pendingPOs,
        ]);
    }
}
