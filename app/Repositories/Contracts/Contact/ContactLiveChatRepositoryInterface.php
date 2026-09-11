<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Contact;

use App\Models\Contact\ContactLiveChatSetting;

interface ContactLiveChatRepositoryInterface
{
    public function getSingleton(): ContactLiveChatSetting;

    public function updateSettings(array $data): ContactLiveChatSetting;

    public function isEnabled(): bool;
}
