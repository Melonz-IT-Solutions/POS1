<?php

namespace App\Policies;

use App\Models\Sale;
use App\Models\User;

class SalePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['view sales', 'view own sales']);
    }

    public function view(User $user, Sale $sale): bool
    {
        if ($user->hasPermissionTo('view sales')) {
            return true;
        }

        // Cashiers can view their own sales
        return $user->hasPermissionTo('view own sales') && $sale->cashier_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create sales');
    }

    public function void(User $user, Sale $sale): bool
    {
        return $user->hasPermissionTo('void sales');
    }

    public function refund(User $user, Sale $sale): bool
    {
        return $user->hasPermissionTo('refund sales');
    }
}
