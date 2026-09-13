<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Project;

use App\Exceptions\ProjectInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ReassignProjectStatusRequest;
use App\Http\Requests\Project\StoreProjectStatusRequest;
use App\Http\Requests\Project\UpdateProjectStatusRequest;
use App\Models\Project\ProjectStatus;
use App\Repositories\Contracts\Project\ProjectStatusRepositoryInterface;
use App\Services\Project\ProjectStatusService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectStatusController extends Controller
{
    public function __construct(
        private readonly ProjectStatusRepositoryInterface $repository,
        private readonly ProjectStatusService $service,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ProjectStatus::class);

        $filters = $request->only(['search', 'is_active']);

        return Inertia::render('admin/project-statuses/index', [
            'items' => $this->repository->paginate($filters),
            'filters' => (object) $filters,
            'options' => $this->repository->allActive()
                ->map(fn (ProjectStatus $status): array => ['value' => (string) $status->id, 'label' => $status->name])
                ->values()
                ->all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ProjectStatus::class);

        return Inertia::render('admin/project-statuses/create');
    }

    public function store(StoreProjectStatusRequest $request)
    {
        $this->service->create($request->validated());

        return to_route('admin.project-statuses.index')->with('success', 'Project status created successfully.');
    }

    public function edit(ProjectStatus $projectStatus): Response
    {
        $this->authorize('update', $projectStatus);

        return Inertia::render('admin/project-statuses/edit', [
            'item' => $projectStatus->loadCount('projects'),
        ]);
    }

    public function update(UpdateProjectStatusRequest $request, ProjectStatus $projectStatus)
    {
        $this->service->update($projectStatus, $request->validated());

        return back()->with('success', 'Project status updated successfully.');
    }

    public function destroy(ProjectStatus $projectStatus)
    {
        $this->authorize('delete', $projectStatus);

        try {
            $this->service->delete($projectStatus);
        } catch (ProjectInUseException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('admin.project-statuses.index')->with('success', 'Project status deleted successfully.');
    }

    public function toggle(ProjectStatus $projectStatus)
    {
        $this->authorize('update', $projectStatus);

        $this->service->toggle($projectStatus);

        return back()->with('success', 'Project status updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', ProjectStatus::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $this->service->reorder($validated['ids']);

        return back()->with('success', 'Project statuses reordered.');
    }

    public function reassign(ReassignProjectStatusRequest $request, ProjectStatus $projectStatus)
    {
        $this->authorize('reassign', ProjectStatus::class);

        $target = ProjectStatus::query()->findOrFail((int) $request->input('target_id'));

        try {
            $count = $this->service->reassign($projectStatus, $target);
        } catch (ProjectInUseException|\InvalidArgumentException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return back()->with('success', "{$count} project(s) reassigned successfully.");
    }
}
