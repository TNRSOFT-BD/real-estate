<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:2000'],
            'website' => ['sometimes', 'max:255'],
        ];
    }
}
