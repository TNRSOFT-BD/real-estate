<?php

declare(strict_types=1);

namespace App\Enums;

enum FaqDisplayLocation: string
{
    case All = 'all';
    case Homepage = 'homepage';
    case Contact = 'contact';
    case Faq = 'faq';
    case Packages = 'packages';

    public function label(): string
    {
        return match ($this) {
            self::All => 'All Pages',
            self::Homepage => 'Homepage',
            self::Contact => 'Contact Page',
            self::Faq => 'FAQ Page',
            self::Packages => 'Packages Page',
        };
    }
}
