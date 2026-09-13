<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Site;

use App\Models\Site\SiteSetting;

interface SiteSettingRepositoryInterface
{
    public function getSingleton(): SiteSetting;

    public function updateSettings(array $data): SiteSetting;
}
