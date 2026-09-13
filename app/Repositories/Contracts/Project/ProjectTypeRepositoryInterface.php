<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Project;

use App\Models\Project\ProjectType;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectTypeRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function findById(int $id): ?ProjectType;

    /**
     * @return Collection<int, ProjectType>
     */
    public function allActive(): Collection;

    public function create(array $data): ProjectType;

    public function update(ProjectType $type, array $data): ProjectType;

    public function delete(ProjectType $type): bool;

    public function usageCount(ProjectType $type): int;

    public function reassign(ProjectType $from, ProjectType $to): int;

    public function reorder(array $orderedIds): void;
}
