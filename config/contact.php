<?php

declare(strict_types=1);

return [

    'honeypot_enabled' => env('CONTACT_HONEYPOT_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Media Disk
    |--------------------------------------------------------------------------
    |
    | Disk used for contact media (hero background image, Open Graph image,
    | team avatars). The frontend serves these from "/storage/{path}", so the
    | disk must be publicly reachable under that URL: the `public` disk together
    | with `php artisan storage:link`, or an equivalent publicly served disk.
    |
    */

    'media' => [
        'disk' => env('CONTACT_MEDIA_DISK', 'public'),
    ],

    'submission' => [
        'admin_recipients' => array_filter(
            array_map('trim', explode(',', (string) env('CONTACT_ADMIN_EMAILS', ''))),
            static fn (string $email): bool => filter_var($email, FILTER_VALIDATE_EMAIL) !== false,
        ),
        'from' => [
            'address' => env('MAIL_FROM_ADDRESS', 'noreply@example.com'),
            'name' => env('MAIL_FROM_NAME', 'Contact'),
        ],
    ],

];
