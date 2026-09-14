<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\DTOs\Contact\CreateContactSubmissionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectEnquiryRequest;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Services\Contact\ContactSubmissionService;
use Illuminate\Http\RedirectResponse;

class ProjectEnquiryController extends Controller
{
    public function __construct(
        private readonly ProjectRepositoryInterface $projects,
        private readonly ContactSubmissionService $submissions,
    ) {}

    public function store(string $slug, StoreProjectEnquiryRequest $request): RedirectResponse
    {
        $project = $this->projects->findPublishedBySlug($slug);

        abort_if($project === null, 404);

        if ($request->filled('website')) {
            return back()->with('success', 'Your enquiry has been sent. Our team will contact you shortly.');
        }

        $data = CreateContactSubmissionData::fromProjectRequest($request, $project->id, $project->title);

        $this->submissions->create($data);

        return back()->with('success', 'Your enquiry has been sent. Our team will contact you shortly.');
    }
}
