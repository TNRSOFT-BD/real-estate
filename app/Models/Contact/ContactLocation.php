<?php

declare(strict_types=1);

namespace App\Models\Contact;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactLocation extends Model
{
    use HasFactory;

    protected $table = 'contact_locations';

    protected $fillable = [
        'name',
        'address',
        'description',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'google_maps_url',
        'place_id',
        'phone',
        'email',
        'business_hours',
        'is_primary',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }
}
