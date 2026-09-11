<?php

declare(strict_types=1);

namespace App\Models\Contact;

use App\Enums\FaqDisplayLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactFaq extends Model
{
    use HasFactory;

    protected $table = 'contact_faqs';

    protected $fillable = [
        'question',
        'answer',
        'category',
        'display_location',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'display_location' => FaqDisplayLocation::class,
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
