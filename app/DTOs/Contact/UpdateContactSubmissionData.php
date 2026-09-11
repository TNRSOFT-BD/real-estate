<?php

declare(strict_types=1);

namespace App\DTOs\Contact;

use App\Enums\SubmissionPriority;
use App\Enums\SubmissionStatus;
use Illuminate\Http\Request;

final class UpdateContactSubmissionData
{
    public function __construct(
        public readonly ?SubmissionStatus $status,
        public readonly ?SubmissionPriority $priority,
        public readonly ?int $assignedTo,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            status: $request->filled('status') ? SubmissionStatus::from((string) $request->string('status')) : null,
            priority: $request->filled('priority') ? SubmissionPriority::from((string) $request->string('priority')) : null,
            assignedTo: $request->filled('assigned_to') ? $request->integer('assigned_to') : null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'status' => $this->status?->value,
            'priority' => $this->priority?->value,
            'assigned_to' => $this->assignedTo,
        ], fn ($value) => $value !== null);
    }
}
