<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Project;

use App\Models\Project\ProjectPricingPlan;
use App\Repositories\Contracts\Project\ProjectPricingPlanRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProjectPricingPlanRepository implements ProjectPricingPlanRepositoryInterface
{
    public function forProject(int $projectId, int $perPage = 24): LengthAwarePaginator
    {
        return ProjectPricingPlan::query()
            ->where('project_id', $projectId)
            ->ordered()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?ProjectPricingPlan
    {
        return ProjectPricingPlan::find($id);
    }

    public function create(array $data): ProjectPricingPlan
    {
        return ProjectPricingPlan::create($data);
    }

    public function update(ProjectPricingPlan $plan, array $data): ProjectPricingPlan
    {
        $plan->update($data);

        return $plan;
    }

    public function delete(ProjectPricingPlan $plan): bool
    {
        return (bool) $plan->delete();
    }

    public function reorder(int $projectId, array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            ProjectPricingPlan::query()
                ->where('project_id', $projectId)
                ->whereKey($id)
                ->update(['sort_order' => $index + 1]);
        }
    }
}
