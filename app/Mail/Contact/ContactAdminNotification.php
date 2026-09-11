<?php

declare(strict_types=1);

namespace App\Mail\Contact;

use App\Models\Contact\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactAdminNotification extends Mailable
{
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly ContactSubmission $submission,
    ) {}

    public function build(): self
    {
        $from = config('contact.submission.from');

        return $this
            ->from($from['address'], $from['name'])
            ->subject('New contact submission #'.$this->submission->id)
            ->markdown('emails.contact.admin-notification', [
                'submission' => $this->submission,
            ]);
    }
}
