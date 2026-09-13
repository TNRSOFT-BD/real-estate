<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Project;

use App\Models\Project\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Project;

    public function findBySlug(string $slug): ?Project;

    public function findPublishedBySlug(string $slug): ?Project;

    /**
     * @return Collection<int, Project>
     */
    public function featuredExcept(int $excludeId, int $limit = 3): Collection;

    public function create(array $data): Project;

    public function update(Project $project, array $data): Project;

    public function delete(Project $project): bool;

    public function count(): int;
}
