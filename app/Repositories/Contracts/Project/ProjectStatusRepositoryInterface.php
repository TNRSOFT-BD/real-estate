<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Project;

use App\Models\Project\ProjectStatus;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectStatusRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function findById(int $id): ?ProjectStatus;

    /**
     * @return Collection<int, ProjectStatus>
     */
    public function allActive(): Collection;

    public function create(array $data): ProjectStatus;

    public function update(ProjectStatus $status, array $data): ProjectStatus;

    public function delete(ProjectStatus $status): bool;

    public function usageCount(ProjectStatus $status): int;

    public function reassign(ProjectStatus $from, ProjectStatus $to): int;

    public function reorder(array $orderedIds): void;
}
