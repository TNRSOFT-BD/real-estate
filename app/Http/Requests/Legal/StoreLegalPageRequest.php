<?php

declare(strict_types=1);

namespace App\Http\Requests\Legal;

class StoreLegalPageRequest extends LegalPageRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('legal.create') ?? false;
    }
}
