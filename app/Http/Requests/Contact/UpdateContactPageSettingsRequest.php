<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactPageSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.settings.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'hero_badge' => ['nullable', 'string', 'max:100'],
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_highlight' => ['nullable', 'string', 'max:255'],
            'hero_description' => ['nullable', 'string', 'max:1000'],
            'hero_primary_button_text' => ['nullable', 'string', 'max:100'],
            'hero_primary_button_link' => ['nullable', 'url', 'max:500'],
            'hero_secondary_button_text' => ['nullable', 'string', 'max:100'],
            'hero_secondary_button_link' => ['nullable', 'url', 'max:500'],
            'hero_background_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'form_title' => ['nullable', 'string', 'max:255'],
            'form_description' => ['nullable', 'string', 'max:1000'],
            'form_success_message' => ['nullable', 'string', 'max:1000'],
            'faq_badge' => ['nullable', 'string', 'max:100'],
            'faq_title' => ['nullable', 'string', 'max:255'],
            'faq_description' => ['nullable', 'string', 'max:1000'],
            'team_badge' => ['nullable', 'string', 'max:100'],
            'team_title' => ['nullable', 'string', 'max:255'],
            'team_description' => ['nullable', 'string', 'max:1000'],
            'location_badge' => ['nullable', 'string', 'max:100'],
            'location_title' => ['nullable', 'string', 'max:255'],
            'location_description' => ['nullable', 'string', 'max:1000'],
            'live_chat_title' => ['nullable', 'string', 'max:255'],
            'live_chat_description' => ['nullable', 'string', 'max:1000'],
            'closing_badge' => ['nullable', 'string', 'max:100'],
            'closing_title' => ['nullable', 'string', 'max:255'],
            'closing_description' => ['nullable', 'string', 'max:1000'],
            'seo_title' => ['nullable', 'string', 'max:70'],
            'seo_description' => ['nullable', 'string', 'max:160'],
            'seo_keywords' => ['nullable', 'string', 'max:255'],
            'canonical_url' => ['nullable', 'url', 'max:500'],
            'og_title' => ['nullable', 'string', 'max:100'],
            'og_description' => ['nullable', 'string', 'max:300'],
            'og_image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'twitter_card' => ['nullable', 'string', 'in:summary,summary_large_image,app,player', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
