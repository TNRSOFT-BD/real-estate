<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Media Disk
    |--------------------------------------------------------------------------
    |
    | Disk used for site-level media such as the homepage hero image. The
    | frontend serves these from "/storage/{path}", so the disk must be
    | publicly reachable: the `public` disk together with
    | `php artisan storage:link`, or an equivalent publicly served disk.
    |
    */

    'media' => [
        'disk' => env('SITE_MEDIA_DISK', 'public'),
    ],

];
