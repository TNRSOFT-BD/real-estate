<?php

declare(strict_types=1);

namespace App\Models\Project;

use App\Enums\PricingStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectPricingPlan extends Model
{
    use HasFactory;

    protected $table = 'project_pricing_plans';

    protected $fillable = [
        'project_id',
        'unit_type',
        'size_sqft',
        'price_per_sqft',
        'total_price',
        'booking_money',
        'down_payment_percentage',
        'installment_plan',
        'floor_plan_image',
        'status',
        'sort_order',
        'is_featured',
    ];

    protected $casts = [
        'size_sqft' => 'decimal:2',
        'price_per_sqft' => 'decimal:2',
        'total_price' => 'decimal:2',
        'booking_money' => 'decimal:2',
        'down_payment_percentage' => 'decimal:2',
        'status' => PricingStatus::class,
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
