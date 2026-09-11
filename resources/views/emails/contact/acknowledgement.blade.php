@component('mail::message')
# Thank you for reaching out

We received your message and will get back to you as soon as possible.

@if($submission->subject)
**Subject:** {{ $submission->subject }}
@endif

@if($submission->message)
**Your message:**

{{ $submission->message }}
@endif

If this enquiry was sent by mistake, you can ignore this email. No action is needed.

Thanks,

{{ config('app.name') }}
@endcomponent