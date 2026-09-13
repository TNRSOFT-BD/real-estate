<?php

declare(strict_types=1);

namespace App\Services\Site;

use App\DTOs\Site\SiteThemeData;
use App\Repositories\Contracts\Site\SiteSettingRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class SiteThemeService
{
    private const TTL = 3600;

    public function __construct(
        private readonly SiteSettingRepositoryInterface $settingsRepository,
    ) {}

    public function themeForFrontend(): array
    {
        return Cache::remember(
            'site.theme',
            self::TTL,
            fn () => SiteThemeData::fromModel($this->settingsRepository->getSingleton())->toArray(),
        );
    }

    public function getSettings(): array
    {
        return $this->settingsRepository->getSingleton()->only([
            'background_color',
            'theme_mode',
        ]);
    }

    public function update(array $data): void
    {
        $this->settingsRepository->updateSettings($data);
        $this->invalidateCache();
    }

    public function invalidateCache(): void
    {
        Cache::forget('site.theme');
    }
}
