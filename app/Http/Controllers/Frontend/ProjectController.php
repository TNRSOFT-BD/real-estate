<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Services\Project\ProjectSeoService;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectRepositoryInterface $repository,
        private readonly ProjectSeoService $seo,
    ) {}

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
            'approvedReviews' => fn ($query) => $query->ordered(),
        ]);

        $reviews = $project->approvedReviews;

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
            'reviews' => $reviews,
            'reviewSummary' => [
                'count' => $reviews->count(),
                'average' => round((float) $reviews->avg('rating'), 1),
            ],
            'currency' => config('projects.currency'),
        ]);
    }
}
