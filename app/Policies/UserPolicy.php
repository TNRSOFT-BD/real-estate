<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Authorization for managing administrator accounts.
 *
 * There is no RBAC/roles/permission system here — an administrator is simply
 * an authenticated user whose `is_admin` flag is true, matching the existing
 * admin-access mechanism used throughout the panel.
 */
class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function create(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function update(User $user, User $admin): bool
    {
        return $user->isAdministrator();
    }

    public function delete(User $user, User $admin): bool
    {
        return $user->isAdministrator();
    }
}
