<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectFloorPlanRequest;
use App\Http\Requests\Project\UpdateProjectFloorPlanRequest;
use App\Models\Project\Project;
use App\Models\Project\ProjectFloorPlan;
use App\Repositories\Contracts\Project\ProjectFloorPlanRepositoryInterface;
use App\Services\Project\ProjectFloorPlanService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class ProjectFloorPlanController extends Controller
{
    public function __construct(
        private readonly ProjectFloorPlanRepositoryInterface $repository,
        private readonly ProjectFloorPlanService $service,
    ) {}

    public function index(Project $project): Response
    {
        $this->authorize('viewAny', ProjectFloorPlan::class);

        return Inertia::render('admin/projects/floor-plans/index', [
            'project' => $project->only(['id', 'title', 'slug']),
            'floorPlans' => $this->repository->forProject($project->id),
        ]);
    }

    public function store(StoreProjectFloorPlanRequest $request, Project $project)
    {
        $floorPlan = $this->service->create($project, Arr::except($request->validated(), ['image']), $request->file('image'));

        if ($floorPlan === null) {
            return back()->with('error', 'The floor plan image could not be stored.');
        }

        return back()->with('success', 'Floor plan added.');
    }

    public function update(UpdateProjectFloorPlanRequest $request, Project $project, ProjectFloorPlan $floorPlan)
    {
        $this->authorize('update', $floorPlan);
        $this->ensureBelongsToProject($project, $floorPlan);

        $this->service->update($floorPlan, Arr::except($request->validated(), ['image']), $request->file('image'));

        return back()->with('success', 'Floor plan updated.');
    }

    public function destroy(Project $project, ProjectFloorPlan $floorPlan)
    {
        $this->authorize('delete', $floorPlan);
        $this->ensureBelongsToProject($project, $floorPlan);

        $this->service->delete($floorPlan);

        return back()->with('success', 'Floor plan deleted.');
    }

    public function reorder(Request $request, Project $project)
    {
        $this->authorize('update', ProjectFloorPlan::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $this->service->reorder($project, $validated['ids']);

        return back()->with('success', 'Floor plans reordered.');
    }

    private function ensureBelongsToProject(Project $project, ProjectFloorPlan $floorPlan): void
    {
        abort_unless($floorPlan->project_id === $project->id, 404);
    }
}
