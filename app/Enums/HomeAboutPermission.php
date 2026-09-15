<?php

declare(strict_types=1);

namespace App\Enums;

enum HomeAboutPermission: string
{
    case View = 'home_about.view';
    case Update = 'home_about.update';

    public static function all(): array
    {
        return array_map(fn (self $permission) => $permission->value, self::cases());
    }
}
