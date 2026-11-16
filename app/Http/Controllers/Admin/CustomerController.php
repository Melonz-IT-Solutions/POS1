<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCustomerRequest;
use App\Http\Requests\Admin\UpdateCustomerRequest;
use App\Models\AuditLog;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Customer::withTrashed()
            ->withCount('sales')
            ->orderBy('name');

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        if ($request->filled('status')) {
            match ($request->input('status')) {
                'active'   => $query->whereNull('deleted_at')->where('is_active', true),
                'inactive' => $query->whereNull('deleted_at')->where('is_active', false),
                'deleted'  => $query->whereNotNull('deleted_at'),
                default    => null,
            };
        }

        return Inertia::render('customers/Index', [
            'customers' => $query->paginate(25)->withQueryString(),
            'filters'   => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('customers/Create');
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $customer = Customer::create($request->validated());

        AuditLog::record('customer.create', $customer, [], $customer->toArray());

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', "Customer \"{$customer->name}\" created.");
    }

    public function show(Customer $customer): Response
    {
        $sales = $customer->sales()
            ->with('cashier:id,name')
            ->latest()
            ->paginate(10, ['*'], 'sales_page');

        $loyaltyTransactions = $customer->loyaltyTransactions()
            ->latest()
            ->paginate(10, ['*'], 'loyalty_page');

        $stats = [
            'total_sales'      => $customer->sales()->where('status', 'completed')->count(),
            'total_spent'      => (int) $customer->sales()->where('status', 'completed')->sum('total_amount'),
            'loyalty_points'   => $customer->loyalty_points,
            'discount_rate'    => $customer->discount_rate,
        ];

        return Inertia::render('customers/Show', [
            'customer'            => $customer,
            'sales'               => $sales,
            'loyaltyTransactions' => $loyaltyTransactions,
            'stats'               => $stats,
        ]);
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $old = $customer->toArray();
        $customer->update($request->validated());

        AuditLog::record('customer.update', $customer, $old, $customer->fresh()->toArray());

        return redirect()->route('admin.customers.show', $customer)
            ->with('success', 'Customer updated.');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        $this->authorize('delete', $customer);

        $old = $customer->toArray();
        $customer->delete();

        AuditLog::record('customer.delete', null, $old, []);

        return redirect()->route('admin.customers.index')
            ->with('success', "Customer \"{$customer->name}\" archived.");
    }

    public function restore(int $id): RedirectResponse
    {
        $customer = Customer::withTrashed()->findOrFail($id);
        $this->authorize('restore', $customer);

        $customer->restore();

        AuditLog::record('customer.restore', $customer, [], $customer->toArray());

        return back()->with('success', "Customer \"{$customer->name}\" restored.");
    }

    public function adjustPoints(Request $request, Customer $customer): RedirectResponse
    {
        $this->authorize('update', $customer);

        $request->validate([
            'points'      => ['required', 'integer'],
            'description' => ['required', 'string', 'max:200'],
        ]);

        $newBalance = $customer->loyalty_points + $request->input('points');

        if ($newBalance < 0) {
            return back()->withErrors(['points' => 'Insufficient loyalty points.']);
        }

        $customer->loyaltyTransactions()->create([
            'type'            => $request->input('points') > 0 ? 'earn' : 'redeem',
            'points'          => $request->input('points'),
            'running_balance' => $newBalance,
            'description'     => $request->input('description'),
        ]);

        $customer->update(['loyalty_points' => $newBalance]);

        return back()->with('success', 'Loyalty points adjusted.');
    }
}
