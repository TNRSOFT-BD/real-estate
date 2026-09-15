<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\HomeAbout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\UpdateHomeAboutSettingsRequest;
use App\Models\Home\HomeAboutSetting;
use App\Services\Home\HomeAboutService;
use App\Services\Home\HomeAboutStatService;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class HomeAboutController extends Controller
{
    public function __construct(
        private readonly HomeAboutService $service,
        private readonly HomeAboutStatService $statService,
    ) {}

    public function edit(): Response
    {
        $this->authorize('view', HomeAboutSetting::class);

        return Inertia::render('admin/home-about/edit', [
            'settings' => $this->service->getSettings(),
            'stats' => $this->statService->all(),
        ]);
    }

    public function update(UpdateHomeAboutSettingsRequest $request)
    {
        $this->authorize('update', HomeAboutSetting::class);

        $data = $request->validated();

        $this->service->update(
            Arr::except($data, ['main_image', 'accent_image']),
            $request->file('main_image'),
            $request->file('accent_image'),
            $request->boolean('remove_main_image'),
            $request->boolean('remove_accent_image'),
        );

        return back()->with('success', 'About section updated.');
    }
}
