<?php

declare(strict_types=1);

namespace App\Models\Site;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    protected $table = 'site_settings';

    protected $fillable = [
        'background_color',
        'theme_mode',
        'hero_video_quality',
        'hero_video_enabled',
        'hero_video_source',
        'hero_video_url',
        'hero_video_public_id',
        'hero_video_link',
        'hero_eyebrow',
        'hero_title',
        'hero_description',
        'hero_images',
    ];

    protected $casts = [
        'hero_video_enabled' => 'boolean',
        'hero_images' => 'array',
    ];

    public static function singleton(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }
}
