<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use App\Enums\PricingStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectPricingPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('projects.manage_pricing') ?? false;
    }

    public function rules(): array
    {
        return [
            'unit_type' => ['required', 'string', 'max:150'],
            'size_sqft' => ['nullable', 'numeric', 'min:0'],
            'price_per_sqft' => ['nullable', 'numeric', 'min:0'],
            'total_price' => ['nullable', 'numeric', 'min:0'],
            'booking_money' => ['nullable', 'numeric', 'min:0'],
            'down_payment_percentage' => ['nullable', 'numeric', 'between:0,100'],
            'installment_plan' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', Rule::in(PricingStatus::all())],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }
}
