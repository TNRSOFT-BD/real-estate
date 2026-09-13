<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

class StoreProjectTypeRequest extends ProjectTypeRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('project_types.create') ?? false;
    }
}
