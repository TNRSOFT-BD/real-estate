<?php

declare(strict_types=1);

namespace App\Enums;

enum SitePermission: string
{
    case View = 'site.view';
    case ThemeView = 'site.theme.view';
    case ThemeUpdate = 'site.theme.update';

    public static function all(): array
    {
        return array_map(fn (self $permission) => $permission->value, self::cases());
    }
}
