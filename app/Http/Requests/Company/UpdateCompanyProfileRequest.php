<?php

declare(strict_types=1);

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('company.profile.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:100'],
            'tagline' => ['nullable', 'string', 'max:160'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,webp,svg', 'max:4096'],
        ];
    }
}
