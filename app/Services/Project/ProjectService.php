<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Models\Project\Project;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Services\Legal\LegalContentSanitizer;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectService
{
    /**
     * @var list<string>
     */
    private const IMAGE_FIELDS = ['hero_banner', 'og_image', 'twitter_image'];

    /**
     * @var list<string>
     */
    private const DOCUMENT_FIELDS = ['brochure_pdf', 'legal_approval_document'];

    public function __construct(
        private readonly ProjectRepositoryInterface $repository,
        private readonly ProjectMediaService $media,
        private readonly LegalContentSanitizer $sanitizer,
        private readonly ProjectSeoService $seo,
    ) {}

    /**
     * @param  array<string, UploadedFile|null>  $files
     */
    public function create(array $data, array $files = []): Project
    {
        $data = $this->prepare($data, $files, null);

        $project = DB::transaction(fn (): Project => $this->repository->create($data));

        $this->invalidateCache($project->slug);

        return $project;
    }

    /**
     * @param  array<string, UploadedFile|null>  $files
     */
    public function update(Project $project, array $data, array $files = []): Project
    {
        $previousSlug = $project->slug;

        $data = $this->prepare($data, $files, $project);

        $project = DB::transaction(fn (): Project => $this->repository->update($project, $data));

        $this->invalidateCache($project->slug, $previousSlug);

        return $project;
    }

    public function delete(Project $project): void
    {
        foreach (array_merge(self::IMAGE_FIELDS, self::DOCUMENT_FIELDS) as $field) {
            $this->media->delete($project->{$field});
        }

        foreach ($project->galleries as $gallery) {
            $this->media->delete($gallery->image_path);
        }

        foreach ($project->pricingPlans as $plan) {
            $this->media->delete($plan->floor_plan_image);
        }

        $slug = $project->slug;

        DB::transaction(fn (): bool => $this->repository->delete($project));

        $this->invalidateCache($slug);
    }

    public function publish(Project $project): Project
    {
        $data = ['is_published' => true];

        if ($project->published_at === null) {
            $data['published_at'] = now();
        }

        $project = $this->repository->update($project, $data);

        $this->invalidateCache($project->slug);

        return $project;
    }

    public function unpublish(Project $project): Project
    {
        $project = $this->repository->update($project, ['is_published' => false]);

        $this->invalidateCache($project->slug);

        return $project;
    }

    public function feature(Project $project): Project
    {
        $project = $this->repository->update($project, ['is_featured' => true]);

        $this->invalidateCache($project->slug);

        return $project;
    }

    public function unfeature(Project $project): Project
    {
        $project = $this->repository->update($project, ['is_featured' => false]);

        $this->invalidateCache($project->slug);

        return $project;
    }

    /**
     * @return array<string, string|null>
     */
    public function seo(Project $project): array
    {
        return $this->seo->build($project);
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, UploadedFile|null>  $files
     * @return array<string, mixed>
     */
    private function prepare(array $data, array $files, ?Project $existing): array
    {
        $data['overview'] = $this->sanitizer->sanitize($data['overview'] ?? '');

        $slugInput = trim((string) ($data['slug'] ?? ''));
        $data['slug'] = $this->uniqueSlug(
            $slugInput !== '' ? $slugInput : (string) $data['title'],
            $existing?->id,
        );

        if (array_key_exists('project_code', $data) && trim((string) $data['project_code']) === '') {
            $data['project_code'] = null;
        }

        $data['property_features'] = $this->normalizeFeatures($data['property_features'] ?? null);
        $data['amenities'] = $this->normalizeAmenities($data['amenities'] ?? null);

        return $this->applyMedia($data, $files, $existing);
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, UploadedFile|null>  $files
     * @return array<string, mixed>
     */
    private function applyMedia(array $data, array $files, ?Project $existing): array
    {
        foreach (array_merge(self::IMAGE_FIELDS, self::DOCUMENT_FIELDS) as $field) {
            $remove = (bool) ($data['remove_'.$field] ?? false);
            unset($data['remove_'.$field]);

            $file = $files[$field] ?? null;

            if ($file instanceof UploadedFile) {
                $stored = in_array($field, self::IMAGE_FIELDS, true)
                    ? $this->media->replaceImage($existing?->{$field}, $file, 'projects')
                    : $this->media->replaceDocument($existing?->{$field}, $file, 'projects');

                if ($stored !== null) {
                    $data[$field] = $stored;
                }

                continue;
            }

            if ($remove && $existing !== null) {
                $this->media->delete($existing->{$field});
                $data[$field] = null;
            }
        }

        return $data;
    }

    private function uniqueSlug(string $source, ?int $ignoreId): string
    {
        $base = Str::slug($source) ?: 'project';
        $slug = $base;
        $suffix = 2;

        while (Project::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    /**
     * @return list<array{key: string, value: string, icon: string|null}>|null
     */
    private function normalizeFeatures(mixed $value): ?array
    {
        if (! is_array($value)) {
            return null;
        }

        $features = [];

        foreach ($value as $row) {
            if (! is_array($row)) {
                continue;
            }

            $key = trim((string) ($row['key'] ?? ''));

            if ($key === '') {
                continue;
            }

            $icon = trim((string) ($row['icon'] ?? ''));

            $features[] = [
                'key' => $key,
                'value' => (string) ($row['value'] ?? ''),
                'icon' => $icon !== '' ? $icon : null,
            ];
        }

        return $features === [] ? null : $features;
    }

    /**
     * Accepts both legacy plain strings and {name, icon} objects.
     *
     * @return list<array{name: string, icon: string|null}>|null
     */
    private function normalizeAmenities(mixed $value): ?array
    {
        if (! is_array($value)) {
            return null;
        }

        $amenities = [];
        $seen = [];

        foreach ($value as $item) {
            if (is_array($item)) {
                $name = trim((string) ($item['name'] ?? ''));
                $icon = trim((string) ($item['icon'] ?? ''));
            } else {
                $name = trim((string) $item);
                $icon = '';
            }

            if ($name === '' || isset($seen[$name])) {
                continue;
            }

            $seen[$name] = true;

            $amenities[] = [
                'name' => $name,
                'icon' => $icon !== '' ? $icon : null,
            ];
        }

        return $amenities === [] ? null : $amenities;
    }

    public function invalidateCache(?string $slug = null, ?string $previousSlug = null): void
    {
        Cache::forget('published-projects');
        Cache::forget('featured-projects');

        if ($slug !== null) {
            Cache::forget('project:'.$slug);
        }

        if ($previousSlug !== null) {
            Cache::forget('project:'.$previousSlug);
        }
    }
}
