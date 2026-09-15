<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Enums\SubmissionStatus;
use App\Models\Contact\ContactSubmission;
use App\Repositories\Contracts\Contact\ContactSubmissionRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentContactSubmissionRepository implements ContactSubmissionRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return ContactSubmission::query()
            ->with(['assignee:id,name', 'project:id,title,slug'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->when($filters['priority'] ?? null, fn ($query, $priority) => $query->where('priority', $priority))
            ->when($filters['assigned_to'] ?? null, fn ($query, $assignee) => $query->where('assigned_to', $assignee))
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '<=', $date))
            ->when($filters['sort'] ?? null, function ($query, $sort) {
                match ($sort) {
                    'newest' => $query->latest(),
                    'oldest' => $query->oldest(),
                    default => $query->latest(),
                };
            }, fn ($query) => $query->latest())
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?ContactSubmission
    {
        return ContactSubmission::find($id);
    }

    public function findWithNotes(int $id): ?ContactSubmission
    {
        return ContactSubmission::with(['notes.user:id,name,email', 'assignee:id,name,email', 'project:id,title,slug'])->find($id);
    }

    public function create(array $data): ContactSubmission
    {
        return ContactSubmission::create($data);
    }

    public function update(ContactSubmission $submission, array $data): ContactSubmission
    {
        $submission->update($data);

        return $submission;
    }

    public function delete(ContactSubmission $submission): bool
    {
        return (bool) $submission->delete();
    }

    public function bulkDelete(array $ids): int
    {
        return (int) ContactSubmission::whereIn('id', $ids)->delete();
    }

    public function bulkUpdateStatus(array $ids, SubmissionStatus $status): int
    {
        return (int) ContactSubmission::whereIn('id', $ids)->update(['status' => $status]);
    }

    public function countByStatus(?SubmissionStatus $status = null): int
    {
        return ContactSubmission::query()
            ->when($status !== null, fn ($query) => $query->where('status', $status))
            ->count();
    }

    public function markSpam(ContactSubmission $submission): void
    {
        $submission->update(['status' => SubmissionStatus::Spam]);
    }

    public function restoreSpam(ContactSubmission $submission): void
    {
        $submission->update(['status' => SubmissionStatus::New]);
    }

    public function countsOverview(): array
    {
        return [
            'new' => $this->countByStatus(SubmissionStatus::New),
            'in_progress' => $this->countByStatus(SubmissionStatus::InProgress),
            'resolved' => $this->countByStatus(SubmissionStatus::Resolved),
            'spam' => $this->countByStatus(SubmissionStatus::Spam),
            'total' => $this->countByStatus(),
        ];
    }

    public function recent(int $limit = 5): Collection
    {
        return ContactSubmission::query()
            ->with('project:id,title,slug')
            ->latest()
            ->limit($limit)
            ->get(['id', 'name', 'email', 'subject', 'status', 'project_id', 'created_at']);
    }
}
