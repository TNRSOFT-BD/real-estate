<?php

declare(strict_types=1);

namespace App\Models\Contact;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactPageSetting extends Model
{
    use HasFactory;

    protected $table = 'contact_page_settings';

    protected $fillable = [
        'hero_badge',
        'hero_title',
        'hero_highlight',
        'hero_description',
        'hero_primary_button_text',
        'hero_primary_button_link',
        'hero_secondary_button_text',
        'hero_secondary_button_link',
        'hero_background_image',
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
