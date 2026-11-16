<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\SaleItem;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShiftController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Shift::class);

        $query = Shift::with('cashier:id,name')
            ->withCount('sales')
            ->withSum(['sales as total_sales' => fn ($q) => $q->where('status', 'completed')], 'total_amount');

        if ($request->filled('cashier_id')) {
            $query->where('cashier_id', $request->cashier_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('opened_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('opened_at', '<=', $request->date_to);
        }

        $shifts   = $query->orderByDesc('opened_at')->paginate(20)->withQueryString();
        $cashiers = User::whereHas('shifts')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('shifts/Index', [
            'shifts'   => $shifts,
            'cashiers' => $cashiers,
            'filters'  => $request->only(['cashier_id', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function show(Shift $shift): Response
    {
        $this->authorize('view', $shift);

        $shift->load([
            'cashier:id,name',
            'cashMovements.user:id,name',
        ]);

        $shift->loadCount('sales');
        $shift->loadSum(['sales as total_sales' => fn ($q) => $q->where('status', 'completed')], 'total_amount');
        $shift->loadSum(['sales as total_vat' => fn ($q) => $q->where('status', 'completed')], 'vat_amount');
        $shift->loadSum(['sales as total_discounts' => fn ($q) => $q->where('status', 'completed')], 'discount_amount');
        $shift->loadCount(['sales as void_count' => fn ($q) => $q->where('status', 'void')]);

        // Payment method breakdown for this shift
        $paymentBreakdown = $shift->sales()
            ->where('status', 'completed')
            ->join('sale_payments', 'sales.id', '=', 'sale_payments.sale_id')
            ->selectRaw('sale_payments.payment_method, SUM(sale_payments.amount) as total, COUNT(DISTINCT sales.id) as cnt')
            ->groupBy('sale_payments.payment_method')
            ->get();

        return Inertia::render('shifts/Show', [
            'shift'            => $shift,
            'paymentBreakdown' => $paymentBreakdown,
        ]);
    }

    public function report(Shift $shift): Response
    {
        $this->authorize('view', $shift);

        $shift->load(['cashier:id,name', 'cashMovements.user:id,name']);
        $shift->loadCount('sales');
        $shift->loadSum(['sales as total_sales'     => fn ($q) => $q->where('status', 'completed')], 'total_amount');
        $shift->loadSum(['sales as total_vat'       => fn ($q) => $q->where('status', 'completed')], 'vat_amount');
        $shift->loadSum(['sales as total_discounts' => fn ($q) => $q->where('status', 'completed')], 'discount_amount');
        $shift->loadCount(['sales as void_count'    => fn ($q) => $q->where('status', 'void')]);
        $shift->loadCount(['sales as completed_count' => fn ($q) => $q->where('status', 'completed')]);

        $paymentBreakdown = $shift->sales()
            ->where('status', 'completed')
            ->join('sale_payments', 'sales.id', '=', 'sale_payments.sale_id')
            ->selectRaw('sale_payments.payment_method, SUM(sale_payments.amount) as total, COUNT(DISTINCT sales.id) as cnt')
            ->groupBy('sale_payments.payment_method')
            ->get();

        $cashSales = (int) ($paymentBreakdown->firstWhere('payment_method', 'cash')?->total ?? 0);

        $topProducts = SaleItem::whereHas(
            'sale',
            fn ($q) => $q->where('shift_id', $shift->id)->where('status', 'completed')
        )
            ->selectRaw('product_name, product_sku, SUM(quantity) as qty, SUM(line_total) as revenue')
            ->groupBy('product_name', 'product_sku')
            ->orderByDesc('revenue')
            ->limit(10)
            ->get();

        $settings = [
            'business_name'    => Setting::get('business_name',    'My Store'),
            'business_address' => Setting::get('business_address', ''),
            'business_phone'   => Setting::get('business_phone',   ''),
            'business_tin'     => Setting::get('business_tin',     ''),
            'vat_registered'   => Setting::get('vat_registered', 'false') === 'true',
        ];

        return Inertia::render('shifts/Report', [
            'shift'            => $shift,
            'paymentBreakdown' => $paymentBreakdown,
            'cashSales'        => $cashSales,
            'topProducts'      => $topProducts,
            'settings'         => $settings,
        ]);
    }
}
