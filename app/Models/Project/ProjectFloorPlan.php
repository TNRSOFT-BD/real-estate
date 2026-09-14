<?php

declare(strict_types=1);

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectFloorPlan extends Model
{
    use HasFactory;

    protected $table = 'project_floor_plans';

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'image_path',
        'total_area',
        'bedrooms',
        'bathrooms',
        'balcony',
        'lounge',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
