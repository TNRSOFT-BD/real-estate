<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Project;

use App\Models\Project\ProjectFloorPlan;
use App\Repositories\Contracts\Project\ProjectFloorPlanRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentProjectFloorPlanRepository implements ProjectFloorPlanRepositoryInterface
{
    public function forProject(int $projectId): Collection
    {
        return ProjectFloorPlan::query()
            ->where('project_id', $projectId)
            ->ordered()
            ->get();
    }

    public function findById(int $id): ?ProjectFloorPlan
    {
        return ProjectFloorPlan::find($id);
    }

    public function create(array $data): ProjectFloorPlan
    {
        return ProjectFloorPlan::create($data);
    }

    public function update(ProjectFloorPlan $floorPlan, array $data): ProjectFloorPlan
    {
        $floorPlan->update($data);

        return $floorPlan;
    }

    public function delete(ProjectFloorPlan $floorPlan): bool
    {
        return (bool) $floorPlan->delete();
    }

    public function reorder(int $projectId, array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            ProjectFloorPlan::query()
                ->where('project_id', $projectId)
                ->whereKey($id)
                ->update(['sort_order' => $index + 1]);
        }
    }
}
