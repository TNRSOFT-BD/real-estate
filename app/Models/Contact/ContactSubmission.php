<?php

declare(strict_types=1);

namespace App\Models\Contact;

use App\Enums\SubmissionPriority;
use App\Enums\SubmissionStatus;
use App\Models\Project\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactSubmission extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'contact_submissions';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'project_id',
        'form_data',
        'status',
        'priority',
        'assigned_to',
        'ip_hash',
        'user_agent',
        'source',
        'submitted_at',
    ];

    protected $casts = [
        'form_data' => 'array',
        'assigned_to' => 'integer',
        'project_id' => 'integer',
        'submitted_at' => 'datetime',
        'status' => SubmissionStatus::class,
        'priority' => SubmissionPriority::class,
    ];

    public function notes()
    {
        return $this->hasMany(ContactSubmissionNote::class, 'submission_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
