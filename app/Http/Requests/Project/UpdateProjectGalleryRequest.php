<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Enums\ProjectGalleryType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('projects.manage_gallery') ?? false;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(ProjectGalleryType::all())],
            'caption' => ['nullable', 'string', 'max:255'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }
}
