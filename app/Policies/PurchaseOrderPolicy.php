<?php

namespace App\Policies;

use App\Enums\PurchaseOrderStatus;
use App\Models\PurchaseOrder;
use App\Models\User;

class PurchaseOrderPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view purchase orders');
    }

    public function view(User $user, PurchaseOrder $order): bool
    {
        return $user->can('view purchase orders');
    }

    public function create(User $user): bool
    {
        return $user->can('create purchase orders');
    }

    public function update(User $user, PurchaseOrder $order): bool
    {
        return $user->can('create purchase orders');
    }

    public function delete(User $user, PurchaseOrder $order): bool
    {
        return $user->can('create purchase orders')
            && $order->status === PurchaseOrderStatus::Draft;
    }

    public function receive(User $user, PurchaseOrder $order): bool
    {
        return $user->can('receive goods');
    }
}
