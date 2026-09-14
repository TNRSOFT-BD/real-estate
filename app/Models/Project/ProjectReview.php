<?php

declare(strict_types=1);

namespace App\Models\Project;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectReview extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'project_reviews';

    protected $fillable = [
        'project_id',
        'name',
        'email',
        'rating',
        'comment',
        'is_approved',
        'ip_hash',
        'user_agent',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_approved' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('is_approved', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('created_at')->orderByDesc('id');
    }
}
