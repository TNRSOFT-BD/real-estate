<?php

declare(strict_types=1);

namespace App\Models\About;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AboutItem extends Model
{
    use HasFactory;
    use SoftDeletes;

    public const TYPE_MISSION = 'mission';
    public const TYPE_VISION = 'vision';
    public const TYPE_STATISTIC = 'statistic';
    public const TYPE_VALUE = 'value';
    public const TYPE_MILESTONE = 'milestone';
    public const TYPE_FEATURE = 'feature';
    public const TYPE_PARTNER = 'partner';

    protected $table = 'about_items';

    protected $fillable = [
        'type',
        'title',
        'subtitle',
        'description',
        'content',
        'value',
        'label',
        'year',
        'date',
        'image',
        'image_alt',
        'icon',
        'url',
        'sort_order',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'date' => 'date',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * @return array<int, string>
     */
    public static function types(): array
    {
        return [
            self::TYPE_MISSION,
            self::TYPE_VISION,
            self::TYPE_STATISTIC,
            self::TYPE_VALUE,
            self::TYPE_MILESTONE,
            self::TYPE_FEATURE,
            self::TYPE_PARTNER,
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }
}
