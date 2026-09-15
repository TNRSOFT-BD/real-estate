<?php

declare(strict_types=1);

namespace App\Http\Requests\Home;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomeAboutSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('home_about.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'heading' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:20000'],
            'badge_figure' => ['nullable', 'string', 'max:50'],
            'badge_copy' => ['nullable', 'string', 'max:255'],
            'main_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:4096'],
            'main_image_alt' => ['nullable', 'string', 'max:255'],
            'accent_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:4096'],
            'accent_image_alt' => ['nullable', 'string', 'max:255'],
            'remove_main_image' => ['sometimes', 'boolean'],
            'remove_accent_image' => ['sometimes', 'boolean'],
        ];
    }
}
