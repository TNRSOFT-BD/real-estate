<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Models\Project\Project;
use App\Models\Project\ProjectGallery;
use App\Repositories\Contracts\Project\ProjectGalleryRepositoryInterface;
use Illuminate\Http\UploadedFile;

class ProjectGalleryService
{
    public function __construct(
        private readonly ProjectGalleryRepositoryInterface $repository,
        private readonly ProjectMediaService $media,
    ) {}

    /**
     * @param  array<int, UploadedFile>  $files
     * @param  array<int, array{type?: string, caption?: string|null, alt_text?: string|null}>  $meta
     */
    public function upload(Project $project, array $files, array $meta = []): int
    {
        $order = (int) ($project->galleries()->max('sort_order') ?? 0);
        $stored = 0;

        foreach (array_values($files) as $index => $file) {
            $path = $this->media->uploadImage($file, 'projects/gallery');

            if ($path === null) {
                continue;
            }

            $this->repository->create([
                'project_id' => $project->id,
                'image_path' => $path,
                'type' => $meta[$index]['type'] ?? 'exterior',
                'caption' => $meta[$index]['caption'] ?? null,
                'alt_text' => $meta[$index]['alt_text'] ?? null,
                'sort_order' => ++$order,
                'is_featured' => false,
            ]);

            $stored++;
        }

        return $stored;
    }

    public function update(ProjectGallery $gallery, array $data): ProjectGallery
    {
        return $this->repository->update($gallery, $data);
    }

    public function replaceImage(ProjectGallery $gallery, UploadedFile $file): ProjectGallery
    {
        $stored = $this->media->replaceImage($gallery->image_path, $file, 'projects/gallery');

        if ($stored !== null) {
            $gallery = $this->repository->update($gallery, ['image_path' => $stored]);
        }

        return $gallery;
    }

    public function setFeatured(ProjectGallery $gallery, bool $featured): ProjectGallery
    {
        return $this->repository->update($gallery, ['is_featured' => $featured]);
    }

    public function delete(ProjectGallery $gallery): void
    {
        $this->media->delete($gallery->image_path);

        $this->repository->delete($gallery);
    }

    public function reorder(Project $project, array $orderedIds): void
    {
        $this->repository->reorder($project->id, $orderedIds);
    }
}
