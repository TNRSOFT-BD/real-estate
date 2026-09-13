<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('projects.view');
    }

    public function view(User $user): bool
    {
        return $user->can('projects.view');
    }

    public function create(User $user): bool
    {
        return $user->can('projects.create');
    }

    public function update(User $user): bool
    {
        return $user->can('projects.update');
    }

    public function delete(User $user): bool
    {
        return $user->can('projects.delete');
    }

    public function publish(User $user): bool
    {
        return $user->can('projects.publish');
    }

    public function feature(User $user): bool
    {
        return $user->can('projects.update');
    }

    public function manageMedia(User $user): bool
    {
        return $user->can('projects.manage_media');
    }

    public function manageGallery(User $user): bool
    {
        return $user->can('projects.manage_gallery');
    }

    public function managePricing(User $user): bool
    {
        return $user->can('projects.manage_pricing');
    }
}
