<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json(['products' => [], 'customers' => [], 'suppliers' => []]);
        }

        $like = "%{$q}%";

        $products = Product::active()
            ->where(fn ($query) =>
                $query->where('name', 'like', $like)
                      ->orWhere('sku', 'like', $like)
                      ->orWhere('barcode', 'like', $like)
            )
            ->limit(6)
            ->get(['id', 'name', 'sku'])
            ->map(fn ($p) => [
                'id'    => $p->id,
                'label' => $p->name,
                'sub'   => $p->sku,
                'url'   => route('admin.products.show', $p),
            ]);

        $customers = Customer::active()
            ->where(fn ($query) =>
                $query->where('name', 'like', $like)
                      ->orWhere('phone', 'like', $like)
                      ->orWhere('email', 'like', $like)
            )
            ->limit(5)
            ->get(['id', 'name', 'phone'])
            ->map(fn ($c) => [
                'id'    => $c->id,
                'label' => $c->name,
                'sub'   => $c->phone,
                'url'   => route('admin.customers.show', $c),
            ]);

        $suppliers = Supplier::active()
            ->where(fn ($query) =>
                $query->where('company_name', 'like', $like)
                      ->orWhere('contact_person', 'like', $like)
            )
            ->limit(4)
            ->get(['id', 'company_name', 'contact_person'])
            ->map(fn ($s) => [
                'id'    => $s->id,
                'label' => $s->company_name,
                'sub'   => $s->contact_person,
                'url'   => route('admin.suppliers.show', $s),
            ]);

        return response()->json([
            'products'  => $products,
            'customers' => $customers,
            'suppliers' => $suppliers,
        ]);
    }
}
