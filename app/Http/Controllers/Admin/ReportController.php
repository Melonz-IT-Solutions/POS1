<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\SalePayment;
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

    // ── Helpers ─────────────────────────────────────────────────────────────

    private function dateRange(Request $request): array
    {
        $preset = $request->input('preset', 'today');

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
