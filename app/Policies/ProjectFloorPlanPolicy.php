<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectFloorPlanPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('projects.manage_floor_plans');
    }

    public function create(User $user): bool
    {
        return $user->can('projects.manage_floor_plans');
    }

    public function update(User $user): bool
    {
        return $user->can('projects.manage_floor_plans');
    }

    public function delete(User $user): bool
    {
        return $user->can('projects.manage_floor_plans');
    }
}
