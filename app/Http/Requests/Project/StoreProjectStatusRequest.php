<?php

declare(strict_types=1);

namespace App\Http\Requests\Project;

class StoreProjectStatusRequest extends ProjectStatusRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('project_statuses.create') ?? false;
    }
}
