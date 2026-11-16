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
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        // ── Cashier-role gets a focused personal dashboard ───────────────────
        if ($request->user()->hasRole('Cashier') && ! $request->user()->hasRole(['Administrator', 'Manager'])) {
            return $this->cashierDashboard($request);
        }

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

        // ── Last 7 days revenue ─────────────────────────────────────────────
        $weekRows = Sale::completed()
            ->whereBetween('created_at', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as cnt')
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $weeklyRevenue = collect(range(6, 0))->map(function ($daysAgo) use ($weekRows) {
            $date = now()->subDays($daysAgo)->toDateString();
            $row  = $weekRows->get($date);
            return [
                'date'         => $date,
                'label'        => now()->subDays($daysAgo)->format('D'),
                'is_today'     => $daysAgo === 0,
                'revenue'      => (int) ($row?->revenue ?? 0),
                'transactions' => (int) ($row?->cnt ?? 0),
            ];
        })->values();

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
            'weeklyRevenue'  => $weeklyRevenue,
            'lowStockItems'  => $lowStockItems,
            'recentSales'    => $recentSales,
            'topProducts'    => $topProducts,
            'pendingPOs'     => $pendingPOs,
        ]);
    }

    private function cashierDashboard(Request $request): Response
    {
        $userId = $request->user()->id;
        $shift  = $request->user()->currentShift();

        // ── Today's personal stats ──────────────────────────────────────────
        $myTodayRow = Sale::completed()
            ->where('cashier_id', $userId)
            ->whereDate('created_at', today())
            ->selectRaw('COUNT(*) as cnt, SUM(total_amount) as revenue, SUM(discount_amount) as discounts')
            ->first();

        $myRevenue      = (int) ($myTodayRow->revenue ?? 0);
        $myTransactions = (int) ($myTodayRow->cnt ?? 0);

        $myToday = [
            'revenue'      => $myRevenue,
            'transactions' => $myTransactions,
            'discounts'    => (int) ($myTodayRow->discounts ?? 0),
            'avg_sale'     => $myTransactions > 0 ? intdiv($myRevenue, $myTransactions) : 0,
        ];

        // ── Shift stats (if open) ────────────────────────────────────────────
        $shiftStats = null;
        if ($shift) {
            $shiftRevenue = (int) $shift->sales()->where('status', 'completed')->sum('total_amount');
            $shiftCount   = $shift->sales()->where('status', 'completed')->count();
            $shiftMins    = (int) now()->diffInMinutes($shift->opened_at);

            $shiftStats = [
                'revenue'      => $shiftRevenue,
                'transactions' => $shiftCount,
                'duration_min' => $shiftMins,
            ];
        }

        // ── Last 7 days personal revenue ────────────────────────────────────
        $myWeekRows = Sale::completed()
            ->where('cashier_id', $userId)
            ->whereBetween('created_at', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue, COUNT(*) as cnt')
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $myWeeklyRevenue = collect(range(6, 0))->map(function ($daysAgo) use ($myWeekRows) {
            $date = now()->subDays($daysAgo)->toDateString();
            $row  = $myWeekRows->get($date);
            return [
                'date'         => $date,
                'label'        => now()->subDays($daysAgo)->format('D'),
                'is_today'     => $daysAgo === 0,
                'revenue'      => (int) ($row?->revenue ?? 0),
                'transactions' => (int) ($row?->cnt ?? 0),
            ];
        })->values();

        // ── Recent personal sales ────────────────────────────────────────────
        $myRecentSales = Sale::completed()
            ->where('cashier_id', $userId)
            ->with('customer:id,name')
            ->latest()
            ->limit(10)
            ->get(['id', 'receipt_number', 'total_amount', 'customer_id', 'created_at']);

        // ── Top products this cashier sold today ─────────────────────────────
        $myTopProducts = SaleItem::whereHas(
            'sale',
            fn ($q) => $q->completed()
                ->where('cashier_id', $userId)
                ->whereDate('created_at', today())
        )
            ->selectRaw('product_name, SUM(quantity) as qty, SUM(line_total) as revenue')
            ->groupBy('product_name')
            ->orderByDesc('qty')
            ->limit(5)
            ->get();

        return Inertia::render('CashierDashboard', [
            'today'          => $myToday,
            'shift'          => $shift,
            'shiftStats'     => $shiftStats,
            'weeklyRevenue'  => $myWeeklyRevenue,
            'recentSales'    => $myRecentSales,
            'topProducts'    => $myTopProducts,
        ]);
    }
}
