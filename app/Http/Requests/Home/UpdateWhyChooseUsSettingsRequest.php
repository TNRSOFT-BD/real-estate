<?php

declare(strict_types=1);

namespace App\Http\Requests\Home;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWhyChooseUsSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('why_choose_us.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'eyebrow' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
