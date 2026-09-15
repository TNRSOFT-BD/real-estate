<?php

declare(strict_types=1);

namespace App\Services\About;

use App\Models\About\AboutItem;
use App\Repositories\Contracts\About\AboutItemRepositoryInterface;
use App\Services\Contact\ContactMediaService;
use Illuminate\Http\UploadedFile;

class AboutItemService
{
    public function __construct(
        private readonly AboutItemRepositoryInterface $repository,
        private readonly AboutPageService $pageService,
        private readonly ContactMediaService $mediaService,
    ) {}

    public function create(array $data, ?UploadedFile $image = null): AboutItem
    {
        if ($image instanceof UploadedFile) {
            $data['image'] = $this->mediaService->replace(null, $image, 'about/items');
        }

        $item = $this->repository->create($data);
        $this->pageService->invalidatePublicCache();

        return $item;
    }

    public function update(AboutItem $item, array $data, ?UploadedFile $image = null): AboutItem
    {
        if ($image instanceof UploadedFile) {
            $stored = $this->mediaService->replace($item->image, $image, 'about/items');

            if ($stored !== null) {
                $data['image'] = $stored;
            }
        }

        $item = $this->repository->update($item, $data);
        $this->pageService->invalidatePublicCache();

        return $item;
    }

    public function delete(AboutItem $item): void
    {
        $this->mediaService->delete($item->image);

        $this->repository->delete($item);
        $this->pageService->invalidatePublicCache();
    }

    public function toggle(AboutItem $item): bool
    {
        $state = $this->repository->toggleActive($item);
        $this->pageService->invalidatePublicCache();

        return $state;
    }

    /**
     * @param  array<int, int>  $orderedIds
     */
    public function reorder(array $orderedIds): void
    {
        $this->repository->reorder($orderedIds);
        $this->pageService->invalidatePublicCache();
    }
}
