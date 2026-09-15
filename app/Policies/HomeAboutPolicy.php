<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class HomeAboutPolicy
{
    use HandlesAuthorization;

    public function view(User $user): bool
    {
        return $user->can('home_about.view');
    }

    public function update(User $user): bool
    {
        return $user->can('home_about.update');
    }
}
