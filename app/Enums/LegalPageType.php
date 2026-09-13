<?php

declare(strict_types=1);

namespace App\Enums;

enum LegalPageType: string
{
    case PrivacyPolicy = 'privacy_policy';
    case TermsConditions = 'terms_conditions';

    public static function all(): array
    {
        return array_map(fn (self $type) => $type->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::PrivacyPolicy => 'Privacy Policy',
            self::TermsConditions => 'Terms & Conditions',
        };
    }

    public function slug(): string
    {
        return match ($this) {
            self::PrivacyPolicy => 'privacy-policy',
            self::TermsConditions => 'terms-and-conditions',
        };
    }

    public function routeName(): string
    {
        return match ($this) {
            self::PrivacyPolicy => 'privacy-policy',
            self::TermsConditions => 'terms-conditions',
        };
    }
}
