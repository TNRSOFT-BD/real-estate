<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use App\Enums\SubmissionPriority;
use App\Enums\SubmissionStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateContactSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.submissions.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'status' => ['sometimes', new Enum(SubmissionStatus::class)],
            'priority' => ['sometimes', new Enum(SubmissionPriority::class)],
            'assigned_to' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
        ];
    }
}
