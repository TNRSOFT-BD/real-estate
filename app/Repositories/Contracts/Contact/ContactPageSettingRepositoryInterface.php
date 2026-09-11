<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Models\Contact\ContactPageSetting;

interface ContactPageSettingRepositoryInterface
{
    public function getSingleton(): ContactPageSetting;

    public function updateSettings(array $data): ContactPageSetting;

    public function isActive(): bool;
}
