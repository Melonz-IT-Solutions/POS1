<?php

namespace App\Policies;

use App\Models\Discount;
use App\Models\User;

class DiscountPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view discounts');
    }

    public function view(User $user, Discount $discount): bool
    {
        return $user->can('view discounts');
    }

    public function create(User $user): bool
    {
        return $user->can('create discounts');
    }

    public function update(User $user, Discount $discount): bool
    {
        return $user->can('create discounts');
    }

    public function delete(User $user, Discount $discount): bool
    {
        return $user->can('create discounts');
    }

    public function restore(User $user, Discount $discount): bool
    {
        return $user->can('create discounts');
    }
}
