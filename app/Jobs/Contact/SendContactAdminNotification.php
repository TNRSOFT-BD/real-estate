<?php

declare(strict_types=1);

namespace App\Jobs\Contact;

use App\Mail\Contact\ContactAdminNotification;
use App\Models\Contact\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

final class SendContactAdminNotification implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 3;

    public int $timeout = 30;

    public array $backoff = [10, 30, 60];

    public int $uniqueFor = 3600;

    public function __construct(
        public readonly ContactSubmission $submission,
    ) {}

    public function uniqueId(): string
    {
        return 'contact-admin-notification:'.$this->submission->id;
    }

    public function handle(): void
    {
        $recipients = config('contact.submission.admin_recipients');

        if ($recipients === []) {
            Log::warning('No admin recipients configured for contact submissions.');

            return;
        }

        Mail::to($recipients)->send(new ContactAdminNotification($this->submission));
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Failed to send admin contact notification', [
            'submission_id' => $this->submission->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
