<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Home;

use App\Models\Home\HomeAboutSetting;
use App\Repositories\Contracts\Home\HomeAboutSettingRepositoryInterface;

class EloquentHomeAboutSettingRepository implements HomeAboutSettingRepositoryInterface
{
    public function getSingleton(): HomeAboutSetting
    {
        return HomeAboutSetting::singleton();
    }

    public function updateSettings(array $data): HomeAboutSetting
    {
        $settings = $this->getSingleton();
        $settings->update($data);

        return $settings;
    }
}
