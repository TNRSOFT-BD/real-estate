<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Project;

use App\Models\Project\Project;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EloquentProjectRepository implements ProjectRepositoryInterface
{
    public function paginate(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return Project::query()
            ->with(['type:id,name', 'status:id,name,color'])
            ->withCount(['galleries', 'pricingPlans'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('project_code', 'like', "%{$search}%")
                        ->orWhere('location_address', 'like', "%{$search}%")
                        ->orWhere('location_area', 'like', "%{$search}%")
                        ->orWhere('location_city', 'like', "%{$search}%");
                });
            })
            ->when($filters['project_type_id'] ?? null, fn ($query, $value) => $query->where('project_type_id', $value))
            ->when($filters['project_status_id'] ?? null, fn ($query, $value) => $query->where('project_status_id', $value))
            ->when($filters['location_city'] ?? null, fn ($query, $value) => $query->where('location_city', $value))
            ->when(
                isset($filters['is_published']) && $filters['is_published'] !== '',
                fn ($query) => $query->where('is_published', filter_var($filters['is_published'], FILTER_VALIDATE_BOOLEAN)),
            )
            ->when(
                isset($filters['is_featured']) && $filters['is_featured'] !== '',
                fn ($query) => $query->where('is_featured', filter_var($filters['is_featured'], FILTER_VALIDATE_BOOLEAN)),
            )
            ->tap(fn (Builder $query) => $this->applySort($query, $filters['sort'] ?? null))
            ->paginate($perPage)
            ->withQueryString();
    }

    public function findById(int $id): ?Project
    {
        return Project::find($id);
    }

    public function findBySlug(string $slug): ?Project
    {
        return Project::query()->where('slug', $slug)->first();
    }

    public function findPublishedBySlug(string $slug): ?Project
    {
        return Project::query()->published()->where('slug', $slug)->first();
    }

    public function paginatePublic(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return Project::query()
            ->published()
            ->with(['type:id,name,slug', 'status:id,name,slug,color'])
            ->when($filters['project_type'] ?? null, fn ($query, $slug) => $query->whereHas('type', fn ($type) => $type->where('slug', $slug)))
            ->when($filters['project_status'] ?? null, fn ($query, $slug) => $query->whereHas('status', fn ($status) => $status->where('slug', $slug)))
            ->when($filters['location_city'] ?? null, fn ($query, $city) => $query->where('location_city', $city))
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('location_area', 'like', "%{$search}%")
                        ->orWhere('location_city', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('is_featured')
            ->ordered()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function featuredExcept(int $excludeId, int $limit = 3): Collection
    {
        return Project::query()
            ->published()
            ->featured()
            ->whereKeyNot($excludeId)
            ->with(['type:id,name,slug', 'status:id,name,slug,color'])
            ->ordered()
            ->limit($limit)
            ->get();
    }

    public function latestPublished(int $limit = 6): Collection
    {
        return Project::query()
            ->published()
            ->with(['type:id,name,slug', 'status:id,name,slug,color'])
            ->orderByDesc('is_featured')
            ->ordered()
            ->limit($limit)
            ->get();
    }

    public function publishedLocations(): array
    {
        return Project::query()
            ->published()
            ->whereNotNull('location_city')
            ->where('location_city', '!=', '')
            ->distinct()
            ->orderBy('location_city')
            ->pluck('location_city')
            ->all();
    }

    public function create(array $data): Project
    {
        return Project::create($data);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project;
    }

    public function delete(Project $project): bool
    {
        return (bool) $project->delete();
    }

    public function count(): int
    {
        return Project::query()->count();
    }

    private function applySort(Builder $query, ?string $sort): void
    {
        match ($sort) {
            'oldest' => $query->oldest(),
            'name' => $query->orderBy('title'),
            'sort_order' => $query->orderBy('sort_order')->orderByDesc('id'),
            'published_at' => $query->orderByDesc('published_at'),
            default => $query->latest(),
        };
    }
}
