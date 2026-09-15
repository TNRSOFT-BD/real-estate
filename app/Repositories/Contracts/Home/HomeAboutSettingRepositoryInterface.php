<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Home;

use App\Models\Home\HomeAboutSetting;

interface HomeAboutSettingRepositoryInterface
{
    public function getSingleton(): HomeAboutSetting;

    public function updateSettings(array $data): HomeAboutSetting;
}
