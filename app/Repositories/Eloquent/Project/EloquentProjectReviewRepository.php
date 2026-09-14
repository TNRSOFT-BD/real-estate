<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Project;

use App\Models\Project\ProjectReview;
use App\Repositories\Contracts\Project\ProjectReviewRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProjectReviewRepository implements ProjectReviewRepositoryInterface
{
    public function paginateForProject(int $projectId, array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ProjectReview::query()
            ->where('project_id', $projectId)
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('comment', 'like', "%{$search}%");
                });
            })
            ->when(
                isset($filters['status']) && $filters['status'] !== '',
                fn ($query) => $query->where('is_approved', $filters['status'] === 'approved'),
            )
            ->ordered()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function approvedForProject(int $projectId): Collection
    {
        return ProjectReview::query()
            ->where('project_id', $projectId)
            ->approved()
            ->ordered()
            ->get();
    }

    public function summaryForProject(int $projectId): array
    {
        $query = ProjectReview::query()->where('project_id', $projectId)->approved();

        return [
            'count' => (int) $query->count(),
            'average' => round((float) $query->avg('rating'), 1),
        ];
    }

    public function findById(int $id): ?ProjectReview
    {
        return ProjectReview::find($id);
    }

    public function create(array $data): ProjectReview
    {
        return ProjectReview::create($data);
    }

    public function update(ProjectReview $review, array $data): ProjectReview
    {
        $review->update($data);

        return $review;
    }

    public function delete(ProjectReview $review): bool
    {
        return (bool) $review->delete();
    }
}
