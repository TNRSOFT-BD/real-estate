<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectGalleryType: string
{
    case Interior = 'interior';
    case Exterior = 'exterior';

    public static function all(): array
    {
        return array_map(fn (self $type) => $type->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::Interior => 'Interior',
            self::Exterior => 'Exterior',
        };
    }
}
