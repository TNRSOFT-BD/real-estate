<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Enums\PricingStatus;
use App\Models\Project\Project;
use App\Models\Project\ProjectPricingPlan;
use App\Repositories\Contracts\Project\ProjectPricingPlanRepositoryInterface;
use Illuminate\Http\UploadedFile;

class ProjectPricingPlanService
{
    public function __construct(
        private readonly ProjectPricingPlanRepositoryInterface $repository,
        private readonly ProjectMediaService $media,
    ) {}

    public function create(Project $project, array $data, ?UploadedFile $floorPlan = null): ProjectPricingPlan
    {
        $data['project_id'] = $project->id;
        $data['sort_order'] = (int) ($project->pricingPlans()->max('sort_order') ?? 0) + 1;

        if ($floorPlan instanceof UploadedFile) {
            $path = $this->media->uploadImage($floorPlan, 'projects/pricing');

            if ($path !== null) {
                $data['floor_plan_image'] = $path;
            }
        }

        return $this->repository->create($data);
    }

    public function update(
        ProjectPricingPlan $plan,
        array $data,
        ?UploadedFile $floorPlan = null,
        bool $removeFloorPlan = false,
    ): ProjectPricingPlan {
        if ($floorPlan instanceof UploadedFile) {
            $stored = $this->media->replaceImage($plan->floor_plan_image, $floorPlan, 'projects/pricing');

            if ($stored !== null) {
                $data['floor_plan_image'] = $stored;
            }
        } elseif ($removeFloorPlan) {
            $this->media->delete($plan->floor_plan_image);
            $data['floor_plan_image'] = null;
        }

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
                'floor_plan_image',
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
        $this->media->delete($plan->floor_plan_image);

        $this->repository->delete($plan);
    }

    public function reorder(Project $project, array $orderedIds): void
    {
        $this->repository->reorder($project->id, $orderedIds);
    }
}
