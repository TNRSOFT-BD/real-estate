<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Home;

use App\Models\Home\WhyChooseUsFeature;
use Illuminate\Database\Eloquent\Collection;

interface WhyChooseUsFeatureRepositoryInterface
{
    /**
     * @return Collection<int, WhyChooseUsFeature>
     */
    public function all(): Collection;

    /**
     * @return Collection<int, WhyChooseUsFeature>
     */
    public function active(): Collection;

    public function findById(int $id): ?WhyChooseUsFeature;

    public function create(array $data): WhyChooseUsFeature;

    public function update(WhyChooseUsFeature $feature, array $data): WhyChooseUsFeature;

    public function delete(WhyChooseUsFeature $feature): bool;

    public function reorder(array $orderedIds): void;
}
