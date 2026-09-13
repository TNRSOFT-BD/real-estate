<?php

declare(strict_types=1);

namespace App\Enums;

enum PricingStatus: string
{
    case Available = 'available';
    case SoldOut = 'sold_out';
    case Unavailable = 'unavailable';

    public static function all(): array
    {
        return array_map(fn (self $status) => $status->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Available',
            self::SoldOut => 'Sold Out',
            self::Unavailable => 'Unavailable',
        };
    }
}
