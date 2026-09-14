<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectReviewPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('projects.manage_reviews');
    }

    public function update(User $user): bool
    {
        return $user->can('projects.manage_reviews');
    }

    public function delete(User $user): bool
    {
        return $user->can('projects.manage_reviews');
    }
}
