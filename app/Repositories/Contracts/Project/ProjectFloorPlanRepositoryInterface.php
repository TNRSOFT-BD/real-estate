<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Project;

use App\Models\Project\ProjectFloorPlan;
use Illuminate\Database\Eloquent\Collection;

interface ProjectFloorPlanRepositoryInterface
{
    /**
     * @return Collection<int, ProjectFloorPlan>
     */
    public function forProject(int $projectId): Collection;

    public function findById(int $id): ?ProjectFloorPlan;

    public function create(array $data): ProjectFloorPlan;

    public function update(ProjectFloorPlan $floorPlan, array $data): ProjectFloorPlan;

    public function delete(ProjectFloorPlan $floorPlan): bool;

    public function reorder(int $projectId, array $orderedIds): void;
}
