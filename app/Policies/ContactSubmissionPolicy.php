<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ContactSubmissionPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('contact.submissions.view');
    }

    public function view(User $user): bool
    {
        return $user->can('contact.submissions.view');
    }

    public function update(User $user): bool
    {
        return $user->can('contact.submissions.update');
    }

    public function delete(User $user): bool
    {
        return $user->can('contact.submissions.delete');
    }

    public function assign(User $user): bool
    {
        return $user->can('contact.submissions.assign');
    }

    public function bulk(User $user): bool
    {
        return $user->can('contact.submissions.bulk');
    }
}
