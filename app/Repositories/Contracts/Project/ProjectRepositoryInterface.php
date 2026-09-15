<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Project;

use App\Models\Project\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function paginatePublic(array $filters = [], int $perPage = 12): LengthAwarePaginator;

    public function findById(int $id): ?Project;

    public function findBySlug(string $slug): ?Project;

    public function findPublishedBySlug(string $slug): ?Project;

    /**
     * @return Collection<int, Project>
     */
    public function featuredExcept(int $excludeId, int $limit = 3): Collection;

    /**
     * @return Collection<int, Project>
     */
    public function latestPublished(int $limit = 6): Collection;

    /**
     * @return array<int, string>
     */
    public function publishedLocations(): array;

    public function create(array $data): Project;

    public function update(Project $project, array $data): Project;

    public function delete(Project $project): bool;

    public function count(): int;

    public function countPublished(): int;

    public function countFeatured(): int;

    /**
     * @return Collection<int, Project>
     */
    public function recent(int $limit = 5): Collection;
}
