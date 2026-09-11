<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Enums\SubmissionStatus;
use App\Models\Contact\ContactSubmission;
use Illuminate\Pagination\LengthAwarePaginator;

interface ContactSubmissionRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function findById(int $id): ?ContactSubmission;

    public function findWithNotes(int $id): ?ContactSubmission;

    public function create(array $data): ContactSubmission;

    public function update(ContactSubmission $submission, array $data): ContactSubmission;

    public function delete(ContactSubmission $submission): bool;

    public function bulkDelete(array $ids): int;

    public function bulkUpdateStatus(array $ids, SubmissionStatus $status): int;

    public function countByStatus(?SubmissionStatus $status = null): int;

    public function markSpam(ContactSubmission $submission): void;

    public function restoreSpam(ContactSubmission $submission): void;

    public function countsOverview(): array;
}
