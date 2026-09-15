<?php

declare(strict_types=1);

namespace App\Services\Home;

use App\Models\Home\WhyChooseUsSetting;
use App\Repositories\Contracts\Home\WhyChooseUsSettingRepositoryInterface;

class WhyChooseUsService
{
    public function __construct(
        private readonly WhyChooseUsSettingRepositoryInterface $repository,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getSettings(): array
    {
        return $this->repository->getSingleton()->only([
            'eyebrow',
            'title',
            'description',
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(array $data): WhyChooseUsSetting
    {
        return $this->repository->updateSettings($data);
    }
}
