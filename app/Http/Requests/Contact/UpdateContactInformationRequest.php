<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use App\Enums\ContactInformationType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateContactInformationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', new Enum(ContactInformationType::class)],
            'title' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:5000'],
            'secondary_value' => ['nullable', 'string', 'max:5000'],
            'icon' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string', 'max:1000'],
            'link' => ['nullable', 'url', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
