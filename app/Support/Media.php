<?php

declare(strict_types=1);

namespace App\Support;

class Media
{
    /**
     * Resolve a stored media path to an absolute URL.
     *
     * Mirrors resources/js/lib/media.ts but always returns an absolute URL so
     * social crawlers (Facebook, X, WhatsApp, ...) accept it.
     */
    public static function absolute(?string $path): ?string
    {
        if ($path === null) {
            return null;
        }

        $path = trim($path);

        if ($path === '') {
            return null;
        }

        if (preg_match('#^https?://#i', $path)) {
            return $path;
        }

        return url('/storage/'.ltrim($path, '/'));
    }
}
