<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    public function index(): Response
    {
        abort_unless(auth()->user()->hasPermissionTo('manage settings'), 403);

        $methods = PaymentMethod::orderBy('sort_order')->orderBy('id')->get();

        return Inertia::render('payment-methods/Index', [
            'methods' => $methods,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->hasPermissionTo('manage settings'), 403);

        $data = $request->validate([
            'name'               => 'required|string|max:60',
            'code'               => 'required|string|max:30|unique:payment_methods,code',
            'type'               => 'required|in:cash,card,digital_wallet,other',
            'requires_reference' => 'boolean',
        ]);

        $data['sort_order']          = PaymentMethod::max('sort_order') + 1;
        $data['requires_reference'] ??= false;

        $method = PaymentMethod::create($data);

        AuditLog::record('payment_method.create', $method, [], $data);

        return back()->with('success', 'Payment method created.');
    }

    public function update(Request $request, PaymentMethod $paymentMethod): RedirectResponse
    {
        abort_unless($request->user()->hasPermissionTo('manage settings'), 403);

        $data = $request->validate([
            'name'               => 'required|string|max:60',
            'type'               => 'required|in:cash,card,digital_wallet,other',
            'requires_reference' => 'boolean',
        ]);

        $old = $paymentMethod->only(['name', 'type', 'requires_reference']);
        $paymentMethod->update($data);
        AuditLog::record('payment_method.update', $paymentMethod, $old, $data);

        return back()->with('success', 'Payment method updated.');
    }

    public function toggle(Request $request, PaymentMethod $paymentMethod): RedirectResponse
    {
        abort_unless($request->user()->hasPermissionTo('manage settings'), 403);

        $paymentMethod->update(['is_active' => ! $paymentMethod->is_active]);
        AuditLog::record('payment_method.toggle', $paymentMethod, [], ['is_active' => $paymentMethod->is_active]);

        return back();
    }

    public function reorder(Request $request): RedirectResponse
    {
        abort_unless($request->user()->hasPermissionTo('manage settings'), 403);

        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:payment_methods,id',
        ]);

        foreach ($request->ids as $position => $id) {
            PaymentMethod::where('id', $id)->update(['sort_order' => $position]);
        }

        return back();
    }
}
