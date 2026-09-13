<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Exceptions\ProjectInUseException;
use App\Models\Project\ProjectStatus;
use App\Repositories\Contracts\Project\ProjectStatusRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class ProjectStatusService
{
    public function __construct(
        private readonly ProjectStatusRepositoryInterface $repository,
    ) {}

    public function create(array $data): ProjectStatus
    {
        $data['slug'] = $this->uniqueSlug($this->slugSource($data), null);

        $status = $this->repository->create($data);

        $this->invalidateCache();

        return $status;
    }

    public function update(ProjectStatus $status, array $data): ProjectStatus
    {
        $data['slug'] = $this->uniqueSlug($this->slugSource($data, $status), $status->id);

        $status = $this->repository->update($status, $data);

        $this->invalidateCache();

        return $status;
    }

    public function delete(ProjectStatus $status): void
    {
        $count = $this->repository->usageCount($status);

        if ($count > 0) {
            throw ProjectInUseException::forStatus($status->name, $count);
        }

        $this->repository->delete($status);

        $this->invalidateCache();
    }

    public function toggle(ProjectStatus $status): ProjectStatus
    {
        $status = $this->repository->update($status, ['is_active' => ! $status->is_active]);

        $this->invalidateCache();

        return $status;
    }

    public function reassign(ProjectStatus $from, ProjectStatus $to): int
    {
        if ($from->is($to)) {
            throw new InvalidArgumentException('Choose a different project status to reassign to.');
        }

        $count = DB::transaction(function () use ($from, $to): int {
            $count = $this->repository->reassign($from, $to);

            if ($this->repository->usageCount($from) !== 0) {
                throw new ProjectInUseException('Reassignment could not release all projects from the selected status.');
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

    private function slugSource(array $data, ?ProjectStatus $existing = null): string
    {
        $slug = trim((string) ($data['slug'] ?? ''));

        if ($slug !== '') {
            return $slug;
        }

        return (string) ($data['name'] ?? $existing?->name ?? 'status');
    }

    private function uniqueSlug(string $source, ?int $ignoreId): string
    {
        $base = Str::slug($source) ?: 'status';
        $slug = $base;
        $suffix = 2;

        while (ProjectStatus::query()
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
        Cache::forget('active-project-statuses');
    }
}
