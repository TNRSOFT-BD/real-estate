<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Enums\HeroVideoQuality;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectCardResource;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Services\Home\HomeAboutService;
use App\Services\Home\HomeAboutStatService;
use App\Services\Home\WhyChooseUsFeatureService;
use App\Services\Home\WhyChooseUsService;
use App\Services\Site\SiteThemeService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly ProjectRepositoryInterface $projects,
        private readonly SiteThemeService $siteSettings,
        private readonly HomeAboutService $homeAbout,
        private readonly HomeAboutStatService $homeAboutStats,
        private readonly WhyChooseUsService $whyChooseUs,
        private readonly WhyChooseUsFeatureService $whyChooseUsFeatures,
    ) {}

    public function index(): Response
    {
        $description = 'Architectural excellence and modern living — premium residential and commercial developments.';
        $settings = $this->siteSettings->getSettings();

        return Inertia::render('home', [
            'featuredProjects' => ProjectCardResource::collection($this->projects->latestPublished(6))->resolve(),
            'about' => [
                ...$this->homeAbout->getSettings(),
                'stats' => $this->homeAboutStats->all()
                    ->map(fn ($stat): array => ['figure' => $stat->figure, 'label' => $stat->label])
                    ->all(),
            ],
            'whyChooseUs' => [
                ...$this->whyChooseUs->getSettings(),
                'features' => $this->whyChooseUsFeatures->active()
                    ->map(fn ($feature): array => [
                        'title' => $feature->title,
                        'description' => $feature->description,
                        'icon' => $feature->icon,
                    ])
                    ->all(),
            ],
            'hero' => [
                'eyebrow' => $settings['hero_eyebrow'] ?? null,
                'title' => $settings['hero_title'] ?? null,
                'description' => $settings['hero_description'] ?? null,
                'images' => $settings['hero_images'] ?? [],
                'video_quality' => $settings['hero_video_quality'] ?? HeroVideoQuality::default()->value,
                'video_enabled' => (bool) ($settings['hero_video_enabled'] ?? true),
                'video_source' => $settings['hero_video_source'] ?? 'default',
                'video_url' => $settings['hero_video_url'] ?? null,
                'video_link' => $settings['hero_video_link'] ?? null,
            ],
            'seo' => [
                'title' => null,
                'description' => $description,
                'keywords' => null,
                'canonical_url' => route('home'),
                'robots' => null,
                'og_title' => null,
                'og_description' => $description,
                'og_image' => null,
                'twitter_card' => 'summary_large_image',
                'twitter_title' => null,
                'twitter_description' => $description,
                'twitter_image' => null,
            ],
        ]);
    }
}
