<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContactLocationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('contact.location.view');
    }

    public function view(User $user): bool
    {
        return $user->can('contact.location.view');
    }

    public function create(User $user): bool
    {
        return $user->can('contact.location.create');
    }

    public function update(User $user): bool
    {
        return $user->can('contact.location.update');
    }

    public function delete(User $user): bool
    {
        return $user->can('contact.location.delete');
    }
}
