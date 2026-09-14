<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectFloorPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('projects.manage_floor_plans') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'image' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:4096'],
            'total_area' => ['nullable', 'string', 'max:100'],
            'bedrooms' => ['nullable', 'string', 'max:100'],
            'bathrooms' => ['nullable', 'string', 'max:100'],
            'balcony' => ['nullable', 'string', 'max:100'],
            'lounge' => ['nullable', 'string', 'max:100'],
        ];
    }
}
