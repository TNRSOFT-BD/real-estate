<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Project;

use App\Models\Project\ProjectGallery;
use Illuminate\Pagination\LengthAwarePaginator;

interface ProjectGalleryRepositoryInterface
{
    public function forProject(int $projectId, int $perPage = 24): LengthAwarePaginator;

    public function findById(int $id): ?ProjectGallery;

    public function create(array $data): ProjectGallery;

    public function update(ProjectGallery $gallery, array $data): ProjectGallery;

    public function delete(ProjectGallery $gallery): bool;

    public function reorder(int $projectId, array $orderedIds): void;
}
