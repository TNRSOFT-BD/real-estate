<?php

declare(strict_types=1);

namespace App\DTOs\Contact;

final class ContactFormFieldData
{
    public function __construct(
        public readonly string $name,
        public readonly string $label,
        public readonly string $type,
        public readonly ?string $placeholder,
        public readonly ?string $helpText,
        public readonly array $options,
        public readonly array $validationRules,
        public readonly bool $isRequired,
        public readonly bool $isActive,
        public readonly int $sortOrder,
    ) {}

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'label' => $this->label,
            'type' => $this->type,
            'placeholder' => $this->placeholder,
            'help_text' => $this->helpText,
            'options' => $this->options,
            'validation_rules' => $this->validationRules,
            'is_required' => $this->isRequired,
            'is_active' => $this->isActive,
            'sort_order' => $this->sortOrder,
        ];
    }
}
