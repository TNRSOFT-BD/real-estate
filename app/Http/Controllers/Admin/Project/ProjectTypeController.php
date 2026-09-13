<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Project;

use App\Exceptions\ProjectInUseException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ReassignProjectTypeRequest;
use App\Http\Requests\Project\StoreProjectTypeRequest;
use App\Http\Requests\Project\UpdateProjectTypeRequest;
use App\Models\Project\ProjectType;
use App\Repositories\Contracts\Project\ProjectTypeRepositoryInterface;
use App\Services\Project\ProjectTypeService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProjectTypeController extends Controller
{
    public function __construct(
        private readonly ProjectTypeRepositoryInterface $repository,
        private readonly ProjectTypeService $service,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ProjectType::class);

        $filters = $request->only(['search', 'is_active']);

        return Inertia::render('admin/project-types/index', [
            'items' => $this->repository->paginate($filters),
            'filters' => (object) $filters,
            'options' => $this->repository->allActive()
                ->map(fn (ProjectType $type): array => ['value' => (string) $type->id, 'label' => $type->name])
                ->values()
                ->all(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ProjectType::class);

        return Inertia::render('admin/project-types/create');
    }

    public function store(StoreProjectTypeRequest $request)
    {
        $this->service->create($request->validated());

        return to_route('admin.project-types.index')->with('success', 'Project type created successfully.');
    }

    public function edit(ProjectType $projectType): Response
    {
        $this->authorize('update', $projectType);

        return Inertia::render('admin/project-types/edit', [
            'item' => $projectType->loadCount('projects'),
        ]);
    }

    public function update(UpdateProjectTypeRequest $request, ProjectType $projectType)
    {
        $this->service->update($projectType, $request->validated());

        return back()->with('success', 'Project type updated successfully.');
    }

    public function destroy(ProjectType $projectType)
    {
        $this->authorize('delete', $projectType);

        try {
            $this->service->delete($projectType);
        } catch (ProjectInUseException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('admin.project-types.index')->with('success', 'Project type deleted successfully.');
    }

    public function toggle(ProjectType $projectType)
    {
        $this->authorize('update', $projectType);

        $this->service->toggle($projectType);

        return back()->with('success', 'Project type status updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', ProjectType::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $this->service->reorder($validated['ids']);

        return back()->with('success', 'Project types reordered.');
    }

    public function reassign(ReassignProjectTypeRequest $request, ProjectType $projectType)
    {
        $this->authorize('reassign', ProjectType::class);

        $target = ProjectType::query()->findOrFail((int) $request->input('target_id'));

        try {
            $count = $this->service->reassign($projectType, $target);
        } catch (ProjectInUseException|\InvalidArgumentException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return back()->with('success', "{$count} project(s) reassigned successfully.");
    }
}
