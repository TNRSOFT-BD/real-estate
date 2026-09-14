<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Project;

use App\Enums\PricingStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectPricingPlanRequest;
use App\Http\Requests\Project\UpdateProjectPricingPlanRequest;
use App\Models\Project\Project;
use App\Models\Project\ProjectPricingPlan;
use App\Repositories\Contracts\Project\ProjectPricingPlanRepositoryInterface;
use App\Services\Project\ProjectPricingPlanService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectPricingPlanController extends Controller
{
    public function __construct(
        private readonly ProjectPricingPlanRepositoryInterface $repository,
        private readonly ProjectPricingPlanService $service,
    ) {}

    public function index(Project $project): Response
    {
        $this->authorize('viewAny', ProjectPricingPlan::class);

        return Inertia::render('admin/projects/pricing/index', [
            'project' => $project->only(['id', 'title', 'slug']),
            'plans' => $this->repository->forProject($project->id),
            'statuses' => $this->statusOptions(),
            'currency' => config('projects.currency'),
        ]);
    }

    public function store(StoreProjectPricingPlanRequest $request, Project $project)
    {
        $this->service->create($project, $request->validated());

        return back()->with('success', 'Pricing plan added successfully.');
    }

    public function update(UpdateProjectPricingPlanRequest $request, Project $project, ProjectPricingPlan $pricing)
    {
        $this->authorize('update', $pricing);
        $this->ensureBelongsToProject($project, $pricing);

        $this->service->update($pricing, $request->validated());

        return back()->with('success', 'Pricing plan updated successfully.');
    }

    public function destroy(Project $project, ProjectPricingPlan $pricing)
    {
        $this->authorize('delete', $pricing);
        $this->ensureBelongsToProject($project, $pricing);

        $this->service->delete($pricing);

        return back()->with('success', 'Pricing plan deleted successfully.');
    }

    public function duplicate(Project $project, ProjectPricingPlan $pricing)
    {
        $this->authorize('create', ProjectPricingPlan::class);
        $this->ensureBelongsToProject($project, $pricing);

        $this->service->duplicate($pricing);

        return back()->with('success', 'Pricing plan duplicated successfully.');
    }

    public function reorder(Request $request, Project $project)
    {
        $this->authorize('update', ProjectPricingPlan::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $this->service->reorder($project, $validated['ids']);

        return back()->with('success', 'Pricing plans reordered.');
    }

    private function ensureBelongsToProject(Project $project, ProjectPricingPlan $pricing): void
    {
        abort_unless($pricing->project_id === $project->id, 404);
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function statusOptions(): array
    {
        return array_map(
            fn (PricingStatus $status): array => ['value' => $status->value, 'label' => $status->label()],
            PricingStatus::cases(),
        );
    }
}
