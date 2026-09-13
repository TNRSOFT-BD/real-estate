<?php

declare(strict_types=1);

namespace App\Enums;

enum CompanyPermission: string
{
    case View = 'company.profile.view';
    case Update = 'company.profile.update';

    public static function all(): array
    {
        return array_map(fn (self $permission) => $permission->value, self::cases());
    }
}
