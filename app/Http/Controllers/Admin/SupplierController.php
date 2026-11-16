<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSupplierRequest;
use App\Http\Requests\Admin\UpdateSupplierRequest;
use App\Models\AuditLog;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Supplier::class);

        $query = Supplier::withCount('products');

        $status = $request->input('status');
        if ($status === 'deleted') {
            $query->onlyTrashed();
        } elseif ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('suppliers/Index', [
            'suppliers' => $query->orderBy('company_name')->paginate(20)->withQueryString(),
            'filters'   => $request->only('search', 'status'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Supplier::class);

        return Inertia::render('suppliers/Create', [
            'products' => Product::where('is_active', true)
                ->select('id', 'name', 'sku')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreSupplierRequest $request): RedirectResponse
    {
        $supplier = Supplier::create([
            'company_name'   => $request->input('company_name'),
            'contact_person' => $request->input('contact_person'),
            'phone'          => $request->input('phone'),
            'email'          => $request->input('email'),
            'address'        => $request->input('address'),
            'tin'            => $request->input('tin'),
            'is_active'      => $request->boolean('is_active', true),
        ]);

        $supplier->products()->sync($request->input('product_ids', []));

        AuditLog::record('supplier.create', $supplier, [], $supplier->toArray());

        return redirect()->route('admin.suppliers.index')
            ->with('success', "Supplier \"{$supplier->company_name}\" created.");
    }

    public function show(Supplier $supplier): Response
    {
        $this->authorize('view', $supplier);

        $supplier->load(['products:id,name,sku,selling_price,stock_quantity,minimum_stock,is_active']);

        $recentOrders = $supplier->purchaseOrders()
            ->with('orderedBy:id,name')
            ->latest()
            ->limit(10)
            ->get();

        $totalSpend = (int) $supplier->purchaseOrders()
            ->whereIn('status', ['received', 'partially_received'])
            ->sum('subtotal');

        return Inertia::render('suppliers/Show', [
            'supplier'     => $supplier,
            'recentOrders' => $recentOrders,
            'stats'        => [
                'products_count' => $supplier->products()->count(),
                'orders_count'   => $supplier->purchaseOrders()->count(),
                'total_spend'    => $totalSpend,
                'pending_orders' => $supplier->purchaseOrders()
                    ->whereIn('status', ['draft', 'ordered', 'partially_received'])
                    ->count(),
            ],
            'canEdit' => auth()->user()->can('update', $supplier),
        ]);
    }

    public function edit(Supplier $supplier): Response
    {
        $this->authorize('update', $supplier);

        $supplier->load('products:id,name,sku');

        return Inertia::render('suppliers/Edit', [
            'supplier' => $supplier,
            'products' => Product::where('is_active', true)
                ->select('id', 'name', 'sku')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        $old = $supplier->toArray();

        $supplier->update([
            'company_name'   => $request->input('company_name'),
            'contact_person' => $request->input('contact_person'),
            'phone'          => $request->input('phone'),
            'email'          => $request->input('email'),
            'address'        => $request->input('address'),
            'tin'            => $request->input('tin'),
            'is_active'      => $request->boolean('is_active', true),
        ]);

        $supplier->products()->sync($request->input('product_ids', []));

        AuditLog::record('supplier.update', $supplier, $old, $supplier->fresh()->toArray());

        return redirect()->route('admin.suppliers.index')
            ->with('success', "Supplier \"{$supplier->company_name}\" updated.");
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        $this->authorize('delete', $supplier);

        $name = $supplier->company_name;
        AuditLog::record('supplier.delete', $supplier, $supplier->toArray(), []);
        $supplier->delete();

        return back()->with('success', "Supplier \"{$name}\" deleted.");
    }

    public function restore(int $id): RedirectResponse
    {
        $supplier = Supplier::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $supplier);
        $supplier->restore();

        return back()->with('success', "Supplier \"{$supplier->company_name}\" restored.");
    }
}
