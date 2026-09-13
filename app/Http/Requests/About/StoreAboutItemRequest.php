<?php

declare(strict_types=1);

namespace App\Http\Requests\About;

use App\Models\About\AboutItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreAboutItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('about.create') ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('type')) {
            return;
        }

        $queryType = $this->query('type');

        if (is_string($queryType) && in_array($queryType, AboutItem::types(), true)) {
            $this->merge(['type' => $queryType]);
        }
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(AboutItem::types())],
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'content' => ['nullable', 'string', 'max:10000'],
            'value' => ['nullable', 'string', 'max:50'],
            'label' => ['nullable', 'string', 'max:100'],
            'year' => ['nullable', 'string', 'max:10'],
            'date' => ['nullable', 'date'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,webp,svg', 'max:4096'],
            'image_alt' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
            'url' => ['nullable', 'url', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $type = (string) $this->input('type');

            $required = match ($type) {
                AboutItem::TYPE_STATISTIC => ['value' => 'value', 'label' => 'label'],
                AboutItem::TYPE_MILESTONE => ['year' => 'year', 'title' => 'title'],
                AboutItem::TYPE_PARTNER => ['title' => 'title'],
                AboutItem::TYPE_MISSION, AboutItem::TYPE_VISION, AboutItem::TYPE_VALUE, AboutItem::TYPE_FEATURE => ['title' => 'title'],
                default => [],
            };

            foreach ($required as $field => $label) {
                if (blank($this->input($field))) {
                    $validator->errors()->add($field, "The {$label} field is required for this section.");
                }
            }
        });
    }
}
