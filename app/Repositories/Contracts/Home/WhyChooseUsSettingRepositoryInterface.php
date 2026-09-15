<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Home;

use App\Models\Home\WhyChooseUsSetting;

interface WhyChooseUsSettingRepositoryInterface
{
    public function getSingleton(): WhyChooseUsSetting;

    public function updateSettings(array $data): WhyChooseUsSetting;
}
