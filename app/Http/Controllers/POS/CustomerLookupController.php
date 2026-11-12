<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerLookupController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $term = $request->validate([
            'q' => ['required', 'string', 'min:1', 'max:100'],
        ])['q'];

        $customers = Customer::active()
            ->search($term)
            ->select(['id', 'name', 'phone', 'email', 'discount_rate', 'loyalty_points'])
            ->limit(10)
            ->get();

        return response()->json(['customers' => $customers]);
    }
}
