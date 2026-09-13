<?php

declare(strict_types=1);

namespace App\Services\Company;

use App\Repositories\Contracts\Company\CompanyProfileRepositoryInterface;
use App\Services\Contact\ContactMediaService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;

class CompanyProfileService
{
    private const TTL = 3600;

    public function __construct(
        private readonly CompanyProfileRepositoryInterface $repository,
        private readonly ContactMediaService $mediaService,
    ) {}

    public function getProfile(): array
    {
        return Cache::remember(
            'company.profile',
            self::TTL,
            function (): array {
                $profile = $this->repository->getSingleton();

                return [
                    'name' => $profile->name ?: config('app.name'),
                    'tagline' => $profile->tagline,
                    'logo' => $profile->logo,
                ];
            },
        );
    }

    public function getSettings(): array
    {
        return $this->repository->getSingleton()->only([
            'name',
            'tagline',
            'logo',
        ]);
    }

    public function update(array $data, ?UploadedFile $logo = null): void
    {
        if ($logo instanceof UploadedFile) {
            $stored = $this->mediaService->replace($this->repository->getSingleton()->logo, $logo, 'company/logo');

            if ($stored !== null) {
                $data['logo'] = $stored;
            }
        }

        $this->repository->updateSettings($data);
        $this->invalidateCache();
    }

    public function invalidateCache(): void
    {
        Cache::forget('company.profile');
    }
}
