<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDiscountRequest;
use App\Http\Requests\Admin\UpdateDiscountRequest;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Discount;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DiscountController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Discount::class);

        $query = Discount::query();

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
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        return Inertia::render('discounts/Index', [
            'discounts' => $query->latest()->paginate(20)->withQueryString(),
            'filters'   => $request->only('search', 'status'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Discount::class);

        return Inertia::render('discounts/Create', [
            'products'   => Product::where('is_active', true)->select('id', 'name', 'sku')->orderBy('name')->get(),
            'categories' => Category::where('is_active', true)->select('id', 'name')->orderBy('name')->get(),
            'customers'  => Customer::where('is_active', true)->select('id', 'name', 'phone')->orderBy('name')->get(),
        ]);
    }

    public function store(StoreDiscountRequest $request): RedirectResponse
    {
        $discount = Discount::create($this->prepareData($request));

        $this->syncRelations($discount, $request);

        AuditLog::record('discount.create', $discount, [], $discount->toArray());

        return redirect()->route('admin.discounts.index')
            ->with('success', "Discount \"{$discount->name}\" created.");
    }

    public function edit(Discount $discount): Response
    {
        $this->authorize('update', $discount);

        $discount->load(['products:id,name,sku', 'categories:id,name', 'customers:id,name,phone']);

        return Inertia::render('discounts/Edit', [
            'discount'   => $discount,
            'products'   => Product::where('is_active', true)->select('id', 'name', 'sku')->orderBy('name')->get(),
            'categories' => Category::where('is_active', true)->select('id', 'name')->orderBy('name')->get(),
            'customers'  => Customer::where('is_active', true)->select('id', 'name', 'phone')->orderBy('name')->get(),
        ]);
    }

    public function update(UpdateDiscountRequest $request, Discount $discount): RedirectResponse
    {
        $old = $discount->toArray();

        $discount->update($this->prepareData($request));
        $this->syncRelations($discount, $request);

        AuditLog::record('discount.update', $discount, $old, $discount->fresh()->toArray());

        return redirect()->route('admin.discounts.index')
            ->with('success', "Discount \"{$discount->name}\" updated.");
    }

    public function destroy(Discount $discount): RedirectResponse
    {
        $this->authorize('delete', $discount);

        $name = $discount->name;
        AuditLog::record('discount.delete', $discount, $discount->toArray(), []);
        $discount->delete();

        return back()->with('success', "Discount \"{$name}\" deleted.");
    }

    public function restore(int $id): RedirectResponse
    {
        $discount = Discount::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $discount);
        $discount->restore();

        return back()->with('success', "Discount \"{$discount->name}\" restored.");
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private function prepareData(Request $request): array
    {
        $value = (float) $request->input('value', 0);

        return [
            'name'         => $request->input('name'),
            'code'         => $request->input('code') ?: null,
            'type'         => $request->input('type'),
            // Both % and fixed: form sends plain number → convert ×100 (basis pts / centavos)
            'value'        => (int) round($value * 100),
            'min_purchase' => (int) round((float) $request->input('min_purchase', 0) * 100),
            'start_at'     => $request->input('start_at') ?: null,
            'end_at'       => $request->input('end_at') ?: null,
            'is_active'    => $request->boolean('is_active', true),
            'scope'        => $request->input('scope', 'all'),
        ];
    }

    private function syncRelations(Discount $discount, Request $request): void
    {
        $scope = $request->input('scope', 'all');

        $discount->products()->sync($scope === 'products' ? $request->input('product_ids', []) : []);
        $discount->categories()->sync($scope === 'categories' ? $request->input('category_ids', []) : []);
        $discount->customers()->sync($scope === 'customers' ? $request->input('customer_ids', []) : []);
    }
}
