<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Models\Contact\ContactLocation;
use App\Repositories\Contracts\Contact\ContactLocationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentContactLocationRepository implements ContactLocationRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ContactLocation::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('country', 'like', "%{$search}%");
            })
            ->when(isset($filters['is_active']), fn ($query, $active) => $query->where('is_active', (bool) $active))
            ->orderBy('sort_order')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getAllActive(): iterable
    {
        return ContactLocation::query()
            ->active()
            ->ordered()
            ->get();
    }

    public function findById(int $id): ?ContactLocation
    {
        return ContactLocation::find($id);
    }

    public function getPrimary(): ?ContactLocation
    {
        return ContactLocation::query()->active()->primary()->first();
    }

    public function create(array $data): ContactLocation
    {
        return ContactLocation::create($data);
    }

    public function update(ContactLocation $location, array $data): ContactLocation
    {
        $location->update($data);

        return $location;
    }

    public function delete(ContactLocation $location): bool
    {
        return (bool) $location->delete();
    }

    public function setPrimary(ContactLocation $location): void
    {
        ContactLocation::query()->where('id', '!=', $location->id)->update(['is_primary' => false]);
        $location->update(['is_primary' => true]);
    }

    public function reorder(array $orderedIds): void
    {
        foreach (array_values($orderedIds) as $index => $id) {
            ContactLocation::whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }

    public function toggleActive(ContactLocation $location): bool
    {
        $location->update(['is_active' => ! $location->is_active]);

        return (bool) $location->is_active;
    }
}
