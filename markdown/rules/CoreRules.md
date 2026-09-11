# Master Project Rules & Technical Specifications

**Document Version:** `2.1.0`\
**Purpose:** Reusable baseline for professional, scalable web projects\
**Architecture:** Laravel + React + Inertia.js + Tailwind CSS\
**Scope:** Domain-agnostic --- do not assume ISP, real estate,
e-commerce, SaaS, corporate, or any other specific business domain.

------------------------------------------------------------------------

## 1. Project Philosophy

This document is a **master engineering and project-structure
guideline** intended to be reused across different web projects.

The project must be:

-   Modular
-   Maintainable
-   Scalable
-   Secure
-   Performant
-   Accessible
-   SEO-friendly
-   Easy for multiple developers or AI coding sessions to understand
-   Consistent across frontend, backend, database, and admin/CMS layers

### 1.1 Domain-Neutral Rule

Never hardcode a business domain into the architecture unless the
current project explicitly requires it.

Examples such as `products`, `properties`, `packages`, `services`,
`courses`, `plans`, or `projects` are **domain examples only**, not
mandatory entities.

Before implementation, identify the actual project's:

1.  Business domain
2.  Public pages
3.  Admin/CMS requirements
4.  Core entities
5.  User roles and permissions
6.  Integrations
7.  Content structure
8.  SEO requirements

------------------------------------------------------------------------

# 2. Core Technology Stack

## 2.1 Backend

-   Laravel --- latest stable version compatible with the project
    environment
-   PHP 8.2+
-   MVC with strict **Service Layer + Repository Pattern**
-   MySQL 8.0+
-   Redis for cache, queues, and sessions where appropriate
-   Eloquent ORM
-   Laravel API Resources where a resource/transformer layer is useful
-   Form Requests for validation
-   Policies/Gates for authorization
-   Jobs/Queues for asynchronous work

## 2.2 Frontend

-   React 18+
-   TypeScript
-   Tailwind CSS
-   Inertia.js
-   Headless UI or another accessible component solution where
    appropriate
-   Lucide/Heroicons or another consistent SVG icon system
-   React Hook Form + Zod where complex forms require client-side
    validation
-   Framer Motion for subtle animations where appropriate

## 2.3 Build & Quality Tools

-   Vite
-   ESLint
-   Prettier
-   TypeScript strict mode
-   Git
-   Automated tests appropriate to project complexity

------------------------------------------------------------------------

# 3. Architecture Rules

## 3.1 Layered Architecture

Use clear separation of concerns:

``` text
Presentation
├── React Pages
├── React Components
├── Inertia
└── Blade fallback where required

Application
├── Controllers
├── Services
├── DTOs
├── Form Requests
└── Resources

Domain / Data Access
├── Models
├── Repository Contracts
├── Eloquent Repositories
├── Enums
└── Domain-specific rules

Infrastructure
├── Database
├── Cache
├── Queues
├── Storage
├── Mail
└── External APIs
```

A layer must not absorb responsibilities that belong to another layer.

------------------------------------------------------------------------

# 4. Repository Pattern

Repositories exist to isolate data-access concerns from
application/business logic.

Recommended structure:

``` text
app/
├── Repositories/
│   ├── Contracts/
│   │   └── ExampleRepositoryInterface.php
│   └── Eloquent/
│       └── EloquentExampleRepository.php
├── Services/
│   └── ExampleService.php
└── Models/
    └── Example.php
```

### Rules

-   Controllers must not contain direct Eloquent queries.
-   Repositories must implement contracts/interfaces.
-   Complex database queries belong in repositories.
-   Services coordinate business logic.
-   Use dependency injection.
-   Do not create repositories merely for trivial code if the project's
    architecture intentionally allows a simpler approach; however,
    consistency within an established project is mandatory.
-   Avoid generic repositories that hide useful domain-specific query
    methods.

------------------------------------------------------------------------

# 5. Service Layer

Services encapsulate business/application logic.

### Rules

-   Services should be stateless where practical.
-   Services should not become dumping grounds for database queries.
-   Use DTOs for complex input/output boundaries.
-   Use transactions when multiple related writes must succeed or fail
    together.
-   Log important business operations.
-   Throw meaningful domain/application exceptions where appropriate.
-   Keep services focused on a clear responsibility.

Example flow:

``` text
HTTP Request
    ↓
Form Request
    ↓
Controller
    ↓
DTO
    ↓
Service
    ↓
Repository
    ↓
Model / Database
```

------------------------------------------------------------------------

# 6. Controller Rules

Controllers must remain thin.

Controllers should:

-   Receive HTTP requests
-   Authorize actions
-   Accept validated data
-   Create/pass DTOs
-   Call services
-   Return Inertia responses, redirects, JSON, or resources

Controllers should **not**:

-   Contain business logic
-   Perform complex queries
-   Manipulate large datasets directly
-   Handle complex validation manually
-   Contain reusable business rules

Preferred:

``` php
public function store(StoreExampleRequest $request)
{
    $dto = StoreExampleDTO::fromRequest($request);

    $this->exampleService->create($dto);

    return redirect()
        ->route('examples.index')
        ->with('success', 'Created successfully.');
}
```

------------------------------------------------------------------------

# 7. DTO Rules

Use DTOs when they improve boundaries between HTTP input, application
logic, and domain operations.

Recommended:

``` text
app/
└── DTOs/
    ├── Example/
    │   ├── CreateExampleDTO.php
    │   └── UpdateExampleDTO.php
    └── Shared/
```

DTOs should:

-   Be typed
-   Represent a meaningful data contract
-   Avoid business logic
-   Be easy to test
-   Avoid accepting arbitrary unvalidated input

Do not create DTOs for every trivial value if doing so only adds
unnecessary complexity.

------------------------------------------------------------------------

# 8. Validation

All external input must be validated.

Use:

-   Laravel Form Requests for server-side validation
-   Zod for complex client-side validation when useful
-   Authorization inside Form Requests or Policies as appropriate
-   Database constraints as a final integrity layer

Never rely only on frontend validation.

------------------------------------------------------------------------

# 9. Authorization & Roles

Authorization must be explicit.

Use:

-   Policies
-   Gates
-   Middleware
-   Role/permission system when project requirements justify it

Never hide an admin action only in the UI and assume it is secure.

Every protected operation must be authorized server-side.

------------------------------------------------------------------------

# 10. Database Rules

## 10.1 Naming

Use Laravel conventions:

-   Tables: `snake_case`, plural
-   Columns: `snake_case`
-   Foreign keys: `{model}_id`
-   Pivot tables: alphabetical convention where appropriate

## 10.2 Integrity

Use:

-   Foreign keys
-   Appropriate indexes
-   Unique constraints
-   Nullable columns only when meaningful
-   Transactions for related writes
-   Soft deletes only where business requirements justify them

## 10.3 Query Performance

-   Avoid N+1 queries.
-   Use eager loading intentionally.
-   Select only required columns for expensive queries.
-   Paginate large datasets.
-   Use appropriate indexes.
-   Avoid loading entire tables into memory.
-   Use chunking/cursor iteration for very large datasets.
-   Cache expensive, stable queries where beneficial.

------------------------------------------------------------------------

# 11. Dynamic Theme System

The architecture may support project-level dynamic theming.

Theme configuration can include:

``` text
Primary
Secondary
Accent
Success
Warning
Error
Background
Surface
Text
Muted
Border
```

### Rules

-   Do not scatter hardcoded brand colors throughout components.
-   Use semantic design tokens/CSS variables.
-   Theme values may come from configuration or database depending on
    project requirements.
-   If an admin can modify themes, validate all color values
    server-side.
-   Provide safe fallback values.
-   Do not make every component dependent on database calls.

Recommended conceptual flow:

``` text
Database / Config
      ↓
Theme Service
      ↓
Shared Inertia Props
      ↓
CSS Variables
      ↓
React Components
```

------------------------------------------------------------------------

# 12. Dynamic Typography

Where required, support configurable typography.

Possible configuration:

``` text
Primary Font
Secondary Font
Heading Weight
Body Weight
```

Rules:

-   Provide a reliable fallback font.
-   Validate externally loaded font URLs.
-   Avoid loading unnecessary font weights.
-   Do not create a separate font-loading request for every component.
-   Ensure typography remains accessible and readable.

------------------------------------------------------------------------

# 13. Responsive Design

Use mobile-first responsive design.

Default Tailwind breakpoints may be used:

``` text
sm
md
lg
xl
2xl
```

Components must be tested across:

-   Small mobile
-   Large mobile
-   Tablet
-   Laptop
-   Desktop
-   Large desktop

### Responsive principles

-   Maintain consistent container widths.
-   Use predictable horizontal spacing.
-   Scale typography appropriately.
-   Avoid horizontal overflow.
-   Touch targets must remain usable.
-   Navigation must work on small screens.
-   Do not simply shrink desktop layouts; redesign layouts where
    necessary.

------------------------------------------------------------------------

# 14. Frontend Architecture

Recommended:

``` text
resources/js/
├── Pages/
├── Components/
├── Layouts/
├── hooks/
├── contexts/
├── types/
├── lib/
└── utils/
```

### Pages

Pages represent route-level screens.

### Components

Components represent reusable UI or section-level units.

### Hooks

Hooks contain reusable client-side behavior.

### Contexts

Use Context for shared state that genuinely needs application-wide
access.

Avoid global state libraries unless project complexity requires them.

------------------------------------------------------------------------

# 15. Page Architecture

Every project should define its own pages based on business
requirements.

Do not copy pages from another project merely because they existed
there.

A typical corporate/content website may have:

``` text
Home
About
Services
Projects / Portfolio
Project Details
Team
Gallery
News / Blog
Article Details
Contact
Privacy Policy
Terms & Conditions
```

A different project may instead require:

``` text
Home
Products
Product Details
Pricing
FAQ
Documentation
Contact
```

The architecture is reusable; the page list is project-specific.

------------------------------------------------------------------------

# 16. Reusable Frontend Components

Common components may include:

``` text
Common/
├── Button
├── Input
├── Select
├── Modal
├── Drawer
├── Dropdown
├── Tabs
├── Badge
├── Card
├── Table
├── Pagination
├── EmptyState
├── LoadingState
├── ErrorState
├── Breadcrumb
├── SectionHeading
├── PageHeader
├── CTASection
├── ConfirmDialog
├── Toast
└── Skeleton
```

Only create a reusable component when it has a clear reuse case.

Avoid premature abstraction.

------------------------------------------------------------------------

# 17. Public Website Layout

For content/corporate websites, a shared public layout can contain:

``` text
PublicLayout
├── Announcement Bar (optional)
├── Navbar
├── Main Content
└── Footer
```

The Navbar and Footer should be reusable across public pages.

Admin interfaces should use a separate layout.

------------------------------------------------------------------------

# 18. Content / CMS Architecture

If the project requires admin-managed content, separate content
management from presentation.

Typical configurable content can include:

``` text
Site Identity
SEO Defaults
Navigation
Footer
Homepage Sections
About Content
Services
Projects / Portfolio
Team Members
Gallery
News / Articles
Contact Information
Social Links
Legal Pages
Theme
Typography
```

The actual entities must be defined according to the project's domain.

### CMS Rules

-   Admin-editable content should not require code changes.
-   Use migrations for schema changes.
-   Validate uploaded content.
-   Sanitize rich text.
-   Store media references cleanly.
-   Support ordering where content is displayed in sequences.
-   Provide active/inactive status where needed.
-   Do not over-generalize the database into one giant JSON table.

------------------------------------------------------------------------

# 19. Media & Uploads

Use a consistent media strategy.

Rules:

-   Validate MIME type.
-   Validate file size.
-   Generate optimized image variants where useful.
-   Store media outside source code.
-   Delete replaced media when appropriate.
-   Avoid loading original high-resolution images when a resized version
    is sufficient.
-   Use lazy loading for non-critical images.
-   Provide meaningful alt text.
-   Never trust client-provided filenames or MIME types alone.

Recommended conceptual structure:

``` text
storage/
└── app/
    └── public/
        ├── images/
        ├── documents/
        └── media/
```

The exact storage strategy may change for S3 or another object-storage
provider.

------------------------------------------------------------------------

# 20. SEO

Every public page should consider:

-   Title
-   Meta description
-   Canonical URL
-   Open Graph data
-   Twitter/social metadata where relevant
-   Structured data where appropriate
-   Semantic HTML
-   Heading hierarchy
-   Image alt text
-   Sitemap
-   Robots configuration

Dynamic content pages should generate metadata from their database
content where appropriate.

------------------------------------------------------------------------

# 21. Accessibility

Follow accessible UI principles.

Requirements:

-   Semantic HTML
-   Keyboard navigation
-   Visible focus states
-   Accessible labels
-   Appropriate ARIA only when necessary
-   Sufficient contrast
-   Alt text for meaningful images
-   Captions/transcripts for relevant media
-   Forms with clear validation messages
-   Modals/dialogs that manage focus correctly

Do not use animation in a way that prevents users from accessing
content.

------------------------------------------------------------------------

# 22. Animation Rules

Use animation to improve UX, not to decorate everything.

Preferred:

-   Fade
-   Slide
-   Scale
-   Staggered reveal
-   Hover transitions
-   Subtle parallax where appropriate

Avoid:

-   Excessive motion
-   Long blocking animations
-   Animating every element independently
-   Animations that hurt readability or performance

Respect `prefers-reduced-motion`.

------------------------------------------------------------------------

# 23. Performance

## Backend

-   Cache expensive queries.
-   Use eager loading.
-   Use pagination.
-   Optimize indexes.
-   Queue expensive operations.
-   Avoid unnecessary API/database calls.

## Frontend

-   Lazy-load heavy components.
-   Optimize images.
-   Code split route-level pages where useful.
-   Avoid unnecessary re-renders.
-   Remove unused dependencies.
-   Keep bundles reasonable.

## Production

Use appropriate Laravel caching/optimization commands and build
production assets.

------------------------------------------------------------------------

# 24. Error Handling

Provide consistent handling for:

``` text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
419 Session Expired
422 Validation Error
429 Too Many Requests
500 Server Error
```

Public users should receive friendly error pages.

Do not expose:

-   Stack traces
-   SQL queries
-   Secrets
-   Internal paths
-   Sensitive server information

in production.

------------------------------------------------------------------------

# 25. Logging

Log important events such as:

-   Authentication events
-   Critical administrative actions
-   Failed integrations
-   Payment-related events where applicable
-   Important content changes
-   System exceptions

Never log:

-   Passwords
-   API secrets
-   Tokens
-   Sensitive personal data unnecessarily

------------------------------------------------------------------------

# 26. Security

Minimum requirements:

-   CSRF protection
-   XSS protection
-   SQL injection protection through parameterized/Eloquent queries
-   Authentication protection
-   Authorization checks
-   Rate limiting
-   Secure password handling
-   Secure file uploads
-   Environment secrets outside source control
-   HTTPS in production
-   Appropriate security headers

Never trust client-side authorization.

------------------------------------------------------------------------

# 27. API & External Integrations

External services may include:

-   Maps
-   Email
-   SMS
-   Payment gateways
-   Storage
-   Analytics
-   Social platforms
-   AI services
-   Third-party APIs

Use dedicated service classes for integrations.

Recommended:

``` text
app/
└── Integrations/
    ├── Contracts/
    ├── Services/
    ├── DTOs/
    └── Exceptions/
```

Do not scatter third-party API calls across controllers or React
components.

------------------------------------------------------------------------

# 28. Queues & Background Jobs

Use queues for operations that do not need to block the HTTP request,
such as:

-   Email delivery
-   Large media processing
-   Notifications
-   Report generation
-   External synchronization
-   Heavy imports/exports

Jobs should be:

-   Idempotent where possible
-   Retryable
-   Observable
-   Properly logged
-   Designed with failure handling

------------------------------------------------------------------------

# 29. Caching

Possible cache layers:

``` text
Application Cache
Database Query Cache
HTTP/Response Cache
Frontend Cache
CDN Cache
```

Rules:

-   Cache stable/expensive data.
-   Define clear invalidation rules.
-   Do not cache user-specific data incorrectly.
-   Avoid caching everything by default.

------------------------------------------------------------------------

------------------------------------------------------------------------

# 24. Data Structures, Algorithms & Scalability Rules

This section defines mandatory engineering practices for choosing data
structures, algorithms, database access patterns, and runtime
strategies. The goal is to keep the application predictable and
performant as traffic, data volume, and concurrent users grow.

## 24.1 General Data-Structure Rules

Choose data structures based on the operation that is performed most
often, not simply because a structure is familiar.

### Preferred principles

-   Use arrays/lists for ordered collections and sequential iteration.
-   Use associative arrays/maps for key-based lookup.
-   Use sets where uniqueness and membership checks are the primary
    operation.
-   Use queues for FIFO background work.
-   Use stacks only where LIFO behavior is actually required.
-   Use Laravel Collections for readable in-memory transformations, but
    do not load large database datasets into memory just to use
    Collection methods.
-   Use generators, `LazyCollection`, `chunkById()`, or cursor-based
    iteration for large datasets.
-   Avoid nested loops over large collections when a map/set or database
    query can reduce the complexity.
-   Avoid repeatedly searching an array when a keyed lookup structure
    can make the operation O(1) on average.
-   Do not serialize unnecessarily large objects into sessions, cache,
    jobs, or API responses.

### Example

Bad pattern:

``` php
foreach ($users as $user) {
    foreach ($roles as $role) {
        if ($user->role_id === $role->id) {
            // ...
        }
    }
}
```

Prefer creating an indexed lookup once:

``` php
$rolesById = $roles->keyBy('id');

foreach ($users as $user) {
    $role = $rolesById->get($user->role_id);
}
```

The exact implementation may differ, but the rule is to avoid avoidable
O(n × m) work.

## 24.2 Algorithm Selection

Before implementing non-trivial logic, consider:

1.  Input size.
2.  Expected frequency of execution.
3.  Time complexity.
4.  Space complexity.
5.  Whether the database can perform the operation more efficiently.
6.  Whether the result can be cached.
7.  Whether the work should be asynchronous.

### Complexity guidance

Prefer, where practical:

-   O(1) lookup
-   O(log n) lookup/search where appropriate
-   O(n) single-pass processing

Avoid O(n²), O(n³), or repeated full scans for large datasets unless the
dataset is demonstrably small and the trade-off is intentional.

Do not optimize for theoretical complexity at the expense of clarity
when the real dataset is small. Measure before introducing complicated
algorithms.

## 24.3 Database as a Data-Processing Engine

Do not fetch thousands of rows into PHP merely to filter, sort, count,
group, or aggregate them when MySQL can perform the operation
efficiently.

Prefer:

``` php
User::query()
    ->where('status', 'active')
    ->count();
```

over:

``` php
User::query()->get()->filter(...)->count();
```

Prefer database-side:

-   `WHERE`
-   `JOIN`
-   `EXISTS`
-   `COUNT`
-   `SUM`
-   `AVG`
-   `MIN`
-   `MAX`
-   `GROUP BY`
-   appropriate `ORDER BY`
-   indexed search conditions

Use application-side processing when the operation genuinely requires
business logic that cannot efficiently be expressed in the database.

## 24.4 Database Indexing Rules

Every important query path must be evaluated for indexing.

Add indexes for:

-   Foreign keys.
-   Frequently filtered columns.
-   Frequently sorted columns when beneficial.
-   Unique identifiers.
-   Slugs and other lookup keys.
-   Status/type columns when they participate in selective queries.
-   Composite query patterns.

Use composite indexes based on actual query patterns.

Example:

``` sql
INDEX (tenant_id, status, created_at)
```

is appropriate only when the application frequently queries those
columns together in a compatible order.

Rules:

-   Do not blindly index every column.
-   Avoid redundant indexes.
-   Consider index selectivity.
-   Check query plans for expensive queries.
-   Use `EXPLAIN` for important or suspicious queries.
-   Review indexes after major schema/query changes.
-   Remember that indexes improve reads but add write/storage overhead.

## 24.5 Query Efficiency Rules

Mandatory:

-   No N+1 queries.
-   Never use `SELECT *` when a smaller projection is sufficient for a
    performance-sensitive query.
-   Select only required columns for large/list queries.
-   Use eager loading intentionally.
-   Avoid eager loading huge relationships when the page needs only a
    count or existence check.
-   Use `withCount()`, `withExists()`, or aggregates where appropriate.
-   Use pagination for user-facing lists.
-   Use cursor pagination for very large or continuously changing
    datasets where suitable.
-   Use `chunkById()` for large batch updates/processing.
-   Avoid offset pagination for extremely large datasets when cursor
    pagination is more appropriate.
-   Never run unbounded queries such as `Model::all()` in request paths
    where the table can grow substantially.
-   Avoid queries inside loops; batch or prefetch data instead.

## 24.6 Pagination Rules

All potentially large public/admin lists must be paginated.

Default principles:

-   Never return an unbounded collection from an HTTP endpoint.
-   Set a reasonable maximum page size.
-   Never trust a client-provided `per_page` value without applying a
    server maximum.
-   Prefer cursor pagination for very large datasets and infinite-scroll
    style interfaces.
-   Use normal pagination where numbered pages and total counts are
    useful.

Example:

``` php
$records = $repository->paginate(
    perPage: min((int) $request->integer('per_page', 20), 100)
);
```

The exact maximum should be configured according to the project.

## 24.7 Large Dataset Processing

Large operations must not block normal HTTP requests.

Use:

-   Queued Jobs
-   Batches
-   `chunkById()`
-   `LazyCollection`
-   streaming where appropriate
-   scheduled commands
-   database-side bulk operations

Examples:

-   CSV imports
-   report generation
-   mass notifications
-   image/video processing
-   exports
-   search indexing
-   cleanup tasks
-   large data migrations

Do not process millions of records synchronously inside a web request.

## 24.8 Transactions & Concurrency

Use database transactions whenever multiple writes must succeed or fail
as one business operation.

``` php
DB::transaction(function () use ($dto) {
    // related writes
});
```

For concurrent operations, consider:

-   Atomic database updates.
-   Unique constraints.
-   Optimistic locking where appropriate.
-   Pessimistic locking (`lockForUpdate()`) for critical
    read-modify-write workflows.
-   Idempotency keys for retryable operations.
-   Atomic Redis operations where appropriate.

Never rely only on application-level checks for uniqueness or
race-sensitive business rules. Enforce critical invariants at the
database level too.

## 24.9 HTTP Request Performance Rules

A normal HTTP request should perform the minimum amount of work required
to produce the response.

Avoid inside request/response cycles:

-   Large file processing.
-   Long-running API calls when asynchronous processing is possible.
-   Large exports.
-   Expensive report generation.
-   Sending thousands of emails synchronously.
-   Rebuilding large caches unnecessarily.
-   Loading unrelated database records.

Move such work to queues/jobs.

## 24.10 Caching Rules

Use caching for expensive, frequently requested, relatively stable data.

Possible layers:

1.  Browser/CDN cache.
2.  Reverse proxy/cache where applicable.
3.  Laravel application cache.
4.  Redis.
5.  Database/query optimization.

Rules:

-   Cache expensive reads only after identifying the expensive
    operation.
-   Define explicit TTLs.
-   Use predictable cache keys.
-   Include tenant/user/locale/version context in cache keys where
    required.
-   Invalidate or version cache entries when source data changes.
-   Prevent cache stampedes for high-traffic keys.
-   Never cache private data under a shared/public key.
-   Do not cache every query by default.

Example cache-key pattern:

``` text
project:{project_id}:page:{page}:locale:{locale}:version:{version}
```

## 24.11 Cache Stampede Protection

When many requests simultaneously need an expired expensive cache value,
do not allow every request to rebuild it.

Use appropriate locking or stale-while-revalidate strategies.

Conceptually:

``` text
Request
  |
  +-- Cache hit ----------> Return cached value
  |
  +-- Cache miss
        |
        +-- Acquire lock
        |     |
        |     +-- Build once
        |     +-- Store cache
        |
        +-- Other requests wait briefly / use stale value
```

Laravel's cache locking facilities may be used where appropriate.

## 24.12 Redis Usage Rules

Redis may be used for:

-   Cache
-   Sessions
-   Queues
-   Rate limiting
-   Distributed locks
-   Short-lived counters
-   Temporary coordination state

Do not treat Redis as the primary permanent database unless the project
explicitly requires that architecture.

Avoid storing large, long-lived payloads in Redis without a clear memory
strategy.

## 24.13 Queue & Worker Rules

Use queues for work that is:

-   slow
-   retryable
-   independent of the immediate response
-   CPU/I/O intensive
-   externally dependent

Queue design must include:

-   retries
-   backoff
-   timeout
-   failure handling
-   idempotency
-   dead-letter/failure inspection
-   appropriate worker concurrency

Do not blindly increase worker count. Worker concurrency must be sized
according to CPU, memory, database capacity, external API limits, and
job duration.

## 24.14 Rate Limiting & Abuse Protection

Public and sensitive endpoints must have appropriate rate limits.

Apply stronger protection to:

-   Login
-   Registration
-   Password reset
-   OTP
-   Search endpoints vulnerable to expensive queries
-   File uploads
-   Contact/forms
-   API endpoints
-   Admin actions
-   External-integration callbacks

Rate limits should be based on the actual risk and endpoint cost.

Use Redis-backed rate limiting in distributed deployments when
appropriate.

## 24.15 10,000+ Request Resilience

The application must be designed so that traffic spikes do not make the
entire website collapse.

**Important:** "10,000 requests" is not a guarantee that one server can
handle 10,000 requests per second. Capacity depends on request
complexity, database workload, payload size, PHP workers, CPU, RAM,
network, cache hit rate, and external services.

The architecture must therefore support horizontal scaling.

Recommended production flow:

``` text
                     ┌───────────────┐
                     │   CDN / WAF   │
                     └───────┬───────┘
                             │
                     ┌───────▼───────┐
                     │ Load Balancer │
                     └───────┬───────┘
                             │
               ┌─────────────┼─────────────┐
               ▼             ▼             ▼
          App Server 1  App Server 2  App Server N
               │             │             │
               └─────────────┼─────────────┘
                             │
                     ┌───────▼───────┐
                     │ Redis Cluster │
                     │ Cache/Queue   │
                     └───────┬───────┘
                             │
                     ┌───────▼───────┐
                     │ MySQL Primary │
                     └───────┬───────┘
                             │
                  ┌──────────▼──────────┐
                  │ Read Replicas*      │
                  └─────────────────────┘

* Use only when read scaling is actually required.
```

The application must remain as stateless as practical so multiple
application servers can serve requests interchangeably.

Mandatory principles for high-traffic readiness:

-   Keep session state in a shared store such as Redis/database when
    multiple app servers are used.
-   Do not store important runtime state only on local server memory.
-   Do not depend on local server filesystem for persistent shared data.
-   Store user uploads in shared/object storage when horizontal scaling
    requires it.
-   Use a load balancer for multiple application instances.
-   Put static assets behind a CDN where appropriate.
-   Use Redis for shared cache/rate-limit/queue coordination where
    appropriate.
-   Keep database connections bounded.
-   Optimize expensive database queries before adding more application
    servers.
-   Queue non-critical expensive work.
-   Apply endpoint-specific rate limits.
-   Protect expensive endpoints from request amplification.
-   Set request, connection, and upstream timeouts.
-   Use health checks so unhealthy application instances are removed
    from the load balancer.
-   Use graceful deployment/restart strategies.
-   Monitor CPU, RAM, PHP worker saturation, Redis memory, database CPU,
    connections, slow queries, queue depth, response time, error rate,
    and throughput.

## 24.16 PHP Worker / Runtime Rules

For PHP-FPM:

-   Size `pm.max_children` according to available RAM and measured
    worker memory usage.
-   Do not choose worker counts arbitrarily.
-   Monitor worker saturation and queueing.
-   Keep application requests short.
-   Move long work to queues.

Laravel Octane may be considered for workloads that benefit from
persistent application workers, but only after verifying compatibility
and memory behavior.

If Octane is used:

-   Avoid leaking request-specific state between requests.
-   Do not keep mutable request/user data in static properties or
    singleton state.
-   Reset or avoid stateful services that are unsafe in long-lived
    workers.
-   Load testing is mandatory before production use.

## 24.17 Database Connection Protection

The database is often the first bottleneck during traffic spikes.

Rules:

-   Keep queries fast and indexed.
-   Avoid unnecessary database calls.
-   Avoid opening multiple redundant connections per request.
-   Configure sensible connection limits.
-   Monitor active connections.
-   Use connection pooling/proxying only when the infrastructure and
    workload justify it.
-   Never solve a database bottleneck simply by allowing unlimited
    connections.
-   Use read replicas only for suitable read-heavy workloads.
-   Keep writes directed to the authoritative database.
-   Verify consistency requirements before introducing read/write
    splitting.

## 24.18 API & External Service Resilience

External APIs must never be allowed to take down the application.

For external calls:

-   Set connection and request timeouts.
-   Use bounded retries.
-   Use exponential backoff with jitter where appropriate.
-   Do not retry non-idempotent operations blindly.
-   Use circuit-breaker/failure-isolation patterns where appropriate.
-   Queue operations that do not need an immediate response.
-   Cache stable external data where safe.
-   Log failures with correlation/request identifiers.
-   Handle partial failure gracefully.

## 24.19 Request Amplification Protection

A single HTTP request must not accidentally trigger hundreds or
thousands of database/API operations.

Examples of dangerous patterns:

-   Looping through 1,000 users and calling an external API for each.
-   Rendering a list that triggers N+1 queries.
-   Loading a large relationship graph for every request.
-   Allowing arbitrary nested filters that generate extremely expensive
    SQL.
-   Accepting unlimited export sizes.

Prefer batching, queues, pagination, aggregates, eager loading, limits,
and precomputed data.

## 24.20 Search & Filtering Rules

Search endpoints must be designed for scale.

Rules:

-   Index searchable columns appropriately.
-   Normalize/filter input before querying.
-   Apply maximum result limits.
-   Avoid `%term%` scans on huge tables unless the database/search
    strategy is designed for it.
-   Consider full-text indexes or a dedicated search engine for
    large-scale search.
-   Debounce client-side live search.
-   Cache popular, safe search results when appropriate.
-   Never allow arbitrary client-controlled SQL/order expressions.

## 24.21 File Upload & Media Processing

File uploads must be protected from resource exhaustion.

Rules:

-   Validate MIME type and extension.
-   Enforce file-size limits.
-   Generate safe filenames.
-   Store uploads outside executable paths.
-   Prefer object/shared storage for horizontally scaled deployments.
-   Process large images/videos asynchronously.
-   Generate thumbnails asynchronously when appropriate.
-   Do not process large media synchronously inside a normal request.
-   Use streaming for large file operations where appropriate.

## 24.22 Observability & Capacity Testing

Performance cannot be guaranteed by architecture alone. Measure it.

Production monitoring should include at minimum:

-   Requests per second
-   P50/P95/P99 latency
-   Error rate
-   HTTP status distribution
-   CPU utilization
-   Memory utilization
-   PHP worker utilization
-   Database CPU
-   Database connection count
-   Slow query count/time
-   Redis memory and latency
-   Queue depth
-   Job failure rate
-   External API latency/error rate
-   Cache hit/miss ratio

Before claiming that the application supports a target load, perform
load/stress testing in an environment representative of production.

Test scenarios should include:

1.  Normal traffic.
2.  Traffic spike.
3.  Sustained high traffic.
4.  Slow external dependency.
5.  Database degradation.
6.  Redis degradation/failure.
7.  Queue backlog.
8.  Application instance failure.
9.  Cache cold start.

Use tools such as k6, JMeter, Locust, or an equivalent load-testing tool
where appropriate.

## 24.23 Performance Budget

Each project should define practical performance budgets.

At minimum, track:

-   API/page response latency.
-   Database query count and duration.
-   Frontend JavaScript bundle size.
-   Image payload size.
-   Largest page assets.
-   Core Web Vitals for public pages where applicable.

Performance regressions should be treated as engineering issues, not
only as deployment issues.

## 24.24 Algorithm & Data-Structure Review Checklist

Before merging non-trivial data processing, ask:

-   What is the expected input size?
-   What is the time complexity?
-   What is the space complexity?
-   Can a map/set eliminate repeated searches?
-   Can the database perform the operation more efficiently?
-   Can the operation be batched?
-   Can it be cached?
-   Should it be queued?
-   Is pagination required?
-   Could concurrent requests execute this operation simultaneously?
-   Is the operation idempotent?
-   What happens during a traffic spike?
-   What happens if the database/cache/external API is slow?

------------------------------------------------------------------------

# 25. High-Traffic Non-Negotiable Rules

The following rules are mandatory for production applications expected
to handle significant traffic:

-   Never assume a single server can handle arbitrary traffic.
-   Never use unbounded database queries in HTTP requests.
-   Never allow uncontrolled `per_page`, export size, or batch size.
-   Never perform large synchronous jobs inside web requests.
-   Never create N+1 database queries.
-   Never use an algorithm with avoidable O(n²)+ complexity on large
    datasets.
-   Never rely exclusively on application-level uniqueness checks.
-   Never expose expensive endpoints without limits/rate limiting.
-   Never let an external API call have an unlimited timeout.
-   Never store critical shared state only in local process memory.
-   Never depend on local filesystem persistence when horizontal scaling
    is required.
-   Always monitor the actual bottleneck before scaling a component.
-   Always load-test before making a capacity claim.
-   Prefer graceful degradation over total application failure.

------------------------------------------------------------------------

# 30. Testing

Testing strategy should match project complexity.

Possible tools:

-   PHPUnit
-   Pest
-   React Testing Library
-   Browser/E2E testing framework

Minimum focus:

``` text
Unit Tests
Feature Tests
Integration Tests
Critical E2E Tests
```

Prioritize testing:

-   Authentication
-   Authorization
-   Important business logic
-   Critical CRUD operations
-   Important forms
-   External integrations
-   Critical public user flows

Do not chase a coverage percentage blindly; prioritize meaningful
behavior.

------------------------------------------------------------------------

# 31. Git Rules

Recommended branches:

``` text
main
develop
feature/*
bugfix/*
release/*
```

Use Conventional Commits where appropriate:

``` text
feat:
fix:
refactor:
docs:
test:
chore:
perf:
```

Example:

``` text
feat(cms): add dynamic homepage sections
```

Do not commit:

``` text
.env
API secrets
private credentials
generated sensitive files
```

------------------------------------------------------------------------

# 32. AI Coding Session Rules

This master file is specifically designed to keep separate AI coding
sessions consistent.

Every AI coding session must:

1.  Read this file before modifying architecture.
2.  Inspect existing code before creating new files.
3.  Reuse existing components/services/repositories where appropriate.
4.  Follow the established folder structure.
5.  Avoid creating duplicate components.
6.  Avoid changing architecture without a clear reason.
7.  Avoid changing unrelated files.
8.  Preserve existing functionality.
9.  Use existing naming conventions.
10. Update types when changing data contracts.
11. Add/update tests for meaningful behavior changes.
12. Run relevant tests/lint/build checks before considering work
    complete.
13. Never silently replace an existing architectural pattern with
    another.
14. Ask for clarification only when a requirement genuinely cannot be
    inferred from the project.

### AI Non-Negotiable Rule

**Do not invent a new architecture simply because another architecture
may be preferred. Follow the architecture already established by this
document and the existing codebase.**

------------------------------------------------------------------------

# 33. Code Quality Rules

## PHP

-   PSR-12
-   Strict typing where appropriate
-   Return types
-   Parameter types
-   Meaningful names
-   Small focused methods
-   PHPDoc where useful

## TypeScript

-   `strict: true`
-   No unnecessary `any`
-   Explicit interfaces/types
-   Avoid duplicated types
-   Prefer type-safe API contracts
-   Meaningful component and variable names

## React

-   Functional components
-   Hooks
-   Small focused components
-   Avoid unnecessary effects
-   Avoid prop drilling where Context or composition is more appropriate
-   Keep server state and UI state conceptually separate

------------------------------------------------------------------------

# 34. Naming Rules

Use descriptive names.

Prefer:

``` text
ProjectCard
ProjectService
ProjectRepository
CreateProjectRequest
CreateProjectDTO
ProjectResource
```

Avoid:

``` text
Data
Helper2
Temp
TestComponent
NewCard
FinalComponent
```

Do not use vague names when a domain-specific name is clearer.

------------------------------------------------------------------------

# 35. File & Folder Rules

A recommended Laravel + React structure:

``` text
app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Resources/
├── Models/
├── Repositories/
│   ├── Contracts/
│   └── Eloquent/
├── Services/
├── DTOs/
├── Enums/
├── Exceptions/
├── Policies/
└── Integrations/

database/
├── migrations/
├── factories/
└── seeders/

resources/
├── css/
├── js/
│   ├── Pages/
│   ├── Components/
│   ├── Layouts/
│   ├── hooks/
│   ├── contexts/
│   ├── types/
│   ├── lib/
│   └── utils/
└── views/

routes/
├── web.php
├── api.php
└── console.php

tests/
├── Unit/
├── Feature/
└── Browser/
```

Adapt this structure only when project complexity requires it.

------------------------------------------------------------------------

# 36. Routing

Keep route definitions readable.

Group routes by responsibility:

``` text
Public
Authentication
Admin
API
```

Use named routes.

Use middleware for:

-   Authentication
-   Authorization
-   Verification
-   Rate limiting
-   Tenant/context selection when applicable

Do not put business logic in route closures for production features.

------------------------------------------------------------------------

# 37. Inertia Rules

Use Inertia as the bridge between Laravel and React.

Rules:

-   Keep server-side authorization authoritative.
-   Use shared props only for genuinely shared data.
-   Avoid sending unnecessary database data to every page.
-   Use lazy/deferred props where beneficial.
-   Keep page props typed.
-   Use partial reloads when appropriate.
-   Use route-level code splitting/lazy loading where beneficial.

------------------------------------------------------------------------

# 38. Shared Data

Shared Inertia data may include:

``` text
Authenticated User
Flash Messages
Navigation Data
Site Identity
Theme
Typography
Permissions
Locale
```

Do not share large datasets globally.

------------------------------------------------------------------------

# 39. Forms

Forms should provide:

-   Clear labels
-   Validation
-   Loading state
-   Success feedback
-   Error feedback
-   Disabled state during submission
-   Accessible field messages

For server-backed forms, Laravel validation remains authoritative.

------------------------------------------------------------------------

# 40. Empty / Loading / Error States

Every data-driven UI should consider:

``` text
Loading
Empty
Error
Success
```

Do not leave blank screens when data is unavailable.

------------------------------------------------------------------------

# 41. Pagination, Filtering & Search

For large datasets:

-   Use server-side pagination.
-   Use query parameters for shareable filters where appropriate.
-   Validate filter values.
-   Index frequently searched/filter columns.
-   Avoid loading unnecessary records.

Do not implement manual array slicing for database pagination.

------------------------------------------------------------------------

# 42. Admin Panel Design — User-Friendly & Centralized

The admin panel is an internal power tool. Its design must prioritize
clarity, speed, and confidence for the operator. A confusing admin
interface leads to data-entry errors, wasted time, and frustrated
administrators.

**Core principle:** Every admin user should be able to find anything they
need in three clicks or fewer.

------------------------------------------------------------------------

## 42.1 Admin Layout Structure

Use a dedicated, fully separate layout from the public website.

``` text
AdminLayout
├── Sidebar (fixed, collapsible)
│   ├── Logo / Brand Mark
│   ├── Navigation Groups
│   │   ├── Group Label
│   │   └── Nav Items (icon + label)
│   └── Bottom: User Profile + Logout
├── TopBar / Header
│   ├── Mobile Hamburger (small screens)
│   ├── Page Title / Breadcrumb
│   ├── Search (global, optional)
│   ├── Notifications Bell
│   └── User Avatar + Quick Actions
├── Main Content Area
│   ├── Page Header (title + primary action button)
│   ├── Filter / Search Bar (if applicable)
│   ├── Content (Table / Form / Cards / Stats)
│   └── Pagination (if applicable)
└── Toast / Alert Container (top-right)
```

The sidebar must be the single navigation truth. Do not scatter admin
navigation across multiple locations.

------------------------------------------------------------------------

## 42.2 Sidebar Navigation Rules

The sidebar is the primary navigation hub. It must be:

-   **Always visible** on desktop (fixed position, not hidden behind a
    menu).
-   **Collapsible** to icon-only mode on smaller desktop screens to
    maximize content space.
-   **Slide-in drawer** on mobile/tablet screens.
-   **Grouped logically** — related items must be under the same group
    label.
-   **Active state clearly marked** — the current page item must be
    visually distinct (filled background, accent color, bold text).
-   **Hover state animated** — subtle background transition on hover.

### Navigation Grouping

Group sidebar items by domain responsibility, not arbitrarily:

``` text
── Overview ───────────────
  Dashboard

── Content Management ─────
  Pages / Sections
  Blog / News
  Gallery
  Media Library

── Catalog / Domain ───────
  [Domain-specific entities]

── People ─────────────────
  Users
  Roles & Permissions
  Inquiries / Leads

── Configuration ──────────
  Site Settings
  SEO Defaults
  Theme & Colors
  Navigation Menus
  Social Links

── System ─────────────────
  Activity Logs
  Cache Management
```

Actual groups depend on the project domain. Do not copy this list
verbatim — adapt it.

### Sidebar Icon Rules

-   Every nav item must have a distinct, recognizable icon.
-   Use a consistent icon library (e.g., Lucide, Heroicons) — never mix
    icon styles.
-   In collapsed mode, show only icons with a tooltip on hover.
-   Icons must match the semantic meaning of the section.

------------------------------------------------------------------------

## 42.3 Dashboard Design

The dashboard is the admin home screen. It must provide an
**at-a-glance status view** of the most important metrics and recent
activity.

### Dashboard Layout Pattern

``` text
┌────────────────────────────────────────────────────────────┐
│  Welcome, [Name]             Today: [Date]  Quick Actions  │
├──────────┬──────────┬──────────┬──────────────────────────┤
│ Stat Card│ Stat Card│ Stat Card│       Stat Card           │
├──────────┴──────────┴──────────┴──────────────────────────┤
│  Recent Activity / Alerts         Quick Access Shortcuts   │
├───────────────────────────────────┬────────────────────────┤
│  Recent [Domain] List (5–10 rows) │  Summary Chart/Graph   │
└───────────────────────────────────┴────────────────────────┘
```

### Stat Cards

Each stat card must show:

-   A descriptive label (e.g., "Total Properties", "Active Listings")
-   A large numeric value
-   A trend indicator where relevant (e.g., "+12 this week")
-   A relevant icon
-   A link to the full list/module

Avoid generic stat cards with no actionable link.

### Dashboard Rules

-   Show only data relevant to the admin's role.
-   Do not overload the dashboard with more than 6–8 stat cards.
-   Provide "Quick Action" shortcuts for the most frequent tasks
    (e.g., "Add New Property", "View Pending Inquiries").
-   Recent activity should show the last 5–10 relevant items with
    timestamps.
-   Refresh-sensitive data (counts, inquiries) should indicate when it
    was last loaded.

------------------------------------------------------------------------

## 42.4 List / Index Pages

Every admin module's list page must follow a consistent pattern.

### Standard List Page Layout

``` text
┌──────────────────────────────────────────────────────────┐
│ Page Title                          [+ Add New Button]   │
├──────────────────────────────────────────────────────────┤
│ [ Search Input ]  [ Filter: Status ▼ ] [ Filter: Type ▼ ]│
├──────────────────────────────────────────────────────────┤
│ Table                                                     │
│  ┌────┬────────────┬──────────┬────────┬───────────────┐ │
│  │ #  │ Name/Title │ Status   │ Date   │ Actions       │ │
│  ├────┼────────────┼──────────┼────────┼───────────────┤ │
│  │ 1  │ Example    │ Active   │ Jan 1  │ Edit  Delete  │ │
│  └────┴────────────┴──────────┴────────┴───────────────┘ │
├──────────────────────────────────────────────────────────┤
│ Showing 1–20 of 84 results          [← 1 2 3 4 5 →]     │
└──────────────────────────────────────────────────────────┘
```

### Table Rules

-   Column headers must be sortable for important columns (Name, Date,
    Status).
-   Sort direction must be visually indicated (↑ / ↓).
-   Each row must have an **Actions** column with Edit and Delete (or
    relevant actions) clearly visible.
-   Destructive actions (Delete) must use a **distinct visual style**
    (e.g., red color, outlined button).
-   All destructive actions must trigger a **confirmation dialog** before
    executing.
-   Status columns must use consistent color-coded badges:
    -   Active / Published → Green
    -   Draft / Inactive → Gray
    -   Pending → Yellow/Orange
    -   Rejected / Archived → Red
-   Empty state must show a helpful message and a "Create your first X"
    call-to-action, not a blank table.
-   Loading state must show a skeleton loader, not a blank page.
-   On mobile, tables should collapse gracefully (hide less-critical
    columns or switch to card-based layout).

### Filter & Search Rules

-   Search input must be placed prominently above the table.
-   Filters must be clearly labeled dropdowns/selects.
-   Active filters must be visually indicated (e.g., a count badge or
    highlighted filter chip).
-   A "Clear Filters" option must be available when any filter is
    active.
-   Filter state should be preserved in URL query parameters for
    shareability and browser back-navigation.

------------------------------------------------------------------------

## 42.5 Create & Edit Form Pages

Forms are where most admin errors occur. Design must minimize
cognitive load.

### Standard Form Layout

``` text
┌───────────────────────────────────────────────────────────┐
│  ← Back to [Module List]                                  │
│  Edit [Item Name]                                         │
├──────────────────────────────────┬────────────────────────┤
│  Main Form (Left / Full Width)   │  Sidebar Metadata      │
│                                  │  ┌──────────────────┐  │
│  ┌──────────────────────────┐    │  │ Status           │  │
│  │ Section: Basic Info      │    │  │ ○ Draft          │  │
│  │  Title *                 │    │  │ ● Published      │  │
│  │  [ Input Field        ]  │    │  └──────────────────┘  │
│  │                          │    │  ┌──────────────────┐  │
│  │  Description             │    │  │ Timestamps       │  │
│  │  [ Rich Text Editor   ]  │    │  │ Created: Jan 1   │  │
│  └──────────────────────────┘    │  │ Updated: Jan 5   │  │
│                                  │  └──────────────────┘  │
│  ┌──────────────────────────┐    │                        │
│  │ Section: Media           │    │  [Save Draft]          │
│  │  [ Image Upload Zone  ]  │    │  [Publish / Save]      │
│  └──────────────────────────┘    │                        │
└──────────────────────────────────┴────────────────────────┘
```

### Form Design Rules

-   **Section grouping is mandatory.** Related fields must be grouped
    under a labeled section with a visual separator. Do not present a
    long flat list of fields.
-   **Required fields** must be marked with a clear asterisk (*) and
    a legend explaining the convention.
-   **Labels** must always appear above their input, never as
    placeholder-only (placeholders vanish when typing).
-   **Helper text** must appear below the input when additional context
    is needed (e.g., "Slug is auto-generated from the title. You can
    override it.").
-   **Validation errors** must appear inline below the specific field
    in red, not only as a top-level alert.
-   **Loading state** must disable the submit button and show a spinner
    during submission. Never allow double-submission.
-   **Unsaved changes warning** must appear if the user tries to
    navigate away from a form with unsaved changes.
-   **Character count** must appear for fields with a defined maximum
    length (e.g., SEO meta description: 160 characters).
-   **Confirmation on delete** must be a modal dialog requiring the user
    to consciously confirm before irreversible action.
-   The primary save action (Save / Publish) must be **always visible**
    — sticky in the sidebar or footer of the form.

### Input Field Standards

| Field Type        | Component           | Rules                                |
|-------------------|---------------------|--------------------------------------|
| Short text        | Input               | Always show label above              |
| Long text         | Textarea            | Resize-Y allowed                     |
| Rich text         | TipTap / equivalent | Sanitized HTML output                |
| Boolean toggle    | Toggle/Switch       | Show current state label             |
| Single select     | Select / Combobox   | Searchable if > 8 options            |
| Multi select      | Multi-select        | Show selected count badge            |
| Date / Time       | Date picker         | Consistent format display            |
| File / Image      | Drop zone + preview | Show preview after selection         |
| Color             | Color picker        | Show hex value, validate input       |
| Number            | Number Input        | Min/Max/Step specified               |
| Slug / URL        | Input + preview     | Show full generated URL below field  |
| Relation select   | Searchable select   | Load options lazily for large sets   |
| Ordering/Sort     | Drag-and-drop list  | Visual handle indicator              |

------------------------------------------------------------------------

## 42.6 Confirmation Dialogs

Never execute a destructive or irreversible action without explicit
user confirmation.

### Confirmation Dialog Rules

-   Show a modal (not a browser `confirm()`) for all destructive actions.
-   Modal must state **what** will be deleted/affected, not just "Are
    you sure?".
-   Destructive button must be visually distinct (red/danger styled).
-   Cancel button must be the visually primary/default action (focused
    by keyboard).
-   Pressing Escape must close the dialog and cancel the action.
-   For highly destructive actions (e.g., bulk delete, permanent
    removal), require the user to **type the item name or "DELETE"** to
    confirm.

Example modal text:

``` text
Delete "Riverside Apartment"?

This will permanently remove the property listing, all associated
images, and related inquiries. This action cannot be undone.

[ Cancel ]   [ Delete Permanently ]
```

------------------------------------------------------------------------

## 42.7 Toast Notifications & Feedback

Every admin action must produce immediate, clear feedback.

### Notification Rules

-   **Success** (green) — confirm the action completed.
-   **Error** (red) — explain what went wrong clearly.
-   **Warning** (yellow/orange) — alert of partial success or potential
    issue.
-   **Info** (blue) — neutral contextual information.

Toasts must:

-   Appear consistently in one location (top-right recommended).
-   Auto-dismiss after 3–5 seconds for success/info messages.
-   **Not** auto-dismiss for errors — require manual dismiss.
-   Include the action context (e.g., "Property 'Riverside' published
    successfully.").
-   Be dismissable with an × button.
-   Stack vertically if multiple notifications fire in sequence.
-   Never block the interface behind a full-screen overlay for a simple
    success message.

------------------------------------------------------------------------

## 42.8 Breadcrumbs & Wayfinding

The admin user must always know where they are.

-   Every page must show a breadcrumb trail from Dashboard down to the
    current page.
-   Every page must have a clear H1 page title.
-   The active sidebar item must visually indicate the current section.
-   "Back to list" navigation must always be available on detail/edit
    pages.

``` text
Dashboard > Properties > Edit: Riverside Apartment
```

------------------------------------------------------------------------

## 42.9 Admin Modules Standard

Every admin module (CRUD entity) should follow the same pattern:

``` text
/admin/{module}            → Index (list)
/admin/{module}/create     → Create form
/admin/{module}/{id}/edit  → Edit form
/admin/{module}/{id}       → Show (optional, if detail view needed)
```

All modules must use named routes.

Consistent module behavior:

-   List → sortable, filterable, paginated table
-   Create → validated form with inline errors
-   Edit → same form pre-populated with existing data
-   Delete → confirmation modal, inline row action
-   Status toggle → one-click toggle (Active/Inactive) without
    navigating to the edit page

------------------------------------------------------------------------

## 42.10 Admin Role Awareness

The admin panel must respect the authenticated user's role and
permissions.

-   Do not show navigation items the user cannot access.
-   Do not show action buttons (Edit, Delete, Publish) the user is
    not authorized to use.
-   Authorization must be enforced server-side regardless of UI
    visibility.
-   Unauthorized access attempts must return a 403 response with a
    friendly admin error page.

------------------------------------------------------------------------

## 42.11 Admin Search (Global)

For admin panels with many modules, a global search is a major
productivity feature.

If implemented:

-   Place a search input in the top bar.
-   Search results should span multiple entity types (e.g., Properties,
    Users, Inquiries).
-   Results should show entity type label + title + status.
-   Clicking a result should navigate directly to the edit page.
-   Keyboard shortcut (e.g., Ctrl+K / Cmd+K) must open global search.

------------------------------------------------------------------------

## 42.12 Admin Typography & Visual Design

The admin interface must be visually clean and professional.

### Typography

-   Use a clean sans-serif font (e.g., Inter, Geist, DM Sans).
-   Consistent type scale:
    -   Page Title: 24–28px, semibold
    -   Section Heading: 16–18px, semibold
    -   Table Header: 12–13px, uppercase, medium, muted color
    -   Body / Input: 14–15px, regular
    -   Helper / Meta text: 12px, muted color

### Color System

-   Use a neutral gray base for the admin background (e.g., `#F8F9FA`
    or `#F1F5F9` in light mode).
-   Primary accent color for active states, buttons, and links.
-   Danger/destructive color consistently applied to delete actions only.
-   Do not use the same accent color for both neutral info and destructive
    actions — they must be visually distinct.

### Spacing & Density

-   Comfortable density: sufficient padding around inputs and table rows
    for easy interaction without feeling cramped.
-   Consistent 8px grid for spacing increments.
-   Do not compress the UI to fit more on screen — admin usability
    depends on comfortable click targets.

### Dark Mode (Optional)

-   If dark mode is supported, all admin components must respect the
    dark/light mode toggle.
-   Use CSS variables/design tokens — never hardcode light-only colors
    in components.

------------------------------------------------------------------------

## 42.13 Admin Mobile Responsiveness

Admin panels are primarily used on desktop, but should not be unusable
on tablet or mobile.

-   Sidebar becomes a slide-in drawer on tablet/mobile.
-   Tables collapse to card-based or scroll-enabled layouts.
-   All action buttons must remain tappable (minimum 44×44px touch
    target).
-   Forms must remain usable on tablet viewports.
-   Critical admin actions (approve, publish, toggle status) must be
    accessible on mobile.
-   Full complex data-entry forms are acceptable to be desktop-optimized
    but must not overflow or break on tablet.

------------------------------------------------------------------------

## 42.14 Admin Performance

-   Admin list pages must use server-side pagination.
-   Admin forms must not freeze on large rich-text or file inputs.
-   Image previews in forms must show a compressed thumbnail, not the
    full-resolution file.
-   Filter/search queries must be debounced on the client side.
-   Avoid loading all related data eagerly in the admin — lazy-load
    relation pickers where appropriate.

------------------------------------------------------------------------

## 42.15 Typical Admin Modules

The actual modules depend entirely on the project domain. The following
is a reference list of common modules across typical projects:

``` text
── Core ──────────────────────
  Dashboard
  User Management
  Role & Permission Management

── Domain-Specific ───────────
  [Primary Entity CRUD]
  [Secondary Entity CRUD]
  [Domain-specific workflows]

── Content ───────────────────
  Pages / Static Content
  Blog / News / Articles
  Media Library
  Gallery

── Site Configuration ────────
  Site Identity
  Navigation Menus
  Footer Content
  Contact Information
  Social Links
  SEO Defaults

── Appearance ────────────────
  Theme Settings (Colors)
  Typography Settings

── Communication ─────────────
  Inquiries / Leads
  Contact Form Submissions
  Notifications

── System ────────────────────
  Activity / Audit Logs
  Cache Control
  Settings (Key-Value)
```

Do not implement modules that the project does not require. Do not skip
modules that the project does require.

------------------------------------------------------------------------

## 42.16 Admin Non-Negotiable Rules

The following rules are mandatory for every admin panel:

1.  **Never mix public website layout with admin layout.** They must be
    completely separate.
2.  **Every destructive action requires a confirmation dialog.** No
    exceptions.
3.  **Every form action must provide visible success or error feedback.**
4.  **Authorization must be enforced server-side.** Hiding a button in
    the UI is not authorization.
5.  **Every list page must be paginated.** Never load all records.
6.  **The active sidebar item must always be visually highlighted.**
7.  **Inline validation errors must appear per-field,** not only as
    top-level messages.
8.  **Empty states must be informative and include a call-to-action.**
9.  **Global search (if implemented) must use keyboard shortcuts.**
10. **Admin navigation must reach any module within 3 clicks** from the
    dashboard.
11. **Status toggles must be executable directly from the list view**
    without navigating to the full edit form.
12. **The save/publish button must always be visible** without scrolling
    to the bottom of a long form.

------------------------------------------------------------------------

# 43. Content Editing

For rich text:

-   Sanitize HTML
-   Restrict dangerous elements/attributes
-   Store structured content appropriately
-   Render trusted sanitized HTML only
-   Avoid blindly rendering arbitrary user input

------------------------------------------------------------------------

# 44. Environment Configuration

Use `.env` for environment-specific values.

Examples:

``` text
APP_ENV
APP_URL
DB_*
REDIS_*
MAIL_*
STORAGE_*
THIRD_PARTY_API_*
```

Never hardcode secrets in:

-   PHP
-   TypeScript
-   React components
-   Git
-   Database seeders

unless the value is explicitly public and non-sensitive.

------------------------------------------------------------------------

# 45. Deployment

## Local

``` text
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm run dev
```

## Production

Typical flow:

``` text
Pull/Deploy
↓
Install dependencies
↓
Run migrations safely
↓
Build frontend
↓
Cache configuration/routes where appropriate
↓
Restart workers
↓
Verify health
```

Never run destructive database commands such as `migrate:fresh` in
production.

------------------------------------------------------------------------

# 46. Pre-Release Checklist

Before release, verify:

### Functionality

-   All required pages work
-   All forms work
-   CRUD operations work
-   Authentication works
-   Authorization works
-   Uploads work
-   Error states work

### UI

-   Responsive layouts
-   Mobile navigation
-   Loading states
-   Empty states
-   Error states
-   Accessibility basics
-   Dark mode if enabled

### Backend

-   Validation
-   Policies
-   Transactions
-   Query performance
-   N+1 checks
-   Logging
-   Queue processing

### Frontend

-   TypeScript passes
-   ESLint passes
-   Production build passes
-   No unnecessary console logs
-   No broken links

### Security

-   No secrets committed
-   Production debug disabled
-   Rate limits configured where necessary
-   File uploads secured
-   Authorization tested

------------------------------------------------------------------------

# 47. Non-Negotiable Rules

The following rules must always be respected unless this document is
intentionally updated:

1.  **No business logic in Controllers.**
2.  **No complex database queries in Controllers.**
3.  **No unvalidated external input.**
4.  **No client-only authorization.**
5.  **No hardcoded secrets.**
6.  **No unnecessary `any` in TypeScript.**
7.  **No N+1 queries.**
8.  **No destructive production migrations/commands.**
9.  **No duplicate components when an existing reusable component
    fits.**
10. **No architecture changes without a clear requirement.**
11. **No unrelated refactoring during feature work.**
12. **No production `dd()`/`dump()` or debugging output.**
13. **All database schema changes must use migrations.**
14. **All important business behavior must have appropriate tests.**
15. **Existing project conventions take precedence over personal coding
    preferences.**

------------------------------------------------------------------------

# 48. Project-Specific Extension

This file is the **master baseline**.

Each individual project may create an additional file:

``` text
project-rules.md
```

That file should contain only project-specific rules such as:

``` text
Project Name
Business Domain
Required Pages
Required Components
Database Entities
Roles
Permissions
Brand Colors
Fonts
CMS Requirements
Third-Party Integrations
Special Business Rules
Deployment Details
```

Relationship:

``` text
MASTER-RULES.md
      ↓
project-rules.md
      ↓
Existing Codebase
      ↓
Current Feature Requirement
```

When rules conflict:

1.  Current explicit requirement wins for the specific feature.
2.  Project-specific rules win over generic master rules.
3.  Existing architecture should be preserved unless intentionally
    changed.
4.  Security and data-integrity requirements must never be weakened.

------------------------------------------------------------------------

# 49. Final Principle

Build the smallest clean architecture that fully satisfies the project.

Do not:

-   Over-engineer simple features
-   Create abstractions without a real need
-   Duplicate logic
-   Mix unrelated responsibilities
-   Couple the UI unnecessarily to database implementation
-   Turn every section into a generic configurable system

Do:

-   Keep boundaries clear
-   Reuse proven components
-   Keep controllers thin
-   Keep services focused
-   Keep repositories responsible for data access
-   Keep React components composable
-   Keep types accurate
-   Keep database queries efficient
-   Keep public pages accessible and SEO-friendly
-   Keep the codebase understandable for the next developer or AI
    session
