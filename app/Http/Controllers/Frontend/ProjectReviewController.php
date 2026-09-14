<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectReviewRequest;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Services\Project\ProjectReviewService;
use Illuminate\Http\RedirectResponse;

class ProjectReviewController extends Controller
{
    public function __construct(
        private readonly ProjectRepositoryInterface $projects,
        private readonly ProjectReviewService $reviews,
    ) {}

    public function store(string $slug, StoreProjectReviewRequest $request): RedirectResponse
    {
        $project = $this->projects->findPublishedBySlug($slug);

        abort_if($project === null, 404);

        if ($request->filled('website')) {
            return back()->with('success', 'Thank you. Your review has been submitted and is awaiting approval.');
        }

        $this->reviews->createForProject(
            $project->id,
            $request->validated(),
            $request->ip(),
            $request->userAgent(),
        );

        return back()->with('success', 'Thank you. Your review has been submitted and is awaiting approval.');
    }
}
