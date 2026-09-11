<?php

declare(strict_types=1);

namespace App\Models\Contact;

use App\Enums\TeamMemberDepartment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactTeamMember extends Model
{
    use HasFactory;

    protected $table = 'contact_team_members';

    protected $fillable = [
        'name',
        'role',
        'department',
        'email',
        'phone',
        'avatar',
        'bio',
        'availability',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
        'department' => TeamMemberDepartment::class,
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
