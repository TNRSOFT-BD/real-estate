<?php

declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Cloudinary
|--------------------------------------------------------------------------
|
| Credentials are read from the CLOUDINARY_URL environment variable in the
| standard form: cloudinary://<api_key>:<api_secret>@<cloud_name>. Individual
| CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET values
| take precedence when present.
|
*/

$cloudinaryUrl = (string) env('CLOUDINARY_URL', '');
$parts = $cloudinaryUrl !== '' ? parse_url($cloudinaryUrl) : [];

return [
    'cloud_name' => env('CLOUDINARY_CLOUD_NAME', $parts['host'] ?? null),
    'api_key' => env('CLOUDINARY_API_KEY', $parts['user'] ?? null),
    'api_secret' => env('CLOUDINARY_API_SECRET', $parts['pass'] ?? null),

    'folder' => env('CLOUDINARY_FOLDER', 'site/hero'),

    'video_max_kb' => (int) env('CLOUDINARY_VIDEO_MAX_KB', 51200),
];
