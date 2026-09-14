<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Enums\PricingStatus;
use App\Models\Project\Project;
use App\Models\Project\ProjectPricingPlan;
use App\Repositories\Contracts\Project\ProjectPricingPlanRepositoryInterface;

class ProjectPricingPlanService
{
    public function __construct(
        private readonly ProjectPricingPlanRepositoryInterface $repository,
    ) {}

    public function create(Project $project, array $data): ProjectPricingPlan
    {
        $data['project_id'] = $project->id;
        $data['sort_order'] = (int) ($project->pricingPlans()->max('sort_order') ?? 0) + 1;

        return $this->repository->create($data);
    }

    public function update(ProjectPricingPlan $plan, array $data): ProjectPricingPlan
    {
        return $this->repository->update($plan, $data);
    }

    public function duplicate(ProjectPricingPlan $plan): ProjectPricingPlan
    {
        return $this->repository->create([
            ...$plan->only([
                'project_id',
                'unit_type',
                'size_sqft',
                'price_per_sqft',
                'total_price',
                'booking_money',
                'down_payment_percentage',
                'installment_plan',
                'status',
                'is_featured',
            ]),
            'sort_order' => (int) ($plan->project->pricingPlans()->max('sort_order') ?? 0) + 1,
        ]);
    }

    public function setStatus(ProjectPricingPlan $plan, PricingStatus $status): ProjectPricingPlan
    {
        return $this->repository->update($plan, ['status' => $status->value]);
    }

    public function delete(ProjectPricingPlan $plan): void
    {
        $this->repository->delete($plan);
    }

    public function reorder(Project $project, array $orderedIds): void
    {
        $this->repository->reorder($project->id, $orderedIds);
    }
}
