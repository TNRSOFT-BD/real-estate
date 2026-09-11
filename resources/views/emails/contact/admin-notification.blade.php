@component('mail::message')
# New contact submission

A new message was received through the contact form.

**#{{ $submission->id }}**

@component('mail::table')
| Field | Value |
|-------|-------|
| Name | {{ $submission->name ?? '—' }} |
| Email | {{ $submission->email ?? '—' }} |
| Phone | {{ $submission->phone ?? '—' }} |
| Subject | {{ $submission->subject ?? '—' }} |
| Received | {{ $submission->created_at?->format('Y-m-d H:i:s') ?? '—' }} |
@endcomponent

@if($submission->message)
**Message:**

{{ $submission->message }}
@endif

@component('mail::button', ['url' => route('admin.contact.submissions.index')])
View submissions
@endcomponent

@if($submission->source)
Sent from: {{ $submission->source }}
@endif
@endcomponent