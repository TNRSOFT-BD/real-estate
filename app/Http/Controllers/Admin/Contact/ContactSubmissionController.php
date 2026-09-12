<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\DTOs\Contact\UpdateContactSubmissionData;
use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\UpdateContactSubmissionRequest;
use App\Models\Contact\ContactSubmission;
use App\Models\User;
use App\Repositories\Contracts\Contact\ContactSubmissionRepositoryInterface;
use App\Services\Contact\ContactSubmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactSubmissionController extends Controller
{
    public function __construct(
        private readonly ContactSubmissionRepositoryInterface $submissionRepository,
        private readonly ContactSubmissionService $submissionService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContactSubmission::class);

        $filters = $request->only(['search', 'status', 'priority', 'assigned_to', 'date_from', 'date_to', 'sort']);

        return Inertia::render('admin/contact/submissions/index', [
            'items' => $this->submissionRepository->paginate($filters),
            'filters' => (object) $filters,
            'overview' => $this->submissionRepository->countsOverview(),
            'assignees' => User::query()->select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    public function show(ContactSubmission $submission): Response
    {
        $this->authorize('view', $submission);

        return Inertia::render('admin/contact/submissions/show', [
            'submission' => $this->submissionRepository->findWithNotes($submission->id),
            'assignees' => User::query()->select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    public function update(UpdateContactSubmissionRequest $request, ContactSubmission $submission)
    {
        $dto = UpdateContactSubmissionData::fromRequest($request);

        if (isset($dto->assignedTo) && ! $request->user()->can('contact.submissions.assign')) {
            abort(403);
        }

        $this->submissionRepository->update($submission, $dto->toArray());

        return back()->with('success', 'Submission updated.');
    }

    public function destroy(ContactSubmission $submission)
    {
        $this->authorize('delete', $submission);

        $this->submissionRepository->delete($submission);

        return to_route('admin.contact.submissions.index')->with('success', 'Submission deleted.');
    }

    public function bulkUpdate(Request $request)
    {
        $this->authorize('bulk', ContactSubmission::class);

        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
            'status' => ['required', 'in:new,read,in_progress,waiting,resolved,closed,spam'],
        ]);

        $count = $this->submissionRepository->bulkUpdateStatus($data['ids'], SubmissionStatus::from($data['status']));

        return back()->with('success', "{$count} submission(s) updated.");
    }

    public function bulkDelete(Request $request)
    {
        $this->authorize('bulk', ContactSubmission::class);

        $data = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $count = $this->submissionRepository->bulkDelete($data['ids']);

        return back()->with('success', "{$count} submission(s) deleted.");
    }

    public function markSpam(ContactSubmission $submission)
    {
        $this->authorize('update', $submission);

        $this->submissionService->markAsSpam($submission);

        return back()->with('success', 'Submission marked as spam.');
    }

    public function restore(ContactSubmission $submission)
    {
        $this->authorize('update', $submission);

        $this->submissionService->restoreFromSpam($submission);

        return back()->with('success', 'Submission restored.');
    }
}
