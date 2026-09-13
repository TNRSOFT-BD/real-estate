<?php

declare(strict_types=1);

namespace App\Enums;

enum AboutPermission: string
{
    case View = 'about.view';
    case Create = 'about.create';
    case Update = 'about.update';
    case Delete = 'about.delete';
    case Reorder = 'about.reorder';
    case Publish = 'about.publish';

    case SettingsView = 'about.settings.view';
    case SettingsUpdate = 'about.settings.update';

    public static function all(): array
    {
        return array_map(fn (self $permission) => $permission->value, self::cases());
    }
}
