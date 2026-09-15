<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Site;

use App\Enums\HeroVideoQuality;
use App\Http\Controllers\Controller;
use App\Http\Requests\Site\UpdateSiteHomepageRequest;
use App\Http\Requests\Site\UpdateSiteThemeRequest;
use App\Models\Site\SiteSetting;
use App\Services\Cloudinary\CloudinaryService;
use App\Services\Site\SiteMediaService;
use App\Services\Site\SiteThemeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteThemeController extends Controller
{
    public function __construct(
        private readonly SiteThemeService $themeService,
        private readonly SiteMediaService $mediaService,
        private readonly CloudinaryService $cloudinary,
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

    public function homepageEdit(): Response
    {
        $this->authorize('view', SiteSetting::class);

        return Inertia::render('admin/site/homepage/edit', [
            'settings' => $this->themeService->getSettings(),
        ]);
    }

    public function homepageUpdate(UpdateSiteHomepageRequest $request)
    {
        $this->authorize('update', SiteSetting::class);

        $data = $request->validated();
        $current = $this->themeService->getSettings();

        $update = [
            'hero_eyebrow' => $data['hero_eyebrow'] ?? null,
            'hero_title' => $data['hero_title'] ?? null,
            'hero_description' => $data['hero_description'] ?? null,
            'hero_video_quality' => $data['hero_video_quality'] ?? ($current['hero_video_quality'] ?? HeroVideoQuality::default()->value),
            'hero_video_enabled' => $request->has('hero_video_enabled')
                ? $request->boolean('hero_video_enabled')
                : (bool) ($current['hero_video_enabled'] ?? true),
        ];

        $link = $data['hero_video_link'] ?? null;
        $requested = $data['hero_video_source'] ?? ($current['hero_video_source'] ?? 'default');

        if ($requested === 'url' && filled($link)) {
            $update['hero_video_source'] = 'url';
            $update['hero_video_link'] = $link;
        } elseif ($requested === 'upload' && ! empty($current['hero_video_url'])) {
            $update['hero_video_source'] = 'upload';
            $update['hero_video_link'] = $link;
        } else {
            $update['hero_video_source'] = 'default';
            $update['hero_video_link'] = $link;
        }

        $this->themeService->update($update);

        return back()->with('success', 'Homepage settings updated.');
    }

    /**
     * Signed parameters so the browser can upload a video straight to
     * Cloudinary (bypassing PHP's post_max_size).
     */
    public function homepageVideoSignature(): JsonResponse
    {
        $this->authorize('update', SiteSetting::class);

        $signature = $this->cloudinary->uploadSignature();

        if ($signature === null) {
            return response()->json(['message' => 'Cloudinary is not configured.'], 422);
        }

        return response()->json($signature);
    }

    /**
     * Persist the result of a direct-to-Cloudinary video upload.
     */
    public function homepageVideoStore(Request $request): RedirectResponse
    {
        $this->authorize('update', SiteSetting::class);

        $data = $request->validate([
            'url' => ['required', 'url', 'max:500', 'regex:#^https://res\.cloudinary\.com/#'],
            'public_id' => ['required', 'string', 'max:255'],
        ]);

        $current = $this->themeService->getSettings();

        if (! empty($current['hero_video_public_id']) && $current['hero_video_public_id'] !== $data['public_id']) {
            $this->cloudinary->deleteVideo((string) $current['hero_video_public_id']);
        }

        $this->themeService->update([
            'hero_video_source' => 'upload',
            'hero_video_url' => $data['url'],
            'hero_video_public_id' => $data['public_id'],
        ]);

        return back()->with('success', 'Hero video uploaded.');
    }

    /**
     * Upload one or more hero images. They are appended to the existing list.
     */
    public function homepageImagesStore(Request $request): RedirectResponse
    {
        $this->authorize('update', SiteSetting::class);

        $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'mimes:jpeg,png,webp', 'max:4096'],
        ]);

        $stored = [];

        foreach ((array) $request->file('images', []) as $file) {
            $path = $this->mediaService->upload($file, 'site/hero');

            if ($path !== null) {
                $stored[] = $path;
            }
        }

        if ($stored === []) {
            return back()->with('error', 'The images could not be stored.');
        }

        $this->themeService->update([
            'hero_images' => array_values(array_merge($this->heroImages(), $stored)),
        ]);

        return back()->with('success', count($stored).' image(s) uploaded.');
    }

    /**
     * Delete a single hero image and remove its file from storage.
     */
    public function homepageImagesDestroy(Request $request): RedirectResponse
    {
        $this->authorize('update', SiteSetting::class);

        $data = $request->validate([
            'path' => ['required', 'string', 'max:255'],
        ]);

        $current = $this->heroImages();

        if (! in_array($data['path'], $current, true)) {
            abort(404);
        }

        $this->mediaService->delete($data['path']);

        $this->themeService->update([
            'hero_images' => array_values(array_filter($current, fn (string $path): bool => $path !== $data['path'])),
        ]);

        return back()->with('success', 'Image deleted.');
    }

    /**
     * Persist a new order for the hero images.
     */
    public function homepageImagesReorder(Request $request): RedirectResponse
    {
        $this->authorize('update', SiteSetting::class);

        $data = $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['string', 'max:255'],
        ]);

        $current = $this->heroImages();

        $ordered = array_values(array_filter(
            $data['images'],
            fn (string $path): bool => in_array($path, $current, true),
        ));

        // Keep any image that was not mentioned to avoid accidental loss.
        foreach ($current as $path) {
            if (! in_array($path, $ordered, true)) {
                $ordered[] = $path;
            }
        }

        $this->themeService->update(['hero_images' => $ordered]);

        return back()->with('success', 'Images reordered.');
    }

    /**
     * @return array<int, string>
     */
    private function heroImages(): array
    {
        $images = $this->themeService->getSettings()['hero_images'] ?? [];

        return array_values(array_filter(is_array($images) ? $images : [], 'is_string'));
    }
}
