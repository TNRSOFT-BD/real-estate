<?php

declare(strict_types=1);

return [
    'media' => [
        'disk' => env('PROJECT_MEDIA_DISK', 'public'),
        'image_max_kb' => 5120,
        'document_max_kb' => 10240,
        'image_mimes' => ['jpeg', 'jpg', 'png', 'webp'],
        'document_mimes' => ['pdf'],
    ],

    'currency' => [
        'code' => env('PROJECT_CURRENCY_CODE', 'BDT'),
        'symbol' => env('PROJECT_CURRENCY_SYMBOL', '৳'),
    ],

    'cache_ttl' => 3600,
];
