<?php

declare(strict_types=1);

namespace App\Models\Home;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhyChooseUsSetting extends Model
{
    use HasFactory;

    protected $table = 'why_choose_us_settings';

    protected $fillable = [
        'eyebrow',
        'title',
        'description',
    ];

    public static function singleton(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }
}
