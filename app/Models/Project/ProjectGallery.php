<?php

declare(strict_types=1);

namespace App\Models\Project;

use App\Enums\ProjectGalleryType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectGallery extends Model
{
    use HasFactory;

    protected $table = 'project_galleries';

    protected $fillable = [
        'project_id',
        'image_path',
        'type',
        'caption',
        'alt_text',
        'sort_order',
        'is_featured',
    ];

    protected $casts = [
        'type' => ProjectGalleryType::class,
        'is_featured' => 'boolean',
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
