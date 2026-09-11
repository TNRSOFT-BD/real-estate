<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Contact;

use App\Models\Contact\ContactLiveChatSetting;
use App\Repositories\Contracts\Contact\ContactLiveChatRepositoryInterface;

class EloquentContactLiveChatRepository implements ContactLiveChatRepositoryInterface
{
    public function getSingleton(): ContactLiveChatSetting
    {
        return ContactLiveChatSetting::singleton();
    }

    public function updateSettings(array $data): ContactLiveChatSetting
    {
        $settings = $this->getSingleton();
        $settings->update($data);

        return $settings;
    }

    public function isEnabled(): bool
    {
        return (bool) $this->getSingleton()->enabled;
    }
}
