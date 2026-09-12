<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\DTOs\Contact\ContactPageSettingsData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\UpdateContactPageSettingsRequest;
use App\Models\Contact\ContactPageSetting;
use App\Repositories\Contracts\Contact\ContactPageSettingRepositoryInterface;
use App\Services\Contact\ContactMediaService;
use App\Services\Contact\ContactPageService;
use Inertia\Inertia;
use Inertia\Response;

class ContactPageSettingsController extends Controller
{
    public function __construct(
        private readonly ContactPageSettingRepositoryInterface $settingsRepository,
        private readonly ContactPageService $pageService,
        private readonly ContactMediaService $mediaService,
    ) {}

    public function edit(): Response
    {
        $this->authorize('view', ContactPageSetting::class);

        return Inertia::render('admin/contact/settings/edit', [
            'settings' => $this->settingsRepository->getSingleton(),
        ]);
    }

    public function update(UpdateContactPageSettingsRequest $request)
    {
        $dto = ContactPageSettingsData::fromRequest($request);
        $fields = $dto->toArray();

        $settings = $this->settingsRepository->getSingleton();

        if ($request->hasFile('hero_background_image')) {
            $path = $this->mediaService->replace(
                $settings->hero_background_image,
                $request->file('hero_background_image'),
                'contact/hero',
            );

            if ($path !== null) {
                $fields['hero_background_image'] = $path;
            }
        }

        if ($request->hasFile('og_image')) {
            $path = $this->mediaService->replace(
                $settings->og_image,
                $request->file('og_image'),
                'contact/seo',
            );

            if ($path !== null) {
                $fields['og_image'] = $path;
            }
        }

        $this->settingsRepository->updateSettings($fields);
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Contact page settings updated.');
    }
}
