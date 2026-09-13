<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Enums\ProjectGalleryType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectGalleryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('projects.manage_gallery') ?? false;
    }

    public function rules(): array
    {
        return [
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'mimes:jpeg,png,webp', 'max:4096'],
            'types' => ['nullable', 'array'],
            'types.*' => [Rule::in(ProjectGalleryType::all())],
            'captions' => ['nullable', 'array'],
            'captions.*' => ['nullable', 'string', 'max:255'],
            'alt_texts' => ['nullable', 'array'],
            'alt_texts.*' => ['nullable', 'string', 'max:255'],
        ];
    }
}
