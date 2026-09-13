<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class ReassignProjectTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('project_types.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'target_id' => ['required', 'integer', 'exists:project_types,id'],
        ];
    }
}
