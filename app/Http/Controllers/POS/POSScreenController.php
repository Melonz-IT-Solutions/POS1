<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\PaymentMethod;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class POSScreenController extends Controller
{
    public function index(Request $request): Response
    {
        $user  = $request->user();
        $shift = $user->currentShift();

        $settings = [
            'business_name'    => Setting::get('business_name', 'POS System'),
            'receipt_prefix'   => Setting::get('receipt_prefix', 'OR'),
            'vat_inclusive'    => Setting::get('vat_inclusive', true),
            'vat_rate'         => Setting::get('vat_rate', 12),
            'currency_symbol'  => Setting::get('currency_symbol', '₱'),
            'loyalty_enabled'  => Setting::get('loyalty_enabled', false),
            'max_cashier_disc' => Setting::get('max_cashier_discount_pct', 500), // 5% in basis points
        ];

        $categories     = Category::active()->roots()->with('children')->orderBy('sort_order')->get();
        $paymentMethods = PaymentMethod::active()->get();

        return Inertia::render('pos/Index', [
            'shift'          => $shift,
            'settings'       => $settings,
            'categories'     => $categories,
            'paymentMethods' => $paymentMethods,
        ]);
    }
}
