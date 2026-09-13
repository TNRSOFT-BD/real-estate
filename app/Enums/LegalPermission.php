<?php

declare(strict_types=1);

namespace App\Enums;

enum LegalPermission: string
{
    case View = 'legal.view';
    case Create = 'legal.create';
    case Update = 'legal.update';
    case Delete = 'legal.delete';
    case Publish = 'legal.publish';
    case Preview = 'legal.preview';

    public static function all(): array
    {
        return array_map(fn (self $permission) => $permission->value, self::cases());
    }
}
