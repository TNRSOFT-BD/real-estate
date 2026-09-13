<?php

declare(strict_types=1);

namespace App\Enums;

enum LegalPageStatus: string
{
    case Draft = 'draft';
    case Published = 'published';

    public static function all(): array
    {
        return array_map(fn (self $status) => $status->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Published => 'Published',
        };
    }
}
