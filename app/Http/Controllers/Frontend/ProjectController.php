<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectCardResource;
use App\Models\Project\Project;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectStatusRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectTypeRepositoryInterface;
use App\Services\Project\ProjectSeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository,
        private readonly ProjectTypeRepositoryInterface $projectTypes,
        private readonly ProjectStatusRepositoryInterface $projectStatuses,
        private readonly ProjectSeoService $seo,
    ) {}

    public function index(Request $request): Response
    {
        $filters = array_filter([
            'project_type' => $request->query('project_type'),
            'project_status' => $request->query('project_status'),
            'location_city' => $request->query('location_city'),
            'search' => $request->query('search'),
        ], fn ($value): bool => is_string($value) && $value !== '');

        $projects = $this->repository
            ->paginatePublic($filters, 12)
            ->through(fn (Project $project): array => (new ProjectCardResource($project))->resolve());

        $description = 'Discover our latest developments and thoughtfully designed properties.';

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'types' => $this->projectTypes->allActive()
                ->map(fn ($type): array => ['slug' => $type->slug, 'name' => $type->name])
                ->values()
                ->all(),
            'statuses' => $this->projectStatuses->allActive()
                ->map(fn ($status): array => ['slug' => $status->slug, 'name' => $status->name, 'color' => $status->color])
                ->values()
                ->all(),
            'locations' => $this->repository->publishedLocations(),
            'filters' => [
                'project_type' => $filters['project_type'] ?? null,
                'project_status' => $filters['project_status'] ?? null,
                'location_city' => $filters['location_city'] ?? null,
                'search' => $filters['search'] ?? null,
            ],
            'seo' => [
                'title' => 'Projects',
                'description' => $description,
                'keywords' => null,
                'canonical_url' => route('projects.index'),
                'robots' => null,
                'og_title' => 'Projects',
                'og_description' => $description,
                'og_image' => null,
                'twitter_card' => 'summary_large_image',
                'twitter_title' => 'Projects',
                'twitter_description' => $description,
                'twitter_image' => null,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $project = $this->repository->findPublishedBySlug($slug);

        abort_if($project === null, 404);

        $project->load([
            'type:id,name,slug',
            'status:id,name,slug,color',
            'galleries' => fn ($query) => $query->ordered(),
            'pricingPlans' => fn ($query) => $query->ordered(),
            'floorPlans' => fn ($query) => $query->ordered(),
        ]);

        $relatedProjects = $this->repository
            ->featuredExcept($project->id, 3)
            ->map(fn ($item): array => [
                'id' => $item->id,
                'title' => $item->title,
                'slug' => $item->slug,
                'hero_banner' => $item->hero_banner,
                'location_city' => $item->location_city,
                'type' => $item->type?->name,
                'status' => $item->status?->name,
            ])
            ->all();

        return Inertia::render('projects/show', [
            'project' => $project,
            'seo' => $this->seo->build($project),
            'relatedProjects' => $relatedProjects,
            'currency' => config('projects.currency'),
        ]);
    }
}
