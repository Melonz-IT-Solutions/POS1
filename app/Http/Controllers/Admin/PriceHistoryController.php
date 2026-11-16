<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PriceHistory;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PriceHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->hasAnyPermission(['view products', 'manage settings']), 403);

        $query = PriceHistory::with(['product:id,name,sku', 'changedBy:id,name'])
            ->latest();

        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->filled('user_id')) {
            $query->where('changed_by', $request->user_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $histories = $query->paginate(30)->withQueryString();
        $products  = Product::orderBy('name')->get(['id', 'name', 'sku']);
        $users     = User::orderBy('name')->get(['id', 'name']);

        // If filtering by a single product, pass it for context
        $focusProduct = $request->filled('product_id')
            ? Product::find($request->product_id, ['id', 'name', 'sku'])
            : null;

        return Inertia::render('price-history/Index', [
            'histories'    => $histories,
            'products'     => $products,
            'users'        => $users,
            'focusProduct' => $focusProduct,
            'filters'      => $request->only(['product_id', 'user_id', 'date_from', 'date_to']),
        ]);
    }
}
