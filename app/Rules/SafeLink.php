<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Validates links entered in the CMS.
 *
 * Laravel's `url` rule only accepts absolute URLs, but buttons and contact
 * details legitimately use site-relative paths ("/contact"), in-page anchors
 * ("#contact-form") and protocol links ("tel:", "mailto:", "sms:").
 * Script-bearing schemes are rejected because these values end up in `href`.
 */
class SafeLink implements ValidationRule
{
    private const BLOCKED_SCHEMES = ['javascript:', 'data:', 'vbscript:'];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (! is_string($value)) {
            $fail('The :attribute field must be a valid link.');

            return;
        }

        $link = trim($value);

        // Browsers ignore whitespace and control characters when resolving a
        // scheme, so normalise before checking for blocked schemes.
        $probe = (string) preg_replace('/[\x00-\x20]+/', '', mb_strtolower($link));

        foreach (self::BLOCKED_SCHEMES as $scheme) {
            if (str_starts_with($probe, $scheme)) {
                $fail('The :attribute field must not use javascript, data or vbscript links.');

                return;
            }
        }

        if (preg_match('/^(?:https?:\/\/|mailto:|tel:|sms:)\S+$/i', $link) === 1) {
            return;
        }

        if (preg_match('/^(?:\/\S*|#\S+)$/', $link) === 1) {
            return;
        }

        $fail('The :attribute field must be an http(s) URL, a /path, an #anchor, or a tel:/mailto: link.');
    }
}
