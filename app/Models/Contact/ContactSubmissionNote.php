<?php

declare(strict_types=1);

namespace App\Models\Contact;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSubmissionNote extends Model
{
    use HasFactory;

    protected $table = 'contact_submission_notes';

    protected $fillable = [
        'submission_id',
        'user_id',
        'note',
    ];

    public function submission()
    {
        return $this->belongsTo(ContactSubmission::class, 'submission_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
