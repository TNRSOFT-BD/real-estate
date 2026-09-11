<?php

declare(strict_types=1);

return [

    'honeypot_enabled' => env('CONTACT_HONEYPOT_ENABLED', true),

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
