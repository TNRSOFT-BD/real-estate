<?php

declare(strict_types=1);

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'projects';

    protected $fillable = [
        'title',
        'slug',
        'project_code',
        'project_type_id',
        'project_status_id',
        'short_description',
        'overview',
        'is_published',
        'published_at',
        'is_featured',
        'sort_order',
        'location_address',
        'location_area',
        'location_city',
        'location_country',
        'google_map_url',
        'latitude',
        'longitude',
        'total_land_area',
        'total_units',
        'number_of_floors',
        'number_of_buildings',
        'units_per_floor',
        'handover_date',
        'property_features',
        'amenities',
        'hero_banner',
        'hero_banner_alt',
        'brochure_pdf',
        'promo_video_url',
        'legal_approval_no',
        'legal_approval_document',
        'developer_name',
        'developer_website',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'robots',
        'og_title',
        'og_description',
        'og_image',
        'twitter_card',
        'twitter_title',
        'twitter_description',
        'twitter_image',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'handover_date' => 'date',
        'property_features' => 'array',
        'amenities' => 'array',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'total_land_area' => 'decimal:2',
        'total_units' => 'integer',
        'number_of_floors' => 'integer',
        'number_of_buildings' => 'integer',
        'units_per_floor' => 'integer',
        'sort_order' => 'integer',
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(ProjectType::class, 'project_type_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ProjectStatus::class, 'project_status_id');
    }

    public function galleries(): HasMany
    {
        return $this->hasMany(ProjectGallery::class);
    }

    public function pricingPlans(): HasMany
    {
        return $this->hasMany(ProjectPricingPlan::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('id');
    }

    public function isPublished(): bool
    {
        return $this->is_published;
    }
}
