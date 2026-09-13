<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\About;

use App\Models\About\AboutItem;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AboutItemRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    /**
     * @return Collection<int, AboutItem>
     */
    public function getActiveByType(string $type): Collection;

    public function findById(int $id): ?AboutItem;

    public function create(array $data): AboutItem;

    public function update(AboutItem $item, array $data): AboutItem;

    public function delete(AboutItem $item): bool;

    public function reorder(array $orderedIds): void;

    public function toggleActive(AboutItem $item): bool;
}
