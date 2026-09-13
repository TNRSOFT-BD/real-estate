<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Site;

use App\Models\Site\SiteSetting;
use App\Repositories\Contracts\Site\SiteSettingRepositoryInterface;

class EloquentSiteSettingRepository implements SiteSettingRepositoryInterface
{
    public function getSingleton(): SiteSetting
    {
        return SiteSetting::singleton();
    }

    public function updateSettings(array $data): SiteSetting
    {
        $settings = $this->getSingleton();
        $settings->update($data);

        return $settings;
    }
}
