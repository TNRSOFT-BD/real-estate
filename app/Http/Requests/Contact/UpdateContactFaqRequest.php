<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use App\Enums\FaqDisplayLocation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateContactFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.faq.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string', 'max:10000'],
            'category' => ['nullable', 'string', 'max:100'],
            'display_location' => ['required', new Enum(FaqDisplayLocation::class)],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
