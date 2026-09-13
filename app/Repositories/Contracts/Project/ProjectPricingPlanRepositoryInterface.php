<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Project;

use App\Models\Project\ProjectPricingPlan;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectPricingPlanRepositoryInterface
{
    public function forProject(int $projectId, int $perPage = 24): LengthAwarePaginator;

    public function findById(int $id): ?ProjectPricingPlan;

    public function create(array $data): ProjectPricingPlan;

    public function update(ProjectPricingPlan $plan, array $data): ProjectPricingPlan;

    public function delete(ProjectPricingPlan $plan): bool;

    public function reorder(int $projectId, array $orderedIds): void;
}
