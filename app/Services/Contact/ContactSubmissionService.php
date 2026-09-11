<?php

declare(strict_types=1);

namespace App\Services\Contact;

use App\DTOs\Contact\CreateContactSubmissionData;
use App\Enums\SubmissionStatus;
use App\Jobs\Contact\SendContactAcknowledgement;
use App\Jobs\Contact\SendContactAdminNotification;
use App\Models\Contact\ContactSubmission;
use App\Repositories\Contracts\Contact\ContactSubmissionRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ContactSubmissionService
{
    public function __construct(
        private readonly ContactSubmissionRepositoryInterface $submissionRepository,
    ) {}

    public function create(CreateContactSubmissionData $data): ContactSubmission
    {
        $submission = DB::transaction(function () use ($data) {
            return $this->submissionRepository->create($data->toArray());
        });

        try {
            SendContactAdminNotification::dispatch($submission);
            SendContactAcknowledgement::dispatch($submission);
        } catch (\Throwable $e) {
            Log::error('Failed to dispatch contact notification', [
                'submission_id' => $submission->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $submission;
    }

    public function markAsRead(ContactSubmission $submission): void
    {
        if ($submission->status === SubmissionStatus::New) {
            $this->submissionRepository->update($submission, ['status' => SubmissionStatus::Read]);
        }
    }

    public function markAsSpam(ContactSubmission $submission): void
    {
        $this->submissionRepository->markSpam($submission);
    }

    public function restoreFromSpam(ContactSubmission $submission): void
    {
        $this->submissionRepository->restoreSpam($submission);
    }
}
