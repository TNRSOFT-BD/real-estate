<?php

declare(strict_types=1);

namespace App\Jobs\Contact;

use App\Mail\Contact\ContactAcknowledgement;
use App\Models\Contact\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

final class SendContactAcknowledgement implements ShouldBeUnique, ShouldQueue
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
        return 'contact-acknowledgement:'.$this->submission->id;
    }

    public function handle(): void
    {
        $recipient = $this->submission->email;

        if (! Str::isValidEmail($recipient ?? '')) {
            Log::warning('No valid email to send acknowledgement to.', [
                'submission_id' => $this->submission->id,
            ]);

            return;
        }

        Mail::to($recipient)->send(new ContactAcknowledgement($this->submission));
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Failed to send contact acknowledgement', [
            'submission_id' => $this->submission->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
