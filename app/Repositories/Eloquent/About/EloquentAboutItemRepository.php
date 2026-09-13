<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\About;

use App\Models\About\AboutItem;
use App\Repositories\Contracts\About\AboutItemRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentAboutItemRepository implements AboutItemRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return AboutItem::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('label', 'like', "%{$search}%")
                        ->orWhere('value', 'like', "%{$search}%");
                });
            })
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            ->when(isset($filters['is_active']), fn ($query, $active) => $query->where('is_active', (bool) $active))
            ->orderBy('type')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getActiveByType(string $type): Collection
    {
        return AboutItem::query()
            ->ofType($type)
            ->active()
            ->ordered()
            ->get();
    }

    public function findById(int $id): ?AboutItem
    {
        return AboutItem::find($id);
    }

    public function create(array $data): AboutItem
    {
        return AboutItem::create($data);
    }

    public function update(AboutItem $item, array $data): AboutItem
    {
        $item->update($data);

        return $item;
    }

    public function delete(AboutItem $item): bool
    {
        return (bool) $item->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach (array_values($orderedIds) as $index => $id) {
            AboutItem::whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }

    public function toggleActive(AboutItem $item): bool
    {
        $item->update(['is_active' => ! $item->is_active]);

        return (bool) $item->is_active;
    }
}
