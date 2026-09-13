<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Project;

use App\Models\Project\Project;
use App\Models\Project\ProjectType;
use App\Repositories\Contracts\Project\ProjectTypeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProjectTypeRepository implements ProjectTypeRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ProjectType::query()
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

    public function findById(int $id): ?ProjectType
    {
        return ProjectType::find($id);
    }

    public function allActive(): Collection
    {
        return ProjectType::query()->active()->ordered()->get();
    }

    public function create(array $data): ProjectType
    {
        return ProjectType::create($data);
    }

    public function update(ProjectType $type, array $data): ProjectType
    {
        $type->update($data);

        return $type;
    }

    public function delete(ProjectType $type): bool
    {
        return (bool) $type->delete();
    }

    public function usageCount(ProjectType $type): int
    {
        return $type->projects()->count();
    }

    public function reassign(ProjectType $from, ProjectType $to): int
    {
        return Project::query()
            ->where('project_type_id', $from->id)
            ->update(['project_type_id' => $to->id]);
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            ProjectType::query()->whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }
}
