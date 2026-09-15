<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Home;

use App\Models\Home\HomeAboutStat;
use App\Repositories\Contracts\Home\HomeAboutStatRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentHomeAboutStatRepository implements HomeAboutStatRepositoryInterface
{
    public function all(): Collection
    {
        return HomeAboutStat::query()->ordered()->get();
    }

    public function findById(int $id): ?HomeAboutStat
    {
        return HomeAboutStat::find($id);
    }

    public function create(array $data): HomeAboutStat
    {
        return HomeAboutStat::create($data);
    }

    public function update(HomeAboutStat $stat, array $data): HomeAboutStat
    {
        $stat->update($data);

        return $stat;
    }

    public function delete(HomeAboutStat $stat): bool
    {
        return (bool) $stat->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            HomeAboutStat::query()->whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }
}
