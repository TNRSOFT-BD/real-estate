<?php

declare(strict_types=1);

namespace App\Models\Legal;

use App\Enums\LegalPageStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LegalPage extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'legal_pages';

    protected $fillable = [
        'title',
        'slug',
        'content',
        'status',
        'published_at',
    ];

    protected $casts = [
        'status' => LegalPageStatus::class,
        'published_at' => 'datetime',
    ];

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', LegalPageStatus::Published->value);
    }

    public function isPublished(): bool
    {
        return $this->status === LegalPageStatus::Published;
    }
}
