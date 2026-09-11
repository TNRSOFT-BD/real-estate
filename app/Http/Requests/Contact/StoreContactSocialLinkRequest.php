<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactSocialLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.social.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'platform' => ['required', 'string', 'max:100'],
            'label' => ['nullable', 'string', 'max:255'],
            'url' => ['required', 'url', 'max:500', 'not_in:javascript:,data:,vbscript:'],
            'icon' => ['nullable', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
