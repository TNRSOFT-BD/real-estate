<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Str;

class GoogleMapsUrl implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (blank($value)) {
            return;
        }

        $url = (string) $value;
        $scheme = parse_url($url, PHP_URL_SCHEME);
        $host = parse_url($url, PHP_URL_HOST);

        if (! in_array($scheme, ['http', 'https'], true) || ! is_string($host)) {
            $fail('Enter a valid Google Maps link starting with http or https.');

            return;
        }

        $host = strtolower($host);

        $isGoogleMaps = $host === 'maps.app.goo.gl'
            || $host === 'goo.gl'
            || $host === 'google.com'
            || Str::endsWith($host, '.google.com');

        if (! $isGoogleMaps) {
            $fail('Enter a valid Google Maps share link (for example https://maps.app.goo.gl/...).');
        }
    }
}
