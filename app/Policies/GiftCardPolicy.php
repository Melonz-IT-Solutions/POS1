<?php

namespace App\Policies;

use App\Models\GiftCard;
use App\Models\User;

class GiftCardPolicy
{
    public function viewAny(User $user): bool { return $user->hasAnyRole(['Administrator', 'Manager']); }
    public function view(User $user, GiftCard $card): bool { return $user->hasAnyRole(['Administrator', 'Manager']); }
    public function create(User $user): bool { return $user->hasAnyRole(['Administrator', 'Manager']); }
    public function redeem(User $user, GiftCard $card): bool { return $card->isActive() && !$card->isExpired(); }
    public function cancel(User $user, GiftCard $card): bool { return $user->hasRole('Administrator'); }
}
