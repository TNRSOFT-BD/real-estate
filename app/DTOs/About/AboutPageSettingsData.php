<?php

declare(strict_types=1);

namespace App\DTOs\About;

use Illuminate\Http\Request;

final class AboutPageSettingsData
{
    public function __construct(public readonly array $fields) {}

    public static function fromRequest(Request $request): self
    {
        $allowed = [
            'hero_badge',
            'hero_title',
            'hero_highlight',
            'hero_description',
            'hero_cta_text',
            'hero_cta_link',
            'intro_badge',
            'intro_title',
            'intro_description',
            'direction_badge',
            'values_badge',
            'values_title',
            'journey_badge',
            'journey_title',
            'why_badge',
            'why_title',
            'team_badge',
            'team_title',
            'team_description',
            'partners_title',
            'closing_badge',
            'closing_title',
            'closing_description',
            'closing_button_text',
            'closing_button_link',
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