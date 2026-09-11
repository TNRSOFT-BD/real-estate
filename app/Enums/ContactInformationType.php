<?php

declare(strict_types=1);

namespace App\Enums;

enum ContactInformationType: string
{
    case Hotline = 'hotline';
    case Phone = 'phone';
    case Email = 'email';
    case Address = 'address';
    case BusinessHours = 'business_hours';
    case Support = 'support';
    case Sales = 'sales';
    case WhatsApp = 'whatsapp';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Hotline => 'Hotline',
            self::Phone => 'Phone',
            self::Email => 'Email',
            self::Address => 'Address',
            self::BusinessHours => 'Business Hours',
            self::Support => 'Support',
            self::Sales => 'Sales',
            self::WhatsApp => 'WhatsApp',
            self::Other => 'Other',
        };
    }
}
