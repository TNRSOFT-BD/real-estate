<?php

declare(strict_types=1);

namespace App\Services\Legal;

use App\Enums\LegalPageStatus;
use App\Models\Legal\LegalPage;
use App\Repositories\Contracts\Legal\LegalPageRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class LegalPageService
{
    private const TTL = 3600;

    private const CACHE_KEY = 'legal.published';

    /**
     * Root paths that already belong to other routes and must never be used as a page slug.
     *
     * @var list<string>
     */
    private const RESERVED_SLUGS = [
        'up',
        'login',
        'dashboard',
        'about',
        'contact',
        'settings',
        'admin',
    ];

    public function __construct(
        private readonly LegalPageRepositoryInterface $repository,
        private readonly LegalContentSanitizer $sanitizer,
    ) {}

    /**
     * All published pages keyed by slug, ready for the public site.
     *
     * @return array<string, array<string, mixed>>
     */
    public function published(): array
    {
        return Cache::remember(self::CACHE_KEY, self::TTL, function (): array {
            return $this->repository->allPublished()
                ->mapWithKeys(fn (LegalPage $page): array => [
                    $page->slug => [
                        'title' => $page->title,
                        'slug' => $page->slug,
                        'content' => $this->sanitizer->sanitize($page->content),
                        'published_at' => $page->published_at?->toIso8601String(),
                        'updated_at' => $page->updated_at?->toIso8601String(),
                    ],
                ])
                ->all();
        });
    }

    public function getPublicPage(string $slug): ?array
    {
        return $this->published()[$slug] ?? null;
    }

    /**
     * Lightweight list used to build the footer links.
     *
     * @return array<int, array{title: string, slug: string}>
     */
    public function getFooterPages(): array
    {
        return array_values(array_map(
            fn (array $page): array => ['title' => $page['title'], 'slug' => $page['slug']],
            $this->published(),
        ));
    }

    public function getSettings(LegalPage $page): array
    {
        return $page->only(['id', 'title', 'slug', 'content', 'status', 'published_at']);
    }

    public function create(array $data): LegalPage
    {
        $data['content'] = $this->sanitizer->sanitize($data['content'] ?? '');
        $data['slug'] = $this->uniqueSlug((string) $data['title']);
        $data = $this->applyPublishedAt($data);

        $page = $this->repository->create($data);
        $this->invalidateCache();

        return $page;
    }

    public function update(LegalPage $page, array $data): LegalPage
    {
        $data['content'] = $this->sanitizer->sanitize($data['content'] ?? $page->content ?? '');
        $data['slug'] = $this->uniqueSlug((string) ($data['title'] ?? $page->title), $page->id);
        $data = $this->applyPublishedAt($data);

        $page = $this->repository->update($page, $data);
        $this->invalidateCache();

        return $page;
    }

    public function publish(LegalPage $page): LegalPage
    {
        $page = $this->repository->update($page, [
            'status' => LegalPageStatus::Published->value,
            'published_at' => $page->published_at ?? now(),
        ]);

        $this->invalidateCache();

        return $page;
    }

    public function unpublish(LegalPage $page): LegalPage
    {
        $page = $this->repository->update($page, [
            'status' => LegalPageStatus::Draft->value,
        ]);

        $this->invalidateCache();

        return $page;
    }

    public function delete(LegalPage $page): void
    {
        $this->repository->delete($page);
        $this->invalidateCache();
    }

    public function invalidateCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'page';
        $slug = $base;
        $suffix = 2;

        while (in_array($slug, self::RESERVED_SLUGS, true) || $this->slugExists($slug, $ignoreId)) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        return LegalPage::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists();
    }

    private function applyPublishedAt(array $data): array
    {
        if (($data['status'] ?? null) === LegalPageStatus::Published->value && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
