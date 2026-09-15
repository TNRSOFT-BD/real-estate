<?php

declare(strict_types=1);

namespace App\Enums;

enum WhyChooseUsPermission: string
{
    case View = 'why_choose_us.view';
    case Update = 'why_choose_us.update';

    public static function all(): array
    {
        return array_map(fn (self $permission) => $permission->value, self::cases());
    }
}
