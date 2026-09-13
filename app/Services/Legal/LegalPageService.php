<?php

declare(strict_types=1);

namespace App\Services\Legal;

use App\Enums\LegalPageStatus;
use App\Enums\LegalPageType;
use App\Models\Legal\LegalPage;
use App\Repositories\Contracts\Legal\LegalPageRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class LegalPageService
{
    private const TTL = 3600;

    public function __construct(
        private readonly LegalPageRepositoryInterface $repository,
        private readonly LegalContentSanitizer $sanitizer,
    ) {}

    public function getPublicPage(LegalPageType $type): ?array
    {
        $cached = Cache::remember(
            $this->cacheKey($type),
            self::TTL,
            function () use ($type): array {
                $page = $this->repository->findPublishedByType($type);

                return [
                    'page' => $page instanceof LegalPage ? [
                        'title' => $page->title,
                        'slug' => $page->slug,
                        'content' => $this->sanitizer->sanitize($page->content),
                        'published_at' => $page->published_at?->toIso8601String(),
                        'updated_at' => $page->updated_at?->toIso8601String(),
                    ] : null,
                ];
            },
        );

        return $cached['page'] ?? null;
    }

    public function getSettings(LegalPageType $type): array
    {
        $page = $this->repository->findByType($type);

        return $page instanceof LegalPage ? $page->only([
            'id', 'type', 'title', 'slug', 'content', 'status', 'published_at',
        ]) : [];
    }

    public function create(array $data): LegalPage
    {
        $data['content'] = $this->sanitizer->sanitize($data['content'] ?? '');
        $data['slug'] = Str::slug(($data['slug'] ?? null) ?: $data['title']);
        $data = $this->applyPublishedAt($data);

        $page = $this->repository->create($data);
        $this->invalidateCache($page->type);

        return $page;
    }

    public function update(LegalPage $page, array $data): LegalPage
    {
        $data['content'] = $this->sanitizer->sanitize($data['content'] ?? $page->content ?? '');
        $data = $this->applyPublishedAt($data);

        if (! empty($data['slug'])) {
            $data['slug'] = Str::slug($data['slug']);
        } else {
            unset($data['slug']);
        }

        $page = $this->repository->update($page, $data);
        $this->invalidateCache($page->type);

        return $page;
    }

    public function publish(LegalPage $page): LegalPage
    {
        $page = $this->repository->update($page, [
            'status' => LegalPageStatus::Published->value,
            'published_at' => $page->published_at ?? now(),
        ]);

        $this->invalidateCache($page->type);

        return $page;
    }

    public function unpublish(LegalPage $page): LegalPage
    {
        $page = $this->repository->update($page, [
            'status' => LegalPageStatus::Draft->value,
        ]);

        $this->invalidateCache($page->type);

        return $page;
    }

    public function delete(LegalPage $page): void
    {
        $this->repository->delete($page);
        $this->invalidateCache($page->type);
    }

    public function invalidateCache(LegalPageType $type): void
    {
        Cache::forget($this->cacheKey($type));
    }

    private function cacheKey(LegalPageType $type): string
    {
        return 'legal.'.$type->slug();
    }

    private function applyPublishedAt(array $data): array
    {
        if (($data['status'] ?? null) === LegalPageStatus::Published->value && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
