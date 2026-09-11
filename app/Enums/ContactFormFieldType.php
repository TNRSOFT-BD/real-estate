<?php

declare(strict_types=1);

namespace App\Enums;

enum ContactFormFieldType: string
{
    case Text = 'text';
    case Email = 'email';
    case Tel = 'tel';
    case Textarea = 'textarea';
    case Select = 'select';
    case Radio = 'radio';
    case Checkbox = 'checkbox';

    public function label(): string
    {
        return match ($this) {
            self::Text => 'Text',
            self::Email => 'Email',
            self::Tel => 'Phone',
            self::Textarea => 'Textarea',
            self::Select => 'Select',
            self::Radio => 'Radio',
            self::Checkbox => 'Checkbox',
        };
    }

    public function hasOptions(): bool
    {
        return in_array($this, [self::Select, self::Radio, self::Checkbox]);
    }
}
