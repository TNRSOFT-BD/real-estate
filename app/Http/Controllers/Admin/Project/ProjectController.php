<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Models\Project\Project;
use App\Models\Project\ProjectStatus;
use App\Models\Project\ProjectType;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Services\Project\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * @var list<string>
     */
    private const IMAGE_FIELDS = ['hero_banner', 'og_image', 'twitter_image'];

    /**
     * @var list<string>
     */
    private const DOCUMENT_FIELDS = ['brochure_pdf', 'legal_approval_document'];

    public function __construct(
        private readonly ProjectRepositoryInterface $repository,
        private readonly ProjectService $service,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $filters = $request->only(['search', 'project_type_id', 'project_status_id', 'location_city', 'is_published', 'is_featured', 'sort']);

        return Inertia::render('admin/projects/index', [
            'items' => $this->repository->paginate($filters),
            'filters' => (object) $filters,
            'types' => $this->typeOptions(),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('admin/projects/create', [
            'types' => $this->typeOptions(),
            'statuses' => $this->statusOptions(),
            'currency' => config('projects.currency'),
            'mediaLimits' => $this->mediaLimits(),
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        $project = $this->service->create($request->validated(), $this->uploadedFiles($request));

        return to_route('admin.projects.edit', $project)->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', Project::class);

        $project->load(['type', 'status'])->loadCount(['galleries', 'pricingPlans']);

        return Inertia::render('admin/projects/show', [
            'project' => $project,
            'seo' => $this->service->seo($project),
        ]);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('admin/projects/edit', [
            'project' => $project,
            'types' => $this->typeOptions($project->project_type_id),
            'statuses' => $this->statusOptions($project->project_status_id),
            'currency' => config('projects.currency'),
            'mediaLimits' => $this->mediaLimits(),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $this->service->update($project, $request->validated(), $this->uploadedFiles($request));

        return back()->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $this->service->delete($project);

        return to_route('admin.projects.index')->with('success', 'Project deleted successfully.');
    }

    public function publish(Project $project)
    {
        $this->authorize('publish', $project);

        $this->service->publish($project);

        return back()->with('success', 'Project published successfully.');
    }

    public function unpublish(Project $project)
    {
        $this->authorize('publish', $project);

        $this->service->unpublish($project);

        return back()->with('success', 'Project unpublished successfully.');
    }

    public function feature(Project $project)
    {
        $this->authorize('feature', $project);

        $this->service->feature($project);

        return back()->with('success', 'Project marked as featured.');
    }

    public function unfeature(Project $project)
    {
        $this->authorize('feature', $project);

        $this->service->unfeature($project);

        return back()->with('success', 'Project removed from featured.');
    }

    /**
     * @return array<string, mixed>
     */
    private function mediaLimits(): array
    {
        return [
            'imageMaxKb' => (int) config('projects.media.image_max_kb'),
            'documentMaxKb' => (int) config('projects.media.document_max_kb'),
            'imageMimes' => array_values((array) config('projects.media.image_mimes')),
            'documentMimes' => array_values((array) config('projects.media.document_mimes')),
        ];
    }

    /**
     * @return array<string, \Illuminate\Http\UploadedFile>
     */
    private function uploadedFiles(Request $request): array
    {
        $files = [];

        foreach (array_merge(self::IMAGE_FIELDS, self::DOCUMENT_FIELDS) as $field) {
            if ($request->hasFile($field)) {
                $files[$field] = $request->file($field);
            }
        }

        return $files;
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function typeOptions(?int $includeId = null): array
    {
        $types = ProjectType::query()->active()->ordered()->get(['id', 'name', 'is_active']);

        if ($includeId !== null && ! $types->contains('id', $includeId)) {
            $current = ProjectType::query()->find($includeId, ['id', 'name', 'is_active']);

            if ($current !== null) {
                $types->prepend($current);
            }
        }

        return $this->toOptions($types);
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function statusOptions(?int $includeId = null): array
    {
        $statuses = ProjectStatus::query()->active()->ordered()->get(['id', 'name', 'is_active']);

        if ($includeId !== null && ! $statuses->contains('id', $includeId)) {
            $current = ProjectStatus::query()->find($includeId, ['id', 'name', 'is_active']);

            if ($current !== null) {
                $statuses->prepend($current);
            }
        }

        return $this->toOptions($statuses);
    }

    /**
     * @param  Collection<int, ProjectType|ProjectStatus>  $models
     * @return array<int, array{value: string, label: string}>
     */
    private function toOptions(Collection $models): array
    {
        return $models
            ->map(fn ($model): array => [
                'value' => (string) $model->id,
                'label' => $model->name.($model->is_active ? '' : ' (inactive)'),
            ])
            ->values()
            ->all();
    }
}
