<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Models\Project\Project;
use App\Models\Project\ProjectReview;
use App\Repositories\Contracts\Project\ProjectReviewRepositoryInterface;
use App\Services\Project\ProjectReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectReviewController extends Controller
{
    public function __construct(
        private readonly ProjectReviewRepositoryInterface $repository,
        private readonly ProjectReviewService $service,
    ) {}

    public function index(Request $request, Project $project): Response
    {
        $this->authorize('viewAny', ProjectReview::class);

        $filters = $request->only(['search', 'status']);

        return Inertia::render('admin/projects/reviews/index', [
            'project' => $project->only(['id', 'title', 'slug']),
            'reviews' => $this->repository->paginateForProject($project->id, $filters),
            'filters' => (object) $filters,
            'summary' => $this->repository->summaryForProject($project->id),
        ]);
    }

    public function approve(Project $project, ProjectReview $review)
    {
        $this->authorize('update', $review);
        $this->ensureBelongsToProject($project, $review);

        $this->service->approve($review);

        return back()->with('success', 'Review approved.');
    }

    public function unapprove(Project $project, ProjectReview $review)
    {
        $this->authorize('update', $review);
        $this->ensureBelongsToProject($project, $review);

        $this->service->unapprove($review);

        return back()->with('success', 'Review moved back to pending.');
    }

    public function destroy(Project $project, ProjectReview $review)
    {
        $this->authorize('delete', $review);
        $this->ensureBelongsToProject($project, $review);

        $this->service->delete($review);

        return back()->with('success', 'Review deleted.');
    }

    private function ensureBelongsToProject(Project $project, ProjectReview $review): void
    {
        abort_unless($review->project_id === $project->id, 404);
    }
}
