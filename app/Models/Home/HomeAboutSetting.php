<?php

declare(strict_types=1);

namespace App\Models\Home;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeAboutSetting extends Model
{
    use HasFactory;

    protected $table = 'home_about_settings';

    protected $fillable = [
        'heading',
        'description',
        'badge_figure',
        'badge_copy',
        'main_image',
        'main_image_alt',
        'accent_image',
        'accent_image_alt',
    ];

    public static function singleton(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }
}
