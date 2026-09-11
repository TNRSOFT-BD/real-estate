<?php

declare(strict_types=1);

namespace App\Enums;

enum TeamMemberDepartment: string
{
    case Sales = 'Sales';
    case Support = 'Support';
    case Billing = 'Billing';
    case Technical = 'Technical';
    case Management = 'Management';
    case Other = 'Other';

    public function label(): string
    {
        return $this->value;
    }
}
