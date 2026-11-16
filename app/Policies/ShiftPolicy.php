<?php

namespace App\Policies;

use App\Models\Shift;
use App\Models\User;

class ShiftPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission(['view shifts', 'view own shifts']);
    }

    public function view(User $user, Shift $shift): bool
    {
        if ($user->hasPermissionTo('view shifts')) {
            return true;
        }

        return $user->hasPermissionTo('view own shifts') && $shift->cashier_id === $user->id;
    }
}
