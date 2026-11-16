<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\PurchaseOrder;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function sales(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request);

        $base = Sale::completed()->whereBetween('created_at', [$from, $to]);

        $summary = [
            'total_revenue'     => (int) (clone $base)->sum('total_amount'),
            'transaction_count' => (clone $base)->count(),
            'total_vat'         => (int) (clone $base)->sum('vat_amount'),
            'total_discounts'   => (int) (clone $base)->sum('discount_amount'),
            'vatable_sales'     => (int) (clone $base)->sum('vatable_sales'),
            'vat_exempt_sales'  => (int) (clone $base)->sum('vat_exempt_sales'),
            'zero_rated_sales'  => (int) (clone $base)->sum('zero_rated_sales'),
        ];

        $summary['avg_sale'] = $summary['transaction_count'] > 0
            ? intdiv($summary['total_revenue'], $summary['transaction_count'])
            : 0;

        $daily = (clone $base)
            ->selectRaw("DATE(created_at) as date,
                COUNT(*) as transactions,
                SUM(total_amount) as revenue,
                SUM(vat_amount) as vat,
                SUM(discount_amount) as discounts,
                SUM(vatable_sales) as vatable,
                SUM(vat_exempt_sales) as vat_exempt")
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $payments = SalePayment::whereHas(
            'sale',
            fn ($q) => $q->completed()->whereBetween('created_at', [$from, $to])
        )
            ->selectRaw('payment_method, COUNT(*) as transactions, SUM(amount) as total_amount')
            ->groupBy('payment_method')
            ->orderByDesc('total_amount')
            ->get();

        return Inertia::render('reports/Sales', [
            'summary'      => $summary,
            'daily'        => $daily,
            'payments'     => $payments,
            'filters'      => $this->filtersForView($request),
            'dateFrom'     => $from->toDateString(),
            'dateTo'       => $to->toDateString(),
        ]);
    }

    public function products(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request);
        $canViewProfit = $request->user()->can('view profit reports');

        $rows = SaleItem::whereHas(
            'sale',
            fn ($q) => $q->completed()->whereBetween('created_at', [$from, $to])
        )
            ->selectRaw(
                'product_name, product_sku,
                 SUM(quantity) as qty_sold,
                 SUM(line_total) as revenue,
                 SUM(cost_price * quantity) as total_cost'
            )
            ->groupBy('product_name', 'product_sku')
            ->orderByDesc('revenue')
            ->limit(100)
            ->get()
            ->map(function ($row) use ($canViewProfit) {
                $data = [
                    'product_name' => $row->product_name,
                    'product_sku'  => $row->product_sku,
                    'qty_sold'     => (int) $row->qty_sold,
                    'revenue'      => (int) $row->revenue,
                ];
                if ($canViewProfit) {
                    $cost          = (int) $row->total_cost;
                    $profit        = $data['revenue'] - $cost;
                    $data['cost']  = $cost;
                    $data['profit']= $profit;
                    $data['margin']= $data['revenue'] > 0
                        ? round($profit / $data['revenue'] * 100, 1)
                        : 0;
                }

                return $data;
            });

        return Inertia::render('reports/Products', [
            'rows'          => $rows,
            'canViewProfit' => $canViewProfit,
            'filters'       => $this->filtersForView($request),
            'dateFrom'      => $from->toDateString(),
            'dateTo'        => $to->toDateString(),
        ]);
    }

    public function cashiers(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request);

        $rows = Sale::completed()
            ->whereBetween('created_at', [$from, $to])
            ->with('cashier:id,name')
            ->selectRaw(
                'cashier_id,
                 COUNT(*) as transactions,
                 SUM(total_amount) as revenue,
                 SUM(discount_amount) as discounts,
                 AVG(total_amount) as avg_sale'
            )
            ->groupBy('cashier_id')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($row) => [
                'cashier_id'   => $row->cashier_id,
                'cashier_name' => $row->cashier?->name ?? 'Unknown',
                'transactions' => (int) $row->transactions,
                'revenue'      => (int) $row->revenue,
                'discounts'    => (int) $row->discounts,
                'avg_sale'     => (int) $row->avg_sale,
            ]);

        return Inertia::render('reports/Cashiers', [
            'rows'     => $rows,
            'filters'  => $this->filtersForView($request),
            'dateFrom' => $from->toDateString(),
            'dateTo'   => $to->toDateString(),
        ]);
    }

    public function refunds(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request);

        // Refund records have original_sale_id set and status = 'refunded'
        $base = Sale::where('status', 'refunded')
            ->whereNotNull('original_sale_id')
            ->whereBetween('created_at', [$from, $to]);

        // ── Summary ───────────────────────────────────────────────────────
        $totalRefunds   = (clone $base)->count();
        $totalAmount    = (int) (clone $base)->sum('total_amount');

        // Compare against completed sales in same period for refund rate
        $totalSales     = Sale::completed()->whereBetween('created_at', [$from, $to])->count();
        $totalRevenue   = (int) Sale::completed()->whereBetween('created_at', [$from, $to])->sum('total_amount');
        $refundRate     = $totalSales > 0 ? round($totalRefunds / $totalSales * 100, 1) : 0.0;
        $refundAmtRate  = $totalRevenue > 0 ? round($totalAmount / $totalRevenue * 100, 1) : 0.0;

        // ── Per-cashier breakdown ─────────────────────────────────────────
        $byCashier = (clone $base)
            ->with('cashier:id,name')
            ->selectRaw('cashier_id, COUNT(*) as refund_count, SUM(total_amount) as refund_total')
            ->groupBy('cashier_id')
            ->orderByDesc('refund_total')
            ->get()
            ->map(fn ($r) => [
                'cashier_id'   => $r->cashier_id,
                'cashier_name' => $r->cashier?->name ?? 'Unknown',
                'refund_count' => (int) $r->refund_count,
                'refund_total' => (int) $r->refund_total,
            ]);

        // ── Top refunded products ─────────────────────────────────────────
        $topProducts = SaleItem::whereHas(
            'sale',
            fn ($q) => $q->where('status', 'refunded')
                ->whereNotNull('original_sale_id')
                ->whereBetween('created_at', [$from, $to])
        )
            ->selectRaw('product_name, product_sku, SUM(quantity) as qty, SUM(line_total) as refund_amount')
            ->groupBy('product_name', 'product_sku')
            ->orderByDesc('refund_amount')
            ->limit(10)
            ->get();

        // ── Individual refund list ────────────────────────────────────────
        $list = (clone $base)
            ->with(['cashier:id,name', 'originalSale:id,receipt_number'])
            ->latest()
            ->limit(50)
            ->get(['id', 'receipt_number', 'cashier_id', 'original_sale_id', 'total_amount', 'notes', 'created_at']);

        return Inertia::render('reports/Refunds', [
            'summary' => [
                'total_refunds'    => $totalRefunds,
                'total_amount'     => $totalAmount,
                'total_sales'      => $totalSales,
                'refund_rate'      => $refundRate,
                'refund_amt_rate'  => $refundAmtRate,
            ],
            'byCashier'   => $byCashier->values(),
            'topProducts' => $topProducts,
            'list'        => $list,
            'filters'     => $this->filtersForView($request),
            'dateFrom'    => $from->toDateString(),
            'dateTo'      => $to->toDateString(),
        ]);
    }

    public function suppliers(Request $request): Response
    {
        $this->authorize('viewAny', \App\Models\PurchaseOrder::class);

        [$from, $to] = $this->dateRange($request);

        // ── Per-supplier aggregates ───────────────────────────────────────
        $rows = PurchaseOrder::whereBetween('created_at', [$from, $to])
            ->whereNotIn('status', ['cancelled'])
            ->with('supplier:id,company_name,phone,email')
            ->selectRaw(
                'supplier_id,
                 COUNT(*) as total_orders,
                 SUM(subtotal) as total_ordered,
                 SUM(CASE WHEN status IN (\'received\',\'partially_received\') THEN subtotal ELSE 0 END) as total_received,
                 COUNT(CASE WHEN status = \'received\' THEN 1 END) as completed_orders,
                 MAX(created_at) as last_order_at'
            )
            ->groupBy('supplier_id')
            ->orderByDesc('total_ordered')
            ->get()
            ->map(fn ($row) => [
                'supplier_id'       => $row->supplier_id,
                'company_name'      => $row->supplier?->company_name ?? 'Unknown',
                'phone'             => $row->supplier?->phone,
                'email'             => $row->supplier?->email,
                'total_orders'      => (int) $row->total_orders,
                'completed_orders'  => (int) $row->completed_orders,
                'total_ordered'     => (int) $row->total_ordered,
                'total_received'    => (int) $row->total_received,
                'last_order_at'     => $row->last_order_at,
            ]);

        $summary = [
            'total_suppliers'  => $rows->count(),
            'total_orders'     => $rows->sum('total_orders'),
            'total_ordered'    => $rows->sum('total_ordered'),
            'total_received'   => $rows->sum('total_received'),
        ];

        return Inertia::render('reports/Suppliers', [
            'rows'     => $rows->values(),
            'summary'  => $summary,
            'filters'  => $this->filtersForView($request),
            'dateFrom' => $from->toDateString(),
            'dateTo'   => $to->toDateString(),
        ]);
    }

    public function hourly(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request);

        $base = Sale::completed()->whereBetween('created_at', [$from, $to]);

        // ── By hour of day (0–23) ─────────────────────────────────────────
        $hourRows = (clone $base)
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as transactions, SUM(total_amount) as revenue')
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->keyBy('hour');

        $byHour = collect(range(0, 23))->map(fn ($h) => [
            'hour'         => $h,
            'label'        => str_pad($h, 2, '0', STR_PAD_LEFT) . ':00',
            'transactions' => (int) ($hourRows->get($h)?->transactions ?? 0),
            'revenue'      => (int) ($hourRows->get($h)?->revenue ?? 0),
        ])->values();

        // ── By day of week (1=Sun … 7=Sat in MySQL DAYOFWEEK) ────────────
        $dayRows = (clone $base)
            ->selectRaw('DAYOFWEEK(created_at) as dow, COUNT(*) as transactions, SUM(total_amount) as revenue')
            ->groupBy('dow')
            ->orderBy('dow')
            ->get()
            ->keyBy('dow');

        // Re-map to Mon=1 … Sun=7 order for display
        $dayNames = [1 => 'Sun', 2 => 'Mon', 3 => 'Tue', 4 => 'Wed', 5 => 'Thu', 6 => 'Fri', 7 => 'Sat'];
        $displayOrder = [2, 3, 4, 5, 6, 7, 1]; // Mon first

        $byDay = collect($displayOrder)->map(fn ($dow) => [
            'dow'          => $dow,
            'label'        => $dayNames[$dow],
            'transactions' => (int) ($dayRows->get($dow)?->transactions ?? 0),
            'revenue'      => (int) ($dayRows->get($dow)?->revenue ?? 0),
        ])->values();

        // ── Summary ───────────────────────────────────────────────────────
        $totalRevenue = (int) (clone $base)->sum('total_amount');
        $totalTx      = (clone $base)->count();

        // Top 3 peak hours by transactions
        $peakHours = $byHour->sortByDesc('transactions')->take(3)->values();

        return Inertia::render('reports/Hourly', [
            'byHour'    => $byHour,
            'byDay'     => $byDay,
            'peakHours' => $peakHours,
            'summary'   => [
                'total_revenue' => $totalRevenue,
                'total_tx'      => $totalTx,
            ],
            'filters'  => $this->filtersForView($request),
            'dateFrom' => $from->toDateString(),
            'dateTo'   => $to->toDateString(),
        ]);
    }

    public function tax(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request);

        $base = Sale::completed()->whereBetween('created_at', [$from, $to]);

        // ── Aggregate summary ─────────────────────────────────────────────
        $agg = (clone $base)->selectRaw(
            'COUNT(*) as transaction_count,
             SUM(subtotal)          as gross_sales,
             SUM(discount_amount)   as total_discounts,
             SUM(vatable_sales)     as vatable_net,
             SUM(vat_amount)        as output_vat,
             SUM(vat_exempt_sales)  as vat_exempt,
             SUM(zero_rated_sales)  as zero_rated,
             SUM(total_amount)      as net_sales'
        )->first();

        $summary = [
            'transaction_count' => (int) ($agg->transaction_count ?? 0),
            'gross_sales'       => (int) ($agg->gross_sales ?? 0),
            'total_discounts'   => (int) ($agg->total_discounts ?? 0),
            'vatable_net'       => (int) ($agg->vatable_net ?? 0),
            'output_vat'        => (int) ($agg->output_vat ?? 0),
            'vat_exempt'        => (int) ($agg->vat_exempt ?? 0),
            'zero_rated'        => (int) ($agg->zero_rated ?? 0),
            'net_sales'         => (int) ($agg->net_sales ?? 0),
        ];

        // ── Daily breakdown ───────────────────────────────────────────────
        $daily = (clone $base)->selectRaw(
            'DATE(created_at) as date,
             COUNT(*)                as transactions,
             SUM(subtotal)           as gross_sales,
             SUM(discount_amount)    as discounts,
             SUM(vatable_sales)      as vatable_net,
             SUM(vat_amount)         as output_vat,
             SUM(vat_exempt_sales)   as vat_exempt,
             SUM(zero_rated_sales)   as zero_rated,
             SUM(total_amount)       as net_sales'
        )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('reports/Tax', [
            'summary'  => $summary,
            'daily'    => $daily,
            'filters'  => $this->filtersForView($request),
            'dateFrom' => $from->toDateString(),
            'dateTo'   => $to->toDateString(),
        ]);
    }

    public function customers(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request);

        // ── Per-customer aggregates within the date range ─────────────────
        $rows = Sale::completed()
            ->whereBetween('created_at', [$from, $to])
            ->whereNotNull('customer_id')
            ->with('customer:id,name,phone,email,loyalty_points')
            ->selectRaw(
                'customer_id,
                 COUNT(*) as transactions,
                 SUM(total_amount) as total_spent,
                 AVG(total_amount) as avg_transaction,
                 MAX(created_at) as last_visit'
            )
            ->groupBy('customer_id')
            ->orderByDesc('total_spent')
            ->get()
            ->map(fn ($row) => [
                'customer_id'    => $row->customer_id,
                'name'           => $row->customer?->name ?? 'Unknown',
                'phone'          => $row->customer?->phone,
                'email'          => $row->customer?->email,
                'loyalty_points' => (int) ($row->customer?->loyalty_points ?? 0),
                'transactions'   => (int) $row->transactions,
                'total_spent'    => (int) $row->total_spent,
                'avg_transaction'=> (int) $row->avg_transaction,
                'last_visit'     => $row->last_visit,
            ]);

        // ── Summary ───────────────────────────────────────────────────────
        $totalCustomers  = $rows->count();
        $totalRevenue    = $rows->sum('total_spent');
        $totalTx         = $rows->sum('transactions');
        $avgSpend        = $totalCustomers > 0 ? intdiv($totalRevenue, $totalCustomers) : 0;
        $repeatCustomers = $rows->where('transactions', '>', 1)->count();

        // ── Walk-in (no customer) revenue in period ───────────────────────
        $walkInRevenue = (int) Sale::completed()
            ->whereBetween('created_at', [$from, $to])
            ->whereNull('customer_id')
            ->sum('total_amount');

        return Inertia::render('reports/Customers', [
            'rows'            => $rows->values(),
            'summary'         => [
                'total_customers'  => $totalCustomers,
                'total_revenue'    => $totalRevenue,
                'total_tx'         => $totalTx,
                'avg_spend'        => $avgSpend,
                'repeat_customers' => $repeatCustomers,
                'walkin_revenue'   => $walkInRevenue,
            ],
            'filters'  => $this->filtersForView($request),
            'dateFrom' => $from->toDateString(),
            'dateTo'   => $to->toDateString(),
        ]);
    }

    public function voids(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request);

        $base = Sale::where('status', 'void')
            ->whereBetween('created_at', [$from, $to]);

        $totalVoids   = (clone $base)->count();
        $totalAmount  = (int) (clone $base)->sum('total_amount');

        $totalSales   = Sale::completed()->whereBetween('created_at', [$from, $to])->count();
        $voidRate     = ($totalSales + $totalVoids) > 0
            ? round($totalVoids / ($totalSales + $totalVoids) * 100, 1)
            : 0.0;

        // Per cashier
        $byCashier = (clone $base)
            ->with('cashier:id,name')
            ->selectRaw('cashier_id, COUNT(*) as cnt, SUM(total_amount) as total')
            ->groupBy('cashier_id')
            ->get()
            ->map(fn ($r) => [
                'cashier_id'   => $r->cashier_id,
                'name'         => $r->cashier?->name ?? 'Unknown',
                'count'        => (int) $r->cnt,
                'total_amount' => (int) $r->total,
            ])
            ->sortByDesc('count')
            ->values();

        // Recent void list
        $recentVoids = (clone $base)
            ->with(['cashier:id,name', 'items'])
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($s) => [
                'id'           => $s->id,
                'receipt_number' => $s->receipt_number,
                'total_amount' => (int) $s->total_amount,
                'notes'        => $s->notes,
                'cashier'      => $s->cashier?->name ?? '—',
                'voided_at'    => $s->updated_at,
                'item_count'   => $s->items->count(),
            ]);

        return Inertia::render('reports/Voids', [
            'summary' => [
                'total_voids'  => $totalVoids,
                'total_amount' => $totalAmount,
                'void_rate'    => $voidRate,
                'total_sales'  => $totalSales,
            ],
            'byCashier'   => $byCashier,
            'recentVoids' => $recentVoids,
            'filters'     => $this->filtersForView($request),
            'dateFrom'    => $from->toDateString(),
            'dateTo'      => $to->toDateString(),
        ]);
    }

    public function birExport(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        [$from, $to] = $this->dateRange($request, 'this_month');

        $sales = Sale::completed()
            ->with(['customer:id,name,tin', 'payments:sale_id,payment_method,amount'])
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at')
            ->get(['id', 'receipt_number', 'created_at', 'customer_id',
                   'subtotal', 'discount_amount', 'total_amount',
                   'vatable_sales', 'vat_amount', 'vat_exempt_sales', 'zero_rated_sales']);

        $summary = [
            'total_transactions' => $sales->count(),
            'gross_sales'        => (int) $sales->sum('total_amount'),
            'vatable_sales'      => (int) $sales->sum('vatable_sales'),
            'vat_amount'         => (int) $sales->sum('vat_amount'),
            'vat_exempt'         => (int) $sales->sum('vat_exempt_sales'),
            'zero_rated'         => (int) $sales->sum('zero_rated_sales'),
            'discounts'          => (int) $sales->sum('discount_amount'),
        ];

        return Inertia::render('reports/BIRExport', [
            'sales'    => $sales->map(fn ($s) => [
                'id'              => $s->id,
                'receipt_number'  => $s->receipt_number,
                'date'            => $s->created_at->toDateTimeString(),
                'customer_name'   => $s->customer?->name ?? 'Walk-in',
                'customer_tin'    => $s->customer?->tin ?? '',
                'vatable_sales'   => (int) $s->vatable_sales,
                'vat_amount'      => (int) $s->vat_amount,
                'vat_exempt'      => (int) $s->vat_exempt_sales,
                'zero_rated'      => (int) $s->zero_rated_sales,
                'discount'        => (int) $s->discount_amount,
                'total_amount'    => (int) $s->total_amount,
            ]),
            'summary'  => $summary,
            'filters'  => $this->filtersForView($request) + ['preset' => $request->input('preset', 'this_month')],
            'dateFrom' => $from->toDateString(),
            'dateTo'   => $to->toDateString(),
        ]);
    }

    public function profitLoss(Request $request): Response
    {
        $this->authorize('viewAny', Sale::class);

        $preset = $request->input('preset', 'this_month');
        [$from, $to] = $this->dateRange($request, $preset);

        // ── Revenue ───────────────────────────────────────────────────────
        $completedBase = Sale::completed()->whereBetween('created_at', [$from, $to]);

        $grossSales   = (int) (clone $completedBase)->sum('total_amount');
        $discounts    = (int) (clone $completedBase)->sum('discount_amount');

        $refundTotal  = (int) Sale::where('status', 'refunded')
            ->whereNotNull('original_sale_id')
            ->whereBetween('created_at', [$from, $to])
            ->sum('total_amount');

        $netRevenue = $grossSales - $refundTotal;

        // ── COGS (stock moved out for sales in this period) ───────────────
        $cogs = (int) StockMovement::where('type', 'sale')
            ->whereBetween('created_at', [$from, $to])
            ->selectRaw('SUM(ABS(quantity) * unit_cost) as total')
            ->value('total');

        $grossProfit  = $netRevenue - $cogs;
        $grossMargin  = $netRevenue > 0 ? round($grossProfit / $netRevenue * 100, 1) : 0;

        // ── Expenses ──────────────────────────────────────────────────────
        $expenseRows = Expense::whereBetween('expense_date', [$from->toDateString(), $to->toDateString()])
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->get()
            ->mapWithKeys(fn ($r) => [$r->category => (int) $r->total]);

        $totalExpenses   = $expenseRows->sum();
        $netIncome       = $grossProfit - $totalExpenses;
        $netMargin       = $netRevenue > 0 ? round($netIncome / $netRevenue * 100, 1) : 0;

        // ── Daily breakdown ───────────────────────────────────────────────
        $dailySales = Sale::completed()
            ->whereBetween('created_at', [$from, $to])
            ->selectRaw('DATE(created_at) as day, SUM(total_amount) as revenue, SUM(discount_amount) as discounts')
            ->groupBy('day')
            ->pluck(null, 'day')
            ->map(fn ($r) => ['revenue' => (int) $r->revenue, 'discounts' => (int) $r->discounts]);

        $dailyRefunds = Sale::where('status', 'refunded')
            ->whereNotNull('original_sale_id')
            ->whereBetween('created_at', [$from, $to])
            ->selectRaw('DATE(created_at) as day, SUM(total_amount) as refunds')
            ->groupBy('day')
            ->pluck('refunds', 'day');

        $dailyCogs = StockMovement::where('type', 'sale')
            ->whereBetween('created_at', [$from, $to])
            ->selectRaw('DATE(created_at) as day, SUM(ABS(quantity) * unit_cost) as cogs')
            ->groupBy('day')
            ->pluck('cogs', 'day');

        $dailyExpenses = Expense::whereBetween('expense_date', [$from->toDateString(), $to->toDateString()])
            ->selectRaw('expense_date as day, SUM(amount) as expenses')
            ->groupBy('day')
            ->pluck('expenses', 'day');

        // Build a continuous daily series
        $days      = [];
        $cursor    = $from->copy()->startOfDay();
        $endDate   = $to->copy()->startOfDay();
        while ($cursor <= $endDate) {
            $d        = $cursor->toDateString();
            $rev      = (int) ($dailySales[$d]['revenue']  ?? 0);
            $ref      = (int) ($dailyRefunds[$d]           ?? 0);
            $c        = (int) ($dailyCogs[$d]              ?? 0);
            $exp      = (int) ($dailyExpenses[$d]          ?? 0);
            $net      = $rev - $ref;
            $gp       = $net - $c;
            $days[]   = [
                'date'         => $d,
                'revenue'      => $rev,
                'refunds'      => $ref,
                'net_revenue'  => $net,
                'cogs'         => $c,
                'gross_profit' => $gp,
                'expenses'     => $exp,
                'net_income'   => $gp - $exp,
            ];
            $cursor->addDay();
        }

        return Inertia::render('reports/ProfitLoss', [
            'summary'       => [
                'gross_sales'    => $grossSales,
                'discounts'      => $discounts,
                'refunds'        => $refundTotal,
                'net_revenue'    => $netRevenue,
                'cogs'           => $cogs,
                'gross_profit'   => $grossProfit,
                'gross_margin'   => $grossMargin,
                'total_expenses' => $totalExpenses,
                'net_income'     => $netIncome,
                'net_margin'     => $netMargin,
            ],
            'expenseByCategory' => $expenseRows,
            'expenseCategories' => Expense::categories(),
            'days'              => $days,
            'filters'           => $this->filtersForView($request) + ['preset' => $preset],
            'dateFrom'          => $from->toDateString(),
            'dateTo'            => $to->toDateString(),
        ]);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private function dateRange(Request $request, string $defaultPreset = 'today'): array
    {
        $preset = $request->input('preset', $defaultPreset);

        return match ($preset) {
            'yesterday'  => [now()->subDay()->startOfDay(),         now()->subDay()->endOfDay()],
            'this_week'  => [now()->startOfWeek(),                  now()->endOfWeek()],
            'last_week'  => [now()->subWeek()->startOfWeek(),       now()->subWeek()->endOfWeek()],
            'this_month' => [now()->startOfMonth(),                 now()->endOfMonth()],
            'last_month' => [now()->subMonth()->startOfMonth(),     now()->subMonth()->endOfMonth()],
            'custom'     => [
                Carbon::parse($request->input('date_from', now()->toDateString()))->startOfDay(),
                Carbon::parse($request->input('date_to',   now()->toDateString()))->endOfDay(),
            ],
            default      => [now()->startOfDay(), now()->endOfDay()], // today
        };
    }

    private function filtersForView(Request $request): array
    {
        return $request->only('preset', 'date_from', 'date_to');
    }
}
