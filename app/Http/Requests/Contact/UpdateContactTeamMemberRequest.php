<?php

declare(strict_types=1);

namespace App\Http\Requests\Contact;

use App\Enums\TeamMemberDepartment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateContactTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('contact.team.update') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'department' => ['required', new Enum(TeamMemberDepartment::class)],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:5000'],
            'availability' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
