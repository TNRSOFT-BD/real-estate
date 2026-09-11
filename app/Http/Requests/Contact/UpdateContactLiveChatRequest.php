<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use App\Enums\LiveChatProvider;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateContactLiveChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.livechat.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'enabled' => ['sometimes', 'boolean'],
            'provider' => ['required_with:enabled', new Enum(LiveChatProvider::class)],
            'script_url' => ['nullable', 'url', 'max:500'],
            'widget_id' => ['nullable', 'string', 'max:255'],
            'button_text' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'in:bottom_right,bottom_left,top_right,top_left'],
            'availability_text' => ['nullable', 'string', 'max:500'],
        ];
    }
}
