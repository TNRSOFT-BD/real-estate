<?php

declare(strict_types=1);

namespace App\DTOs\Contact;

use Illuminate\Http\Request;

final class ContactPageSettingsData
{
    public function __construct(public readonly array $fields) {}

    public static function fromRequest(Request $request): self
    {
        // Uploaded files (hero_background_image, og_image) are handled by the
        // controller so a rejected upload can never overwrite a stored path.
        $allowed = [
            'hero_badge',
            'hero_title',
            'hero_highlight',
            'hero_description',
            'hero_primary_button_text',
            'hero_primary_button_link',
            'hero_secondary_button_text',
            'hero_secondary_button_link',
            'form_title',
            'form_description',
            'form_success_message',
            'faq_badge',
            'faq_title',
            'faq_description',
            'team_badge',
            'team_title',
            'team_description',
            'location_badge',
            'location_title',
            'location_description',
            'live_chat_title',
            'live_chat_description',
            'closing_badge',
            'closing_title',
            'closing_description',
            'seo_title',
            'seo_description',
            'seo_keywords',
            'canonical_url',
            'og_title',
            'og_description',
            'twitter_card',
            'is_active',
        ];

        return new self(
            fields: $request->only($allowed),
        );
    }

    public function toArray(): array
    {
        return $this->fields;
    }
}
