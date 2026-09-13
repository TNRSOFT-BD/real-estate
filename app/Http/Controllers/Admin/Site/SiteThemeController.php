<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Site\UpdateSiteThemeRequest;
use App\Models\Site\SiteSetting;
use App\Services\Site\SiteThemeService;
use Inertia\Inertia;
use Inertia\Response;

class SiteThemeController extends Controller
{
    public function __construct(
        private readonly SiteThemeService $themeService,
    ) {}

    public function edit(): Response
    {
        $this->authorize('view', SiteSetting::class);

        return Inertia::render('admin/site/appearance/edit', [
            'settings' => $this->themeService->getSettings(),
            'theme' => $this->themeService->themeForFrontend(),
        ]);
    }

    public function update(UpdateSiteThemeRequest $request)
    {
        $this->authorize('update', SiteSetting::class);

        $data = $request->validated();

        $this->themeService->update([
            'background_color' => strtoupper($data['background_color']),
            'theme_mode' => $data['theme_mode'],
        ]);

        return back()->with('success', 'Appearance updated.');
    }
}
