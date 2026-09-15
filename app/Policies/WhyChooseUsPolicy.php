<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class WhyChooseUsPolicy
{
    use HandlesAuthorization;

    public function view(User $user): bool
    {
        return $user->can('why_choose_us.view');
    }

    public function update(User $user): bool
    {
        return $user->can('why_choose_us.update');
    }
}
