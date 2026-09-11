<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Models\Contact\ContactSocialLink;
use App\Repositories\Contracts\Contact\ContactSocialLinkRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentContactSocialLinkRepository implements ContactSocialLinkRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ContactSocialLink::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('platform', 'like', "%{$search}%")
                    ->orWhere('label', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%");
            })
            ->when(isset($filters['is_active']), fn ($query, $active) => $query->where('is_active', (bool) $active))
            ->orderBy('sort_order')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getAllActive(): iterable
    {
        return ContactSocialLink::query()
            ->active()
            ->ordered()
            ->get(['id', 'platform', 'label', 'url', 'icon']);
    }

    public function findById(int $id): ?ContactSocialLink
    {
        return ContactSocialLink::find($id);
    }

    public function create(array $data): ContactSocialLink
    {
        return ContactSocialLink::create($data);
    }

    public function update(ContactSocialLink $link, array $data): ContactSocialLink
    {
        $link->update($data);

        return $link;
    }

    public function delete(ContactSocialLink $link): bool
    {
        return (bool) $link->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach (array_values($orderedIds) as $index => $id) {
            ContactSocialLink::whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }

    public function toggleActive(ContactSocialLink $link): bool
    {
        $link->update(['is_active' => ! $link->is_active]);

        return (bool) $link->is_active;
    }
}
