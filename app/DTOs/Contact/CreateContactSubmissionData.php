<?php

declare(strict_types=1);

namespace App\DTOs\Contact;

use Illuminate\Http\Request;

final class CreateContactSubmissionData
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $phone,
        public readonly ?string $subject,
        public readonly string $message,
        public readonly array $formData,
        public readonly ?string $ipHash,
        public readonly ?string $userAgent,
        public readonly ?string $source,
        public readonly ?int $projectId = null,
    ) {}

    public static function fromRequest(Request $request, array $normalizedFields): self
    {
        return new self(
            name: (string) $request->string('name'),
            email: (string) $request->string('email'),
            phone: $request->filled('phone') ? (string) $request->string('phone') : null,
            subject: $request->filled('subject') ? (string) $request->string('subject') : null,
            message: (string) $request->string('message'),
            formData: $normalizedFields,
            ipHash: $request->ip() ? hash('sha256', $request->ip()) : null,
            userAgent: $request->userAgent(),
            source: 'contact_page',
        );
    }

    public static function fromProjectRequest(Request $request, int $projectId, string $projectTitle): self
    {
        return new self(
            name: (string) $request->string('name'),
            email: (string) $request->string('email'),
            phone: $request->filled('phone') ? (string) $request->string('phone') : null,
            subject: 'Project enquiry: '.$projectTitle,
            message: (string) $request->string('message'),
            formData: [
                'source' => 'project_page',
                'project_id' => $projectId,
                'project' => $projectTitle,
            ],
            ipHash: $request->ip() ? hash('sha256', $request->ip()) : null,
            userAgent: $request->userAgent(),
            source: 'project_page',
            projectId: $projectId,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'subject' => $this->subject,
            'message' => $this->message,
            'project_id' => $this->projectId,
            'form_data' => $this->formData,
            'ip_hash' => $this->ipHash,
            'user_agent' => $this->userAgent,
            'source' => $this->source,
            'submitted_at' => now(),
        ];
    }
}
