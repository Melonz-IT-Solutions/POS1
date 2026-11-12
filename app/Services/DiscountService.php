<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Discount;
use App\Models\Product;

class DiscountService
{
    /**
     * Find the best applicable discount for a product given the customer.
     * Returns the discount amount in centavos for the given line total.
     */
    public function bestProductDiscount(
        Product $product,
        int $lineTotal,
        ?Customer $customer = null,
    ): ?array {
        $discounts = Discount::active()
            ->where(function ($query) use ($product, $customer) {
                $query->where('scope', 'all')
                    ->orWhere(function ($q) use ($product) {
                        $q->where('scope', 'products')
                          ->whereHas('products', fn ($p) => $p->where('products.id', $product->id));
                    })
                    ->orWhere(function ($q) use ($product) {
                        $q->where('scope', 'categories')
                          ->whereHas('categories', fn ($c) => $c->where('categories.id', $product->category_id));
                    })
                    ->orWhere(function ($q) use ($customer) {
                        if ($customer) {
                            $q->where('scope', 'customers')
                              ->whereHas('customers', fn ($c) => $c->where('customers.id', $customer->id));
                        } else {
                            $q->whereRaw('0=1'); // no match
                        }
                    });
            })
            ->where('min_purchase', '<=', $lineTotal)
            ->get();

        $best      = null;
        $bestSaved = 0;

        foreach ($discounts as $discount) {
            $saved = $this->calculateAmount($discount, $lineTotal);
            if ($saved > $bestSaved) {
                $bestSaved = $saved;
                $best      = $discount;
            }
        }

        if ($best === null) {
            return null;
        }

        return [
            'discount'    => $best,
            'amount'      => $bestSaved,
            'type'        => $best->type->value,
            'value'       => $best->value,
        ];
    }

    /**
     * Calculate discount amount in centavos for a given cart total.
     */
    public function calculateTransactionDiscount(
        string $type,
        int $value,
        int $subtotal,
    ): int {
        return match ($type) {
            'percentage' => (int) round($subtotal * $value / 10000), // value = basis points
            'fixed'      => min($value, $subtotal),
            default      => 0,
        };
    }

    private function calculateAmount(Discount $discount, int $amount): int
    {
        return match ($discount->type->value) {
            'percentage' => (int) round($amount * $discount->value / 10000),
            'fixed'      => min($discount->value, $amount),
            default      => 0,
        };
    }
}
