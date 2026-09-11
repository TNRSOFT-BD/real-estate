<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContactTeamMemberPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('contact.team.view');
    }

    public function view(User $user): bool
    {
        return $user->can('contact.team.view');
    }

    public function create(User $user): bool
    {
        return $user->can('contact.team.create');
    }

    public function update(User $user): bool
    {
        return $user->can('contact.team.update');
    }

    public function delete(User $user): bool
    {
        return $user->can('contact.team.delete');
    }
}
