<?php

declare(strict_types=1);

namespace App\Services\Home;

use App\Models\Home\HomeAboutSetting;
use App\Repositories\Contracts\Home\HomeAboutSettingRepositoryInterface;
use App\Services\Legal\LegalContentSanitizer;
use App\Services\Site\SiteMediaService;
use Illuminate\Http\UploadedFile;

class HomeAboutService
{
    public function __construct(
        private readonly HomeAboutSettingRepositoryInterface $repository,
        private readonly SiteMediaService $media,
        private readonly LegalContentSanitizer $sanitizer,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getSettings(): array
    {
        return $this->repository->getSingleton()->only([
            'heading',
            'description',
            'badge_figure',
            'badge_copy',
            'main_image',
            'main_image_alt',
            'accent_image',
            'accent_image_alt',
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(
        array $data,
        ?UploadedFile $mainImage = null,
        ?UploadedFile $accentImage = null,
        bool $removeMainImage = false,
        bool $removeAccentImage = false,
    ): HomeAboutSetting {
        $settings = $this->repository->getSingleton();

        $data['description'] = $this->sanitizer->sanitize($data['description'] ?? '');

        if ($mainImage instanceof UploadedFile) {
            $path = $this->media->replace($settings->main_image, $mainImage, 'site/about');

            if ($path !== null) {
                $data['main_image'] = $path;
            }
        } elseif ($removeMainImage) {
            $this->media->delete($settings->main_image);
            $data['main_image'] = null;
        }

        if ($accentImage instanceof UploadedFile) {
            $path = $this->media->replace($settings->accent_image, $accentImage, 'site/about');

            if ($path !== null) {
                $data['accent_image'] = $path;
            }
        } elseif ($removeAccentImage) {
            $this->media->delete($settings->accent_image);
            $data['accent_image'] = null;
        }

        return $this->repository->updateSettings($data);
    }
}
