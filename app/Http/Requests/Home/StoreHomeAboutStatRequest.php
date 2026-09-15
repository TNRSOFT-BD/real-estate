<?php

declare(strict_types=1);

namespace App\Http\Requests\Home;

use Illuminate\Foundation\Http\FormRequest;

class StoreHomeAboutStatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('home_about.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'figure' => ['required', 'string', 'max:50'],
            'label' => ['required', 'string', 'max:255'],
        ];
    }
}
