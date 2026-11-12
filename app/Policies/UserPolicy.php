<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view users');
    }

    public function create(User $user): bool
    {
        return $user->can('create users');
    }

    public function update(User $authUser, User $user): bool
    {
        // Prevent editing yourself through the admin panel (use profile settings instead)
        if ($authUser->id === $user->id) {
            return false;
        }

        return $authUser->can('edit users');
    }

    public function delete(User $authUser, User $user): bool
    {
        if ($authUser->id === $user->id) {
            return false;
        }

        return $authUser->can('delete users');
    }

    public function restore(User $authUser, User $user): bool
    {
        return $authUser->can('edit users');
    }
}
