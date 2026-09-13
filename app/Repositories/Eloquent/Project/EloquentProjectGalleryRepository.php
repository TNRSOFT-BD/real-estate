<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Project;

use App\Models\Project\ProjectGallery;
use App\Repositories\Contracts\Project\ProjectGalleryRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProjectGalleryRepository implements ProjectGalleryRepositoryInterface
{
    public function forProject(int $projectId, int $perPage = 24): LengthAwarePaginator
    {
        return ProjectGallery::query()
            ->where('project_id', $projectId)
            ->ordered()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?ProjectGallery
    {
        return ProjectGallery::find($id);
    }

    public function create(array $data): ProjectGallery
    {
        return ProjectGallery::create($data);
    }

    public function update(ProjectGallery $gallery, array $data): ProjectGallery
    {
        $gallery->update($data);

        return $gallery;
    }

    public function delete(ProjectGallery $gallery): bool
    {
        return (bool) $gallery->delete();
    }

    public function reorder(int $projectId, array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            ProjectGallery::query()
                ->where('project_id', $projectId)
                ->whereKey($id)
                ->update(['sort_order' => $index + 1]);
        }
    }
}
