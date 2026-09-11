<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use App\Enums\ContactFormFieldType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateContactFormFieldRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'regex:/^[a-z][a-z0-9_]*$/', 'unique:contact_form_fields,name,'.$this->route('field')->id],
            'label' => ['required', 'string', 'max:255'],
            'type' => ['required', new Enum(ContactFormFieldType::class)],
            'placeholder' => ['nullable', 'string', 'max:255'],
            'help_text' => ['nullable', 'string', 'max:500'],
            'options' => ['nullable', 'array'],
            'options.*' => ['nullable', 'string', 'max:255'],
            'validation_rules' => ['nullable', 'array'],
            'validation_rules.required' => ['sometimes', 'boolean'],
            'validation_rules.nullable' => ['sometimes', 'boolean'],
            'validation_rules.string' => ['sometimes', 'boolean'],
            'validation_rules.email' => ['sometimes', 'boolean'],
            'validation_rules.url' => ['sometimes', 'boolean'],
            'validation_rules.min' => ['sometimes', 'integer', 'min:0'],
            'validation_rules.max' => ['sometimes', 'integer', 'min:0'],
            'validation_rules.regex' => ['sometimes', 'string', 'max:500'],
            'is_required' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
