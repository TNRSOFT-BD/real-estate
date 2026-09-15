<?php

declare(strict_types=1);

namespace App\Services\Home;

use App\Models\Home\WhyChooseUsFeature;
use App\Repositories\Contracts\Home\WhyChooseUsFeatureRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class WhyChooseUsFeatureService
{
    public function __construct(
        private readonly WhyChooseUsFeatureRepositoryInterface $repository,
    ) {}

    /**
     * @return Collection<int, WhyChooseUsFeature>
     */
    public function all(): Collection
    {
        return $this->repository->all();
    }

    /**
     * @return Collection<int, WhyChooseUsFeature>
     */
    public function active(): Collection
    {
        return $this->repository->active();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): WhyChooseUsFeature
    {
        $data['sort_order'] = (int) ($this->repository->all()->max('sort_order') ?? 0) + 1;

        return $this->repository->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(WhyChooseUsFeature $feature, array $data): WhyChooseUsFeature
    {
        return $this->repository->update($feature, $data);
    }

    public function delete(WhyChooseUsFeature $feature): void
    {
        $this->repository->delete($feature);
    }

    public function toggle(WhyChooseUsFeature $feature): WhyChooseUsFeature
    {
        return $this->repository->update($feature, ['is_active' => ! $feature->is_active]);
    }

    /**
     * @param  array<int, int|string>  $orderedIds
     */
    public function reorder(array $orderedIds): void
    {
        $this->repository->reorder($orderedIds);
    }
}
