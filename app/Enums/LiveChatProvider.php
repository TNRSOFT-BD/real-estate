<?php

declare(strict_types=1);

namespace App\Enums;

enum LiveChatProvider: string
{
    case Custom = 'custom';
    case Tawk = 'tawk';
    case Crisp = 'crisp';
    case Intercom = 'intercom';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Custom => 'Custom',
            self::Tawk => 'Tawk.to',
            self::Crisp => 'Crisp',
            self::Intercom => 'Intercom',
            self::Other => 'Other',
        };
    }
}
