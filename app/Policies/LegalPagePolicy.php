<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class LegalPagePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('legal.view');
    }

    public function view(User $user): bool
    {
        return $user->can('legal.view');
    }

    public function create(User $user): bool
    {
        return $user->can('legal.create');
    }

    public function update(User $user): bool
    {
        return $user->can('legal.update');
    }

    public function delete(User $user): bool
    {
        return $user->can('legal.delete');
    }

    public function publish(User $user): bool
    {
        return $user->can('legal.publish');
    }
}
