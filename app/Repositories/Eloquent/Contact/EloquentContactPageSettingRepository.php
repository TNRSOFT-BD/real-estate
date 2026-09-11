<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Models\Contact\ContactPageSetting;
use App\Repositories\Contracts\Contact\ContactPageSettingRepositoryInterface;

class EloquentContactPageSettingRepository implements ContactPageSettingRepositoryInterface
{
    public function getSingleton(): ContactPageSetting
    {
        return ContactPageSetting::singleton();
    }

    public function updateSettings(array $data): ContactPageSetting
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
