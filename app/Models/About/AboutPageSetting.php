<?php

declare(strict_types=1);

namespace App\Models\About;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPageSetting extends Model
{
    use HasFactory;

    protected $table = 'about_page_settings';

    protected $fillable = [
        'hero_badge',
        'hero_title',
        'hero_highlight',
        'hero_description',
        'hero_image',
        'hero_cta_text',
        'hero_cta_link',
        'intro_badge',
        'intro_title',
        'intro_description',
        'intro_image',
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
        'og_image',
        'twitter_card',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static function singleton(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }
}