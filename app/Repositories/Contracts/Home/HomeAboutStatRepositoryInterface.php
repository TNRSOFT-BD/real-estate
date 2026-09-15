<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Home;

use App\Models\Home\HomeAboutStat;
use Illuminate\Database\Eloquent\Collection;

interface HomeAboutStatRepositoryInterface
{
    /**
     * @return Collection<int, HomeAboutStat>
     */
    public function all(): Collection;

    public function findById(int $id): ?HomeAboutStat;

    public function create(array $data): HomeAboutStat;

    public function update(HomeAboutStat $stat, array $data): HomeAboutStat;

    public function delete(HomeAboutStat $stat): bool;

    public function reorder(array $orderedIds): void;
}
