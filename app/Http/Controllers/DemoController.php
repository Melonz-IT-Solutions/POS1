<?php

namespace App\Http\Controllers;

use App\Models\DemoProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DemoController extends Controller
{
    private const VALID_TYPES = [
        'coffeeshop', 'pharmacy', 'grocery', 'laundry',
        'minimart', 'hardware', 'wholesaler', 'electronics',
    ];

    public function show(Request $request): Response
    {
        $storeType = $request->query('type', 'grocery');

        if (! in_array($storeType, self::VALID_TYPES, true)) {
            $storeType = 'grocery';
        }

        $products = DemoProduct::where('store_type', $storeType)
            ->orderBy('category')
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/Demo', [
            'storeType' => $storeType,
            'products'  => $products,
        ]);
    }
}
