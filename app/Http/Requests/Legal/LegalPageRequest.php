<?php

declare(strict_types=1);

namespace App\Http\Requests\Legal;

use App\Enums\LegalPageStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

abstract class LegalPageRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'content' => ['nullable', 'string', 'max:200000'],
            'status' => ['required', Rule::in(LegalPageStatus::all())],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($this->input('status') !== LegalPageStatus::Published->value) {
                return;
            }

            if (blank(strip_tags((string) $this->input('content')))) {
                $validator->errors()->add('content', 'Content is required before the page can be published.');
            }
        });
    }
}
