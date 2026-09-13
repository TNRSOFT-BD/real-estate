<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\About;

use App\Models\About\AboutPageSetting;

interface AboutPageSettingRepositoryInterface
{
    public function getSingleton(): AboutPageSetting;

    public function updateSettings(array $data): AboutPageSetting;

    public function isActive(): bool;
}