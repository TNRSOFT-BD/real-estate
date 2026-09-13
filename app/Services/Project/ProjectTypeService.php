<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Exceptions\ProjectInUseException;
use App\Models\Project\ProjectType;
use App\Repositories\Contracts\Project\ProjectTypeRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class ProjectTypeService
{
    public function __construct(
        private readonly ProjectTypeRepositoryInterface $repository,
    ) {}

    public function create(array $data): ProjectType
    {
        $data['slug'] = $this->uniqueSlug($this->slugSource($data), null);

        $type = $this->repository->create($data);

        $this->invalidateCache();

        return $type;
    }

    public function update(ProjectType $type, array $data): ProjectType
    {
        $data['slug'] = $this->uniqueSlug($this->slugSource($data, $type), $type->id);

        $type = $this->repository->update($type, $data);

        $this->invalidateCache();

        return $type;
    }

    public function delete(ProjectType $type): void
    {
        $count = $this->repository->usageCount($type);

        if ($count > 0) {
            throw ProjectInUseException::forType($type->name, $count);
        }

        $this->repository->delete($type);

        $this->invalidateCache();
    }

    public function toggle(ProjectType $type): ProjectType
    {
        $type = $this->repository->update($type, ['is_active' => ! $type->is_active]);

        $this->invalidateCache();

        return $type;
    }

    public function reassign(ProjectType $from, ProjectType $to): int
    {
        if ($from->is($to)) {
            throw new InvalidArgumentException('Choose a different project type to reassign to.');
        }

        $count = DB::transaction(function () use ($from, $to): int {
            $count = $this->repository->reassign($from, $to);

            if ($this->repository->usageCount($from) !== 0) {
                throw new ProjectInUseException('Reassignment could not release all projects from the selected type.');
            }

            return $count;
        });

        $this->invalidateCache();

        return $count;
    }

    public function reorder(array $orderedIds): void
    {
        $this->repository->reorder($orderedIds);

        $this->invalidateCache();
    }

    private function slugSource(array $data, ?ProjectType $existing = null): string
    {
        $slug = trim((string) ($data['slug'] ?? ''));

        if ($slug !== '') {
            return $slug;
        }

        return (string) ($data['name'] ?? $existing?->name ?? 'type');
    }

    private function uniqueSlug(string $source, ?int $ignoreId): string
    {
        $base = Str::slug($source) ?: 'type';
        $slug = $base;
        $suffix = 2;

        while (ProjectType::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    private function invalidateCache(): void
    {
        Cache::forget('active-project-types');
    }
}
