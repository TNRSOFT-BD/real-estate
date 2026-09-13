<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectTypePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('project_types.view');
    }

    public function view(User $user): bool
    {
        return $user->can('project_types.view');
    }

    public function create(User $user): bool
    {
        return $user->can('project_types.create');
    }

    public function update(User $user): bool
    {
        return $user->can('project_types.update');
    }

    public function delete(User $user): bool
    {
        return $user->can('project_types.delete');
    }

    public function reassign(User $user): bool
    {
        return $user->can('project_types.update');
    }
}
