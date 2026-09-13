<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Project;

use App\Enums\ProjectGalleryType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectGalleryRequest;
use App\Http\Requests\Project\UpdateProjectGalleryRequest;
use App\Models\Project\Project;
use App\Models\Project\ProjectGallery;
use App\Repositories\Contracts\Project\ProjectGalleryRepositoryInterface;
use App\Services\Project\ProjectGalleryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectGalleryController extends Controller
{
    public function __construct(
        private readonly ProjectGalleryRepositoryInterface $repository,
        private readonly ProjectGalleryService $service,
    ) {}

    public function index(Project $project): Response
    {
        $this->authorize('viewAny', ProjectGallery::class);

        return Inertia::render('admin/projects/gallery/index', [
            'project' => $project->only(['id', 'title', 'slug']),
            'images' => $this->repository->forProject($project->id),
            'types' => $this->typeOptions(),
        ]);
    }

    public function store(StoreProjectGalleryRequest $request, Project $project)
    {
        $files = array_values($request->file('images', []));
        $types = array_values((array) $request->input('types', []));
        $captions = array_values((array) $request->input('captions', []));
        $altTexts = array_values((array) $request->input('alt_texts', []));

        $meta = [];

        foreach ($files as $index => $file) {
            $meta[$index] = [
                'type' => $types[$index] ?? ProjectGalleryType::Exterior->value,
                'caption' => $captions[$index] ?? null,
                'alt_text' => $altTexts[$index] ?? null,
            ];
        }

        $count = $this->service->upload($project, $files, $meta);

        return back()->with('success', "{$count} gallery image(s) uploaded.");
    }

    public function update(UpdateProjectGalleryRequest $request, Project $project, ProjectGallery $gallery)
    {
        $this->authorize('update', $gallery);
        $this->ensureBelongsToProject($project, $gallery);

        $this->service->update($gallery, $request->validated());

        return back()->with('success', 'Gallery image updated.');
    }

    public function destroy(Project $project, ProjectGallery $gallery)
    {
        $this->authorize('delete', $gallery);
        $this->ensureBelongsToProject($project, $gallery);

        $this->service->delete($gallery);

        return back()->with('success', 'Gallery image deleted.');
    }

    public function reorder(Request $request, Project $project)
    {
        $this->authorize('update', ProjectGallery::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $this->service->reorder($project, $validated['ids']);

        return back()->with('success', 'Gallery reordered.');
    }

    public function feature(Request $request, Project $project, ProjectGallery $gallery)
    {
        $this->authorize('update', $gallery);
        $this->ensureBelongsToProject($project, $gallery);

        $this->service->setFeatured($gallery, $request->boolean('is_featured'));

        return back()->with('success', 'Gallery image updated.');
    }

    private function ensureBelongsToProject(Project $project, ProjectGallery $gallery): void
    {
        abort_unless($gallery->project_id === $project->id, 404);
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function typeOptions(): array
    {
        return array_map(
            fn (ProjectGalleryType $type): array => ['value' => $type->value, 'label' => $type->label()],
            ProjectGalleryType::cases(),
        );
    }
}
