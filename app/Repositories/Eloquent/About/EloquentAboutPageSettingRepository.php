<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\About;

use App\Models\About\AboutPageSetting;
use App\Repositories\Contracts\About\AboutPageSettingRepositoryInterface;

class EloquentAboutPageSettingRepository implements AboutPageSettingRepositoryInterface
{
    public function getSingleton(): AboutPageSetting
    {
        return AboutPageSetting::singleton();
    }

    public function updateSettings(array $data): AboutPageSetting
    {
        $settings = $this->getSingleton();
        $settings->update($data);

        return $settings;
    }

    public function isActive(): bool
    {
        return (bool) $this->getSingleton()->is_active;
    }
}