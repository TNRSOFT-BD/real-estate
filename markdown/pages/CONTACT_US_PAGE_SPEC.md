# CONTACT US PAGE --- COMPLETE IMPLEMENTATION SPECIFICATION

**Stack:** Laravel + React + Inertia + Tailwind CSS\
**Architecture:** MVC + Service Layer + Repository Pattern\
**Scope:** Public Contact Us page + Admin CMS + Full CRUD +
submissions + security + performance

## 1. Objective

Build a production-ready, fully dynamic Contact Us module. Do not create
a static page or a simple form-only implementation.

The module must include:

-   Public Contact Us page
-   Admin CMS
-   Full CRUD for repeatable contact content
-   Contact information
-   Dynamic contact form
-   Dynamic form fields
-   Contact submissions
-   Submission status/priority/assignment/notes
-   FAQ CRUD
-   Sales/support team intro
-   Team member CRUD
-   Office/location CRUD
-   Friendly Google Maps location input
-   Social/contact links CRUD
-   Live chat configuration
-   SEO configuration
-   Media uploads
-   Validation
-   RBAC/authorization
-   Search/filter/pagination
-   Rate limiting and anti-spam
-   Queued email notifications
-   Caching and invalidation
-   Tests
-   Responsive/accessibility/error/loading states
-   High-traffic resilience

Follow `MASTER_PROJECT_RULES.md` and any existing `project-rules.md`.
Reuse existing project abstractions instead of creating conflicting
architecture.

------------------------------------------------------------------------

## 2. Architecture

Mandatory flow:

``` text
Route
→ Controller
→ Form Request
→ Service
→ Repository Interface
→ Repository Implementation
→ Model
→ Database
```

Rules:

-   Controllers stay thin.
-   No direct Eloquent queries in controllers.
-   Business logic belongs in Services.
-   Complex data access belongs in Repositories.
-   Use DTOs for complex application-boundary data.
-   Use Policies/permissions for authorization.
-   Do not put business rules in React.

Recommended structure:

``` text
app/
├── Http/Controllers/Frontend/ContactController.php
├── Http/Controllers/Admin/Contact/
├── Http/Requests/Contact/
├── Models/Contact/
├── Services/Contact/
├── Repositories/Contracts/Contact/
├── Repositories/Eloquent/Contact/
├── DTOs/Contact/
├── Policies/
└── Jobs/Contact/
```

Adjust names to existing project conventions.

------------------------------------------------------------------------

# 3. Public Page Structure

Build the Contact page with these configurable sections:

``` text
Contact Hero
Contact Information
Contact Form
FAQ
Sales/Support Intro
Team Members
Head Office / Locations
Google Map
Live Chat
Social / Alternative Contact
Closing CTA
```

Optional sections must not crash the page if their data is unavailable.

------------------------------------------------------------------------

# 4. Contact Hero CMS

Fields:

``` text
badge
title
highlight
description
primary_button_text
primary_button_link
secondary_button_text
secondary_button_link
background_image
is_active
```

Example content:

``` text
Badge: Contact Us
Title: Let's Start a Conversation
Description: Have a question, need support, or want to work with us? Our team is ready to help.
```

All production content must be database-driven.

------------------------------------------------------------------------

# 5. Contact Page Settings

Create a singleton settings record.

Suggested fields:

``` text
hero_badge
hero_title
hero_highlight
hero_description

form_title
form_description
form_success_message

faq_badge
faq_title
faq_description

team_badge
team_title
team_description

location_badge
location_title
location_description

live_chat_title
live_chat_description

closing_badge
closing_title
closing_description

seo_title
seo_description
seo_keywords
canonical_url
og_title
og_description
og_image
twitter_card

is_active
created_at
updated_at
```

Use `updateOrCreate`/`firstOrCreate` safely and prevent duplicate
singleton records.

------------------------------------------------------------------------

# 6. Contact Information CRUD

Table:

``` text
contact_information

id
type
title
value
secondary_value
icon
description
link
sort_order
is_active
created_at
updated_at
```

Types:

``` text
hotline
phone
email
address
business_hours
support
sales
whatsapp
other
```

Admin:

-   Create
-   Read
-   Update
-   Delete
-   Reorder
-   Activate/deactivate

Suggested icons:

``` text
Phone
Mail
MapPin
Clock
MessageCircle
Headphones
Globe
Building
Navigation
Send
```

Use an icon picker; do not require administrators to type component
names.

------------------------------------------------------------------------

# 7. Dynamic Contact Form

Default fields:

``` text
Name
Email
Phone
Subject
Message
```

Optional fields:

``` text
Company
Service
Budget
Preferred Contact Method
```

Create:

``` text
contact_form_fields
```

Fields:

``` text
id
name
label
type
placeholder
help_text
options JSON
is_required
is_active
sort_order
validation_rules JSON
created_at
updated_at
```

Supported types:

``` text
text
email
tel
textarea
select
radio
checkbox
```

Rules:

-   Field names unique.
-   Inactive fields do not appear publicly.
-   Required fields are validated server-side.
-   Frontend validation is supplementary.
-   Options are stored as structured JSON.
-   Never execute arbitrary validation rules from the database.

Supported validation rules should be whitelisted, e.g.:

``` text
required
nullable
string
email
min
max
url
regex
```

------------------------------------------------------------------------

# 8. Contact Submissions

Create:

``` text
contact_submissions

id
name
email
phone
subject
message
form_data JSON
status
priority
assigned_to
ip_hash
user_agent
source
submitted_at
created_at
updated_at
deleted_at
```

Status:

``` text
new
read
in_progress
waiting
resolved
closed
spam
```

Priority:

``` text
low
normal
high
urgent
```

`form_data` stores additional dynamic fields without creating a new DB
column for every field.

Never expose internal metadata publicly.

------------------------------------------------------------------------

# 9. Submission Management

Admin must support:

-   List
-   Search
-   View
-   Status update
-   Priority update
-   Assignment
-   Internal notes
-   Mark spam
-   Restore spam
-   Delete/archive
-   Bulk status update
-   Bulk delete where authorized
-   Search by name/email/phone/subject
-   Filter by status/priority/date/assignee
-   Pagination

Never load the entire submissions table into memory.

Use pagination/cursor pagination where appropriate.

------------------------------------------------------------------------

# 10. Submission Notes

Create:

``` text
contact_submission_notes

id
submission_id
user_id
note
created_at
updated_at
```

Notes are internal only.

Never send notes to public Inertia props.

------------------------------------------------------------------------

# 11. Assignment

Allow submissions to be assigned to authorized admin/staff users.

Rules:

-   Validate the user.
-   Validate permission.
-   Authorize server-side.
-   Prevent unauthorized assignment.
-   Log important assignment changes.

------------------------------------------------------------------------

# 12. FAQ CRUD

Create:

``` text
contact_faqs

id
question
answer
category
display_location
sort_order
is_active
created_at
updated_at
```

Display locations:

``` text
all
homepage
contact
faq
packages
```

Admin:

-   Create
-   Read
-   Update
-   Delete
-   Search
-   Filter
-   Reorder
-   Activate/deactivate
-   Pagination

Only return relevant active FAQs on the public page.

Sanitize rich text before rendering.

------------------------------------------------------------------------

# 13. Sales/Support Intro

Fields:

``` text
badge
title
description
button_text
button_link
image
sort_order
is_active
```

Admin can edit and replace the image.

------------------------------------------------------------------------

# 14. Team Member CRUD

If the Contact page displays individual representatives, create:

``` text
contact_team_members

id
name
role
department
email
phone
avatar
bio
availability
sort_order
is_active
created_at
updated_at
```

Departments:

``` text
Sales
Support
Billing
Technical
Management
Other
```

CRUD + reorder + activate/deactivate + image replacement.

------------------------------------------------------------------------

# 15. Locations / Head Office CRUD

Create:

``` text
contact_locations

id
name
address
city
state
country
postal_code
latitude
longitude
google_maps_url
place_id
phone
email
business_hours
is_primary
sort_order
is_active
created_at
updated_at
```

Admin must be able to:

-   Create
-   Read
-   Update
-   Delete
-   Set primary
-   Reorder
-   Activate/deactivate

Only one location should be primary.

Enforce this through transaction/application logic and database
constraints where appropriate.

------------------------------------------------------------------------

# 16. Friendly Map Location Input

Do not require raw Google Maps iframe HTML.

Provide:

``` text
Search location
OR
Enter address
OR
Paste Google Maps URL
```

Resolve/store when supported:

``` text
formatted address
latitude
longitude
place_id
google_maps_url
```

Google API credentials must be environment-configured.

Never hardcode API secrets.

If using a provider integration, isolate it behind a service/provider
layer.

------------------------------------------------------------------------

# 17. Map Frontend

Create:

``` text
ContactMap.tsx
```

Props:

``` ts
interface ContactMapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
}
```

Do not hardcode office coordinates.

If the map provider fails, show the address and an external map link
instead of breaking the page.

------------------------------------------------------------------------

# 18. Live Chat CRUD/Settings

Create singleton configuration:

``` text
contact_live_chat_settings

id
enabled
provider
script_url
widget_id
button_text
position
availability_text
created_at
updated_at
```

Providers should be extensible:

``` text
custom
tawk
crisp
intercom
other
```

Rules:

-   Load third-party scripts asynchronously.
-   Do not block initial rendering.
-   Do not inject duplicate scripts.
-   If disabled, do not load the script.
-   Failure must not crash the page.

------------------------------------------------------------------------

# 19. Social / Alternative Contact Links

Create:

``` text
contact_social_links

id
platform
label
url
icon
sort_order
is_active
created_at
updated_at
```

Possible platforms:

``` text
Facebook
Instagram
LinkedIn
YouTube
WhatsApp
Messenger
Telegram
```

Validate URLs and whitelist safe schemes.

Reject dangerous schemes such as:

``` text
javascript:
data:
vbscript:
```

------------------------------------------------------------------------

# 20. Routes

Public:

``` text
GET /contact
POST /contact
```

Admin examples:

``` text
/admin/contact
/admin/contact/settings
/admin/contact/information
/admin/contact/form-fields
/admin/contact/submissions
/admin/contact/submissions/{submission}
/admin/contact/faqs
/admin/contact/team
/admin/contact/locations
/admin/contact/social-links
/admin/contact/live-chat
```

Follow existing route conventions.

------------------------------------------------------------------------

# 21. Controllers

Suggested controllers:

``` text
Frontend/ContactController
Admin/ContactPageSettingsController
Admin/ContactInformationController
Admin/ContactFormFieldController
Admin/ContactSubmissionController
Admin/ContactFaqController
Admin/ContactTeamController
Admin/ContactLocationController
Admin/ContactSocialLinkController
Admin/ContactLiveChatController
```

Controllers should only:

``` text
receive request
authorize
call service
return Inertia/redirect/response
```

No business logic.

------------------------------------------------------------------------

# 22. Services

Suggested:

``` text
ContactPageService
ContactSubmissionService
ContactLocationService
ContactMediaService
ContactFormService
```

Responsibilities:

### ContactPageService

-   Build public page data.
-   Cache public content.
-   Coordinate section repositories.

### ContactSubmissionService

-   Create submission.
-   Normalize form data.
-   Run business rules.
-   Dispatch notifications.
-   Manage status transitions.
-   Manage assignment.

### ContactLocationService

-   CRUD.
-   Coordinate normalization.
-   Map provider integration.
-   Primary location rules.

### ContactMediaService

-   Upload.
-   Replace.
-   Delete old media.
-   Optimize.

------------------------------------------------------------------------

# 23. Repositories

Create interfaces + implementations for:

``` text
ContactPageSettingRepository
ContactInformationRepository
ContactFormFieldRepository
ContactSubmissionRepository
ContactFaqRepository
ContactTeamMemberRepository
ContactLocationRepository
ContactSocialLinkRepository
ContactLiveChatRepository
```

Examples:

``` text
getActiveForPublic()
getPaginated()
search()
filterByStatus()
filterByPriority()
getPrimary()
```

Complex queries belong here.

------------------------------------------------------------------------

# 24. DTOs

Use DTOs where payloads are complex:

``` text
CreateContactSubmissionData
UpdateContactSubmissionData
ContactPageSettingsData
ContactFormFieldData
ContactLocationData
```

Avoid passing large uncontrolled arrays throughout the application.

------------------------------------------------------------------------

# 25. Form Requests

Create dedicated requests such as:

``` text
StoreContactSubmissionRequest
UpdateContactPageSettingsRequest
StoreContactInformationRequest
UpdateContactInformationRequest
StoreContactFormFieldRequest
UpdateContactFormFieldRequest
UpdateContactSubmissionRequest
StoreContactFaqRequest
UpdateContactFaqRequest
StoreContactTeamMemberRequest
UpdateContactTeamMemberRequest
StoreContactLocationRequest
UpdateContactLocationRequest
StoreContactSocialLinkRequest
UpdateContactSocialLinkRequest
UpdateContactLiveChatRequest
```

Dynamic public form validation must be generated safely from trusted
field configuration.

------------------------------------------------------------------------

# 26. RBAC / Permissions

Suggested permissions:

``` text
contact.view
contact.create
contact.update
contact.delete

contact.settings.view
contact.settings.update

contact.submissions.view
contact.submissions.update
contact.submissions.delete
contact.submissions.assign
contact.submissions.bulk

contact.faq.view
contact.faq.create
contact.faq.update
contact.faq.delete

contact.team.view
contact.team.create
contact.team.update
contact.team.delete

contact.location.view
contact.location.create
contact.location.update
contact.location.delete

contact.social.view
contact.social.create
contact.social.update
contact.social.delete

contact.livechat.view
contact.livechat.update
```

Frontend hiding is not authorization. Always enforce permissions
server-side.

------------------------------------------------------------------------

# 27. Contact Form Security

Implement:

-   CSRF protection.
-   Server-side validation.
-   Rate limiting.
-   Honeypot.
-   Request size limits.
-   Email validation.
-   Safe string handling.
-   URL validation.
-   Optional CAPTCHA.
-   IP/email abuse protection.

Never trust public input for:

``` text
status
priority
assigned_to
user_id
created_at
```

------------------------------------------------------------------------

# 28. Rate Limiting

Protect:

``` text
POST /contact
```

Use layered controls where appropriate:

``` text
IP + endpoint
IP + email
```

Use Redis-backed rate limiting in horizontally scaled environments.

The endpoint must remain cheap even during abuse.

------------------------------------------------------------------------

# 29. Email Notifications

After storing a submission:

``` text
Validate
→ Store
→ Dispatch Job
→ Send notification
```

Do not make email delivery block the request if avoidable.

Jobs:

``` text
SendContactAdminNotification
SendContactAcknowledgement
```

Jobs must have:

-   retries
-   backoff
-   timeout
-   failure handling
-   idempotency where applicable

If email fails, the submission remains stored.

------------------------------------------------------------------------

# 30. Database Indexes

Add indexes according to actual query patterns.

Suggested:

``` text
contact_information:
(is_active, sort_order)
(type, is_active)

contact_form_fields:
(is_active, sort_order)

contact_submissions:
(status, created_at)
(priority, created_at)
(assigned_to, status)
(created_at)

contact_faqs:
(is_active, sort_order)
(display_location, is_active)

contact_team_members:
(is_active, sort_order)

contact_locations:
(is_active, sort_order)

contact_social_links:
(is_active, sort_order)
```

Do not blindly index every column.

Use `EXPLAIN` for expensive queries.

------------------------------------------------------------------------

# 31. Data Structures & Algorithms

Use the appropriate structure for the problem.

Examples:

``` text
Associative map → repeated lookup by field/key
Set → membership checks
Collection → readable transformations
LazyCollection → large datasets
Queue → asynchronous work
```

Avoid unnecessary:

``` text
O(n²)
O(n³)
nested loops
repeated linear searches
queries inside loops
```

Let the database perform:

``` text
filtering
sorting
counting
grouping
aggregation
joins
```

instead of loading large datasets into PHP.

Never use unbounded:

``` php
Model::all()
```

for growing tables.

Use:

``` text
pagination
cursor pagination
chunkById
LazyCollection
bulk operations
```

where appropriate.

------------------------------------------------------------------------

# 32. Contact Page Performance

The public page should use an optimized data retrieval flow.

Avoid:

``` text
one query per section
one query per item
N+1 relationships
```

Use:

``` text
indexes
eager loading when required
aggregates
select only needed columns
caching
```

Do not load admin-only data into public props.

------------------------------------------------------------------------

# 33. Caching

Cache public Contact content where appropriate:

``` text
contact.page.settings
contact.information.active
contact.form.fields.active
contact.faqs.contact
contact.team.active
contact.locations.active
contact.social.active
contact.livechat.settings
```

Use explicit TTLs and predictable keys.

Invalidate only affected keys after:

``` text
create
update
delete
activate/deactivate
reorder
```

Never cache private submissions under public keys.

Protect against cache stampedes with locks or stale-while-revalidate
where useful.

------------------------------------------------------------------------

# 34. Admin Performance

All large admin lists must be paginated.

Submission table:

``` text
search
filter
sort
paginate
```

Use only required columns.

Avoid queries inside loops.

Use eager loading for required relationships.

Bulk actions should use bulk DB operations when safe.

Very large batch operations should be queued.

------------------------------------------------------------------------

# 35. 10,000+ Request Resilience

Do not claim that a specific server can always handle exactly 10,000
requests. Capacity depends on:

``` text
CPU
RAM
PHP workers
database
query complexity
cache hit rate
network
external APIs
queue capacity
infrastructure
```

Design for horizontal scaling:

``` text
CDN/WAF
    ↓
Load Balancer
    ↓
App Server 1 / 2 / N
    ↓
Redis
    ↓
MySQL Primary
    ↓
Optional Read Replicas
```

Requirements:

-   Stateless application servers.
-   Shared Redis for sessions/cache/queues/rate limiting.
-   Shared/object storage for uploaded files.
-   CDN for public assets.
-   Bounded DB connections.
-   Efficient indexed queries.
-   Queues for expensive work.
-   Rate limiting.
-   Timeouts.
-   Health checks.
-   Graceful deploy/restart.
-   Monitoring.

Never depend on local in-memory state or local filesystem for critical
shared application state.

------------------------------------------------------------------------

# 36. PHP / Runtime Resilience

If using PHP-FPM:

-   Size `pm.max_children` from available RAM and measured worker
    memory.
-   Monitor worker saturation.
-   Keep HTTP requests short.
-   Do not perform huge synchronous operations.

Laravel Octane may be considered only after compatibility and
memory/state-leak testing.

Do not introduce persistent workers without checking request-state
safety.

------------------------------------------------------------------------

# 37. Database Resilience

Protect the DB from request amplification.

Never allow one request to cause hundreds/thousands of unnecessary
queries.

Use:

``` text
indexes
bounded queries
pagination
eager loading
aggregates
bulk updates
short transactions
```

Monitor:

``` text
connections
slow queries
latency
CPU
memory
locks
```

Do not create unlimited DB connections.

Read replicas should only be introduced when justified and consistency
implications are understood.

------------------------------------------------------------------------

# 38. External Service Resilience

For:

``` text
Google Maps/geocoding
email provider
live chat
CAPTCHA
```

Use:

``` text
timeouts
bounded retries
exponential backoff
jitter
failure isolation
```

Do not blindly retry non-idempotent actions.

External service failure must not crash the Contact page.

------------------------------------------------------------------------

# 39. Request Amplification Protection

One HTTP request must not trigger uncontrolled work.

Avoid:

``` text
1 request → 1000 DB queries
1 request → 100 external API calls
1 request → huge synchronous image processing
1 request → huge export
```

Use:

``` text
batching
queues
pagination
aggregates
caching
limits
```

------------------------------------------------------------------------

# 40. Media

For uploaded images:

-   Validate MIME.
-   Validate extension.
-   Validate size.
-   Generate safe filenames.
-   Store safely.
-   Do not execute uploads.
-   Delete replaced media safely.
-   Use shared/object storage when horizontally scaling.
-   Optimize images.
-   Process expensive transformations asynchronously.

------------------------------------------------------------------------

# 41. Frontend Structure

Suggested:

``` text
resources/js/Pages/Contact/Index.tsx

resources/js/components/Frontend/Contact/
├── ContactHero.tsx
├── ContactInformation.tsx
├── ContactForm.tsx
├── ContactFaq.tsx
├── ContactTeamIntro.tsx
├── ContactTeam.tsx
├── ContactLocation.tsx
├── ContactMap.tsx
├── LiveChatWidget.tsx
├── ContactSocialLinks.tsx
└── ContactClosing.tsx
```

Reuse existing project components where possible.

------------------------------------------------------------------------

# 42. Inertia Props

Public page should receive only what it needs:

``` ts
interface ContactPageProps {
    hero: ContactHero;
    contactInformation: ContactInformation[];
    form: ContactFormConfig;
    faqs: ContactFaq[];
    teamIntro: ContactTeamIntro | null;
    teamMembers: ContactTeamMember[];
    locations: ContactLocation[];
    socialLinks: ContactSocialLink[];
    liveChat: LiveChatConfig | null;
    seo: SeoData;
}
```

Never expose:

``` text
IP hash
user agent
internal notes
assignment metadata
admin-only fields
```

------------------------------------------------------------------------

# 43. Contact Form UX

Must include:

-   Accessible labels.
-   Required indicators.
-   Inline validation.
-   Server validation errors.
-   Loading state.
-   Disabled submit during request.
-   Success state.
-   Error state.
-   Keyboard navigation.
-   Focus management.
-   Mobile usability.
-   Preserve values after validation failure.

Do not rely on client-side validation alone.

------------------------------------------------------------------------

# 44. Loading / Empty / Error States

Every dynamic section must handle:

``` text
loading
empty
error
```

Examples:

``` text
No FAQs available.
No office location configured.
No team members available.
No contact requests found.
```

Optional public section failures should not crash the entire page.

------------------------------------------------------------------------

# 45. Responsive Design

Follow the master responsive rules.

Support at least:

``` text
Small
Medium
Large
Extra Large
```

Requirements:

-   Mobile-first.
-   Consistent containers.
-   No horizontal overflow.
-   Form stacks on small screens.
-   Map remains usable.
-   Touch-friendly controls.
-   Typography scales appropriately.
-   Buttons remain accessible.

------------------------------------------------------------------------

# 46. Accessibility

Implement:

-   Semantic headings.
-   Proper form labels.
-   Keyboard navigation.
-   Visible focus.
-   Accessible errors.
-   Appropriate ARIA.
-   Contrast.
-   Meaningful button text.
-   Image alt text.
-   Accessible FAQ accordion.

------------------------------------------------------------------------

# 47. Visual Design

The Contact page should be:

``` text
Modern
Professional
Elegant
Trustworthy
Clean
Premium
Responsive
```

Avoid:

-   generic template appearance
-   excessive gradients
-   excessive glassmorphism
-   too many animations
-   oversized cards
-   excessive decorative effects

If the project uses a futuristic visual identity, use it subtly.

------------------------------------------------------------------------

# 48. SEO

Contact page must support:

``` text
SEO title
Meta description
Canonical URL
Open Graph title
Open Graph description
Open Graph image
Twitter/X card
```

Use the existing SEO abstraction.

Do not hardcode SEO values in React.

------------------------------------------------------------------------

# 49. Audit Logging

Audit important admin actions:

``` text
settings updated
contact information created/deleted
form field changed
submission status changed
submission assigned
submission deleted
FAQ changed
team member changed
location changed
live chat changed
social link changed
```

Do not log sensitive message content unnecessarily.

------------------------------------------------------------------------

# 50. Transactions & Concurrency

Use transactions for multi-step writes.

Examples:

``` text
replace media + update settings
change primary location
assignment + status update
bulk transitions
```

Use appropriate locking/unique constraints for race-sensitive
operations.

Do not wrap simple reads in unnecessary transactions.

------------------------------------------------------------------------

# 51. Testing

Feature tests:

-   Public Contact page loads.
-   Successful submission.
-   Validation failure.
-   Rate limit.
-   Unauthorized admin access.
-   Authorized CRUD.
-   Status transition.
-   Assignment.
-   Notes.
-   FAQ CRUD.
-   Team CRUD.
-   Location CRUD.
-   Social CRUD.
-   Live chat settings.

Unit tests:

-   Submission service.
-   Dynamic validation.
-   Location service.
-   Cache invalidation.
-   Status rules.

Browser tests where available:

-   Contact form.
-   Admin CRUD.
-   Search/filter.
-   Responsive behavior.

Security tests:

``` text
invalid email
oversized message
invalid URL
unauthorized assignment
unauthorized deletion
spam
rate-limit exceeded
malformed dynamic data
invalid upload
CSRF failure
```

------------------------------------------------------------------------

# 52. Admin UI

Recommended navigation:

``` text
Contact Us
├── Overview
├── Page Settings
├── Contact Information
├── Form Fields
├── Submissions
├── FAQs
├── Team
├── Locations
├── Social Links
└── Live Chat
```

Submission overview may show:

``` text
New
In Progress
Resolved
Spam
```

Use aggregates instead of loading every submission.

------------------------------------------------------------------------

# 53. Admin Table Rules

Tables should have:

-   Search
-   Filter
-   Sort
-   Pagination
-   Status badges
-   Row actions
-   Bulk actions
-   Confirmation dialogs
-   Empty state
-   Loading state
-   Error state

Do not overload tables with unnecessary columns.

------------------------------------------------------------------------

# 54. Delete Rules

Destructive actions require confirmation.

For bulk deletion:

``` text
show affected count
authorize action
validate IDs
perform safely
return success/failure summary
```

Use soft deletes for submissions when appropriate.

Do not introduce soft deletes into every table without justification.

------------------------------------------------------------------------

# 55. Sort Order

Support ordering for:

``` text
Contact Information
Form Fields
FAQs
Team Members
Locations
Social Links
```

Use numeric `sort_order`.

If drag-and-drop is used, persist ordering server-side.

Do not depend on frontend ordering.

------------------------------------------------------------------------

# 56. Graceful Degradation

If Google Maps fails:

``` text
Show address + external map link.
```

If live chat fails:

``` text
Hide widget and retain normal contact methods.
```

If email provider fails:

``` text
Submission remains stored and notification is retried.
```

If an optional section fails:

``` text
Do not crash the entire page.
```

------------------------------------------------------------------------

# 57. Queue Jobs

Potential jobs:

``` text
SendContactAdminNotification
SendContactAcknowledgement
ProcessContactMedia
ArchiveOldContactSubmissions
CleanupSpamSubmissions
```

Each job should have:

``` text
retry policy
backoff
timeout
failure handling
idempotency where appropriate
```

Do not blindly increase worker count.

Monitor queue depth and failed jobs.

------------------------------------------------------------------------

# 58. Observability

Monitor:

``` text
request rate
P50 latency
P95 latency
P99 latency
error rate
429 responses
500 responses
DB latency
DB connections
slow queries
Redis latency
Redis memory
queue depth
failed jobs
external API latency
cache hit/miss
PHP worker utilization
```

Use correlation/request IDs where supported.

------------------------------------------------------------------------

# 59. Performance Review

Before release verify:

-   No N+1.
-   No unbounded queries.
-   No `Model::all()` on growing tables.
-   No queries inside loops.
-   Proper indexes.
-   Admin pagination.
-   Public caching.
-   Targeted cache invalidation.
-   Queued email.
-   Deferred third-party scripts.
-   Optimized images.
-   Rate limiting.
-   Queue monitoring.
-   External timeouts.
-   Database connection limits.

Use load testing tools such as k6/JMeter/Locust when the real
infrastructure needs capacity validation.

Track P95/P99, not only average latency.

------------------------------------------------------------------------

# 60. Final CRUD Checklist

## Page Settings

-   [ ] View
-   [ ] Update
-   [ ] Validation
-   [ ] Media
-   [ ] SEO

## Contact Information

-   [ ] Create
-   [ ] Read
-   [ ] Update
-   [ ] Delete
-   [ ] Reorder
-   [ ] Activate/deactivate

## Form Fields

-   [ ] Create
-   [ ] Read
-   [ ] Update
-   [ ] Delete
-   [ ] Reorder
-   [ ] Required/optional
-   [ ] Dynamic options

## Submissions

-   [ ] List
-   [ ] Search
-   [ ] Filter
-   [ ] View
-   [ ] Status
-   [ ] Priority
-   [ ] Assignment
-   [ ] Notes
-   [ ] Bulk actions
-   [ ] Archive/delete

## FAQs

-   [ ] Create
-   [ ] Read
-   [ ] Update
-   [ ] Delete
-   [ ] Reorder
-   [ ] Activate/deactivate

## Team

-   [ ] Create
-   [ ] Read
-   [ ] Update
-   [ ] Delete
-   [ ] Image replacement
-   [ ] Reorder
-   [ ] Activate/deactivate

## Locations

-   [ ] Create
-   [ ] Read
-   [ ] Update
-   [ ] Delete
-   [ ] Coordinates
-   [ ] Primary location
-   [ ] Reorder
-   [ ] Activate/deactivate

## Social Links

-   [ ] Create
-   [ ] Read
-   [ ] Update
-   [ ] Delete
-   [ ] Reorder
-   [ ] Activate/deactivate

## Live Chat

-   [ ] Enable/disable
-   [ ] Provider
-   [ ] Configuration
-   [ ] Validation

------------------------------------------------------------------------

# 61. AI Coding Agent Rules

Before coding:

1.  Read `MASTER_PROJECT_RULES.md`.
2.  Inspect existing Contact-related code.
3.  Inspect existing architecture and naming conventions.
4.  Reuse existing components/services/repositories.
5.  Do not create duplicate abstractions.
6.  Do not change unrelated modules.

During coding:

7.  Create migrations first.
8.  Add models/relationships.
9.  Add repository contracts/implementations.
10. Add DTOs where needed.
11. Add Form Requests.
12. Add Services.
13. Add Policies/permissions.
14. Add Controllers.
15. Add Routes.
16. Build public Inertia page.
17. Build Admin CRUD.
18. Add media handling.
19. Add queued notifications.
20. Add caching/invalidation.
21. Add rate limiting.
22. Add tests.

After coding:

23. Run formatter/linter.
24. Run tests.
25. Inspect query count/N+1.
26. Review indexes.
27. Test authorization.
28. Test mobile responsiveness.
29. Test loading/empty/error states.
30. Test rate limits.
31. Test queue failures.
32. Test external-service failure.
33. Test cache invalidation.
34. Review security.
35. Review performance.
36. Verify every acceptance criterion.

Never claim the module is complete if critical CRUD, authorization,
validation, tests, or error handling are missing.

------------------------------------------------------------------------

# 62. Final Acceptance Criteria

The Contact Us module is complete only when:

-   Public Contact page is fully functional.
-   Content is database-driven.
-   Admin CRUD is complete.
-   Submissions are safely stored.
-   Submission management works.
-   FAQ CRUD works.
-   Team CRUD works.
-   Location CRUD works.
-   Social CRUD works.
-   Live chat is configurable.
-   Maps use stored coordinates rather than hardcoded locations.
-   Form validation works server-side and client-side.
-   Rate limiting/anti-spam exists.
-   Email notifications are queued.
-   RBAC is enforced.
-   Important admin actions are auditable.
-   Caching and invalidation work.
-   No N+1 exists.
-   Large lists are paginated.
-   Indexes match query patterns.
-   External failures degrade gracefully.
-   Tests cover critical flows.
-   Responsive/accessibility requirements are met.
-   SEO is dynamic.
-   No secrets are exposed.
-   No unrelated architecture is rewritten.
-   The module follows `MASTER_PROJECT_RULES.md`.

------------------------------------------------------------------------

# 63. Final Principle

Implement Contact Us as a **production-grade CMS-driven module**, not
merely a frontend page.

The visitor experience should remain simple and polished.

The administrator experience should provide complete control.

The backend must remain:

``` text
Clean
Secure
Scalable
Performant
Maintainable
Testable
Architecture-consistent
```

The system should safely absorb traffic spikes through efficient
queries, caching, queues, rate limits, bounded resources, and
horizontally scalable architecture rather than relying on an unrealistic
fixed request guarantee.
