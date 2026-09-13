<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\About;

use App\DTOs\About\AboutPageSettingsData;
use App\Http\Controllers\Controller;
use App\Http\Requests\About\UpdateAboutPageSettingsRequest;
use App\Models\About\AboutPageSetting;
use App\Repositories\Contracts\About\AboutPageSettingRepositoryInterface;
use App\Services\About\AboutPageService;
use App\Services\Contact\ContactMediaService;
use Inertia\Inertia;
use Inertia\Response;

class AboutPageSettingsController extends Controller
{
    public function __construct(
        private readonly AboutPageSettingRepositoryInterface $settingsRepository,
        private readonly AboutPageService $pageService,
        private readonly ContactMediaService $mediaService,
    ) {}

    public function edit(): Response
    {
        $this->authorize('view', AboutPageSetting::class);

        return Inertia::render('admin/about/settings/edit', [
            'settings' => $this->settingsRepository->getSingleton(),
        ]);
    }

    public function update(UpdateAboutPageSettingsRequest $request)
    {
        $dto = AboutPageSettingsData::fromRequest($request);
        $fields = $dto->toArray();

        $settings = $this->settingsRepository->getSingleton();

        $imageFields = [
            'hero_image' => 'about/hero',
            'intro_image' => 'about/intro',
            'og_image' => 'about/seo',
        ];

        foreach ($imageFields as $field => $path) {
            if ($request->hasFile($field)) {
                $stored = $this->mediaService->replace($settings->{$field}, $request->file($field), $path);

                if ($stored !== null) {
                    $fields[$field] = $stored;
                }
            }
        }

        $this->settingsRepository->updateSettings($fields);
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'About page settings updated.');
    }
}