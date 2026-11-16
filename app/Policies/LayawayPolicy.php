<?php

namespace App\Policies;

use App\Models\Layaway;
use App\Models\User;

class LayawayPolicy
{
    public function viewAny(User $user): bool { return true; }
    public function view(User $user, Layaway $layaway): bool { return true; }
    public function create(User $user): bool { return true; }
    public function update(User $user, Layaway $layaway): bool
    {
        return $layaway->isActive();
    }
    public function cancel(User $user, Layaway $layaway): bool
    {
        return $layaway->isActive() && $user->hasAnyRole(['Administrator', 'Manager']);
    }
}
