<?php

declare(strict_types=1);

namespace App\Enums;

enum HeroVideoQuality: string
{
    case Auto = 'auto';
    case Eco = 'eco';
    case Good = 'good';
    case Best = 'best';

    public static function values(): array
    {
        return array_map(fn (self $quality): string => $quality->value, self::cases());
    }

    public static function default(): self
    {
        return self::Good;
    }

    public function label(): string
    {
        return match ($this) {
            self::Auto => 'Auto',
            self::Eco => 'Eco (smallest)',
            self::Good => 'Good (balanced)',
            self::Best => 'Best (sharpest)',
        };
    }
}
