<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

class StoreProjectRequest extends ProjectRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('projects.create') ?? false;
    }
}
