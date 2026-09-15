<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Home;

use App\Models\Home\WhyChooseUsSetting;
use App\Repositories\Contracts\Home\WhyChooseUsSettingRepositoryInterface;

class EloquentWhyChooseUsSettingRepository implements WhyChooseUsSettingRepositoryInterface
{
    public function getSingleton(): WhyChooseUsSetting
    {
        return WhyChooseUsSetting::singleton();
    }

    public function updateSettings(array $data): WhyChooseUsSetting
    {
        $settings = $this->getSingleton();
        $settings->update($data);

        return $settings;
    }
}
