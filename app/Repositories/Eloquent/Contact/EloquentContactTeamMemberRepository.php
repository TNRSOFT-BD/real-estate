<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Models\Contact\ContactTeamMember;
use App\Repositories\Contracts\Contact\ContactTeamMemberRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentContactTeamMemberRepository implements ContactTeamMemberRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ContactTeamMember::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($filters['department'] ?? null, fn ($query, $department) => $query->where('department', $department))
            ->when(isset($filters['is_active']), fn ($query, $active) => $query->where('is_active', (bool) $active))
            ->orderBy('sort_order')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getAllActive(): iterable
    {
        return ContactTeamMember::query()
            ->active()
            ->ordered()
            ->get();
    }

    public function findById(int $id): ?ContactTeamMember
    {
        return ContactTeamMember::find($id);
    }

    public function create(array $data): ContactTeamMember
    {
        return ContactTeamMember::create($data);
    }

    public function update(ContactTeamMember $member, array $data): ContactTeamMember
    {
        $member->update($data);

        return $member;
    }

    public function delete(ContactTeamMember $member): bool
    {
        return (bool) $member->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach (array_values($orderedIds) as $index => $id) {
            ContactTeamMember::whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }

    public function toggleActive(ContactTeamMember $member): bool
    {
        $member->update(['is_active' => ! $member->is_active]);

        return (bool) $member->is_active;
    }
}
