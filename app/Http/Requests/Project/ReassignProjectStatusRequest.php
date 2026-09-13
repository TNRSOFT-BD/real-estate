<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class ReassignProjectStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('project_statuses.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'target_id' => ['required', 'integer', 'exists:project_statuses,id'],
        ];
    }
}
