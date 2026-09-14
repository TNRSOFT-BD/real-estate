<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Project;

use App\Models\Project\ProjectReview;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectReviewRepositoryInterface
{
    public function paginateForProject(int $projectId, array $filters = [], int $perPage = 20): LengthAwarePaginator;

    /**
     * @return Collection<int, ProjectReview>
     */
    public function approvedForProject(int $projectId): Collection;

    /**
     * @return array{count: int, average: float}
     */
    public function summaryForProject(int $projectId): array;

    public function findById(int $id): ?ProjectReview;

    public function create(array $data): ProjectReview;

    public function update(ProjectReview $review, array $data): ProjectReview;

    public function delete(ProjectReview $review): bool;
}
