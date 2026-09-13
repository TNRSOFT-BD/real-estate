<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class AboutItemPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('about.view');
    }

    public function view(User $user): bool
    {
        return $user->can('about.view');
    }

    public function create(User $user): bool
    {
        return $user->can('about.create');
    }

    public function update(User $user): bool
    {
        return $user->can('about.update');
    }

    public function delete(User $user): bool
    {
        return $user->can('about.delete');
    }
}
