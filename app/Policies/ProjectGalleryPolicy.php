<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectGalleryPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('projects.manage_gallery');
    }

    public function create(User $user): bool
    {
        return $user->can('projects.manage_gallery');
    }

    public function update(User $user): bool
    {
        return $user->can('projects.manage_gallery');
    }

    public function delete(User $user): bool
    {
        return $user->can('projects.manage_gallery');
    }
}
