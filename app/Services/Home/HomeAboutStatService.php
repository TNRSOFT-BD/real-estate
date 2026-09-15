<?php

declare(strict_types=1);

namespace App\Services\Home;

use App\Models\Home\HomeAboutStat;
use App\Repositories\Contracts\Home\HomeAboutStatRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class HomeAboutStatService
{
    public function __construct(
        private readonly HomeAboutStatRepositoryInterface $repository,
    ) {}

    /**
     * @return Collection<int, HomeAboutStat>
     */
    public function all(): Collection
    {
        return $this->repository->all();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): HomeAboutStat
    {
        $data['sort_order'] = (int) ($this->repository->all()->max('sort_order') ?? 0) + 1;

        return $this->repository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(HomeAboutStat $stat, array $data): HomeAboutStat
    {
        return $this->repository->update($stat, $data);
    }

    public function delete(HomeAboutStat $stat): void
    {
        $this->repository->delete($stat);
    }

    /**
     * @param  array<int, int|string>  $orderedIds
     */
    public function reorder(array $orderedIds): void
    {
        $this->repository->reorder($orderedIds);
    }
}
