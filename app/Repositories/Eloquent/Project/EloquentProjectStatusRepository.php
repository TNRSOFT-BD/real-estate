<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Project;

use App\Models\Project\Project;
use App\Models\Project\ProjectStatus;
use App\Repositories\Contracts\Project\ProjectStatusRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProjectStatusRepository implements ProjectStatusRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ProjectStatus::query()
            ->withCount('projects')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                });
            })
            ->when(
                isset($filters['is_active']) && $filters['is_active'] !== '',
                fn ($query) => $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN)),
            )
            ->ordered()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?ProjectStatus
    {
        return ProjectStatus::find($id);
    }

    public function allActive(): Collection
    {
        return ProjectStatus::query()->active()->ordered()->get();
    }

    public function create(array $data): ProjectStatus
    {
        return ProjectStatus::create($data);
    }

    public function update(ProjectStatus $status, array $data): ProjectStatus
    {
        $status->update($data);

        return $status;
    }

    public function delete(ProjectStatus $status): bool
    {
        return (bool) $status->delete();
    }

    public function usageCount(ProjectStatus $status): int
    {
        return $status->projects()->count();
    }

    public function reassign(ProjectStatus $from, ProjectStatus $to): int
    {
        return Project::query()
            ->where('project_status_id', $from->id)
            ->update(['project_status_id' => $to->id]);
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            ProjectStatus::query()->whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }
}
