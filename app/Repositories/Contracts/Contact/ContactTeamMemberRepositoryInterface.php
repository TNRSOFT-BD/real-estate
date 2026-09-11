<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Models\Contact\ContactTeamMember;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactTeamMemberRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function getAllActive(): iterable;

    public function findById(int $id): ?ContactTeamMember;

    public function create(array $data): ContactTeamMember;

    public function update(ContactTeamMember $member, array $data): ContactTeamMember;

    public function delete(ContactTeamMember $member): bool;

    public function reorder(array $orderedIds): void;

    public function toggleActive(ContactTeamMember $member): bool;
}
