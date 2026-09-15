<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Home;

use App\Models\Home\WhyChooseUsFeature;
use App\Repositories\Contracts\Home\WhyChooseUsFeatureRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentWhyChooseUsFeatureRepository implements WhyChooseUsFeatureRepositoryInterface
{
    public function all(): Collection
    {
        return WhyChooseUsFeature::query()->ordered()->get();
    }

    public function active(): Collection
    {
        return WhyChooseUsFeature::query()->active()->ordered()->get();
    }

    public function findById(int $id): ?WhyChooseUsFeature
    {
        return WhyChooseUsFeature::find($id);
    }

    public function create(array $data): WhyChooseUsFeature
    {
        return WhyChooseUsFeature::create($data);
    }

    public function update(WhyChooseUsFeature $feature, array $data): WhyChooseUsFeature
    {
        $feature->update($data);

        return $feature;
    }

    public function delete(WhyChooseUsFeature $feature): bool
    {
        return (bool) $feature->delete();
    }

    public function reorder(array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            WhyChooseUsFeature::query()->whereKey($id)->update(['sort_order' => $index + 1]);
        }
    }
}
