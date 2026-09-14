<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Models\Project\Project;
use App\Models\Project\ProjectFloorPlan;
use App\Repositories\Contracts\Project\ProjectFloorPlanRepositoryInterface;
use Illuminate\Http\UploadedFile;

class ProjectFloorPlanService
{
    public function __construct(
        private readonly ProjectFloorPlanRepositoryInterface $repository,
        private readonly ProjectMediaService $media,
    ) {}

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(Project $project, array $attributes, UploadedFile $image): ?ProjectFloorPlan
    {
        $path = $this->media->uploadImage($image, 'projects/floor-plans');

        if ($path === null) {
            return null;
        }

        $order = (int) ($project->floorPlans()->max('sort_order') ?? 0);

        return $this->repository->create([
            ...$attributes,
            'project_id' => $project->id,
            'image_path' => $path,
            'sort_order' => ++$order,
        ]);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(ProjectFloorPlan $floorPlan, array $attributes, ?UploadedFile $image = null): ProjectFloorPlan
    {
        if ($image instanceof UploadedFile) {
            $path = $this->media->replaceImage($floorPlan->image_path, $image, 'projects/floor-plans');

            if ($path !== null) {
                $attributes['image_path'] = $path;
            }
        }

        return $this->repository->update($floorPlan, $attributes);
    }

    public function delete(ProjectFloorPlan $floorPlan): void
    {
        $this->media->delete($floorPlan->image_path);

        $this->repository->delete($floorPlan);
    }

    /**
     * @param  array<int, int|string>  $orderedIds
     */
    public function reorder(Project $project, array $orderedIds): void
    {
        $this->repository->reorder($project->id, $orderedIds);
    }
}
