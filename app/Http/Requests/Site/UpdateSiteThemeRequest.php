<?php

declare(strict_types=1);

namespace App\Http\Requests\Site;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('site.theme.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'background_color' => ['required', 'string', 'regex:/^#(?:[0-9a-fA-F]{3}){1,2}$/'],
            'theme_mode' => ['required', 'string', 'in:auto,light,dark'],
        ];
    }
}
