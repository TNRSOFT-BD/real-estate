<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Models\Contact\ContactInformation;
use App\Repositories\Contracts\Contact\ContactInformationRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentContactInformationRepository implements ContactInformationRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ContactInformation::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('value', 'like', "%{$search}%");
                });
            })
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when(isset($filters['is_active']), fn ($query, $active) => $query->where('is_active', (bool) $active))
            ->orderBy('sort_order')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getAllActive(): iterable
    {
        return ContactInformation::query()
            ->active()
            ->ordered()
            ->get(['id', 'type', 'title', 'value', 'secondary_value', 'icon', 'description', 'link']);
    }

    public function findById(int $id): ?ContactInformation
    {
        return ContactInformation::find($id);
    }

    public function create(array $data): ContactInformation
    {
        return ContactInformation::create($data);
    }

    public function update(ContactInformation $information, array $data): ContactInformation
    {
        $information->update($data);

        return $information;
    }

    public function delete(ContactInformation $information): bool
    {
        return (bool) $information->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach (array_values($orderedIds) as $index => $id) {
            ContactInformation::whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }

    public function toggleActive(ContactInformation $information): bool
    {
        $information->update(['is_active' => ! $information->is_active]);

        return (bool) $information->is_active;
    }
}
