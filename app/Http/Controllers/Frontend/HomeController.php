<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Enums\HeroVideoQuality;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectCardResource;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Services\Company\CompanyProfileService;
use App\Services\Contact\ContactPageService;
use App\Services\Home\HomeAboutService;
use App\Services\Home\HomeAboutStatService;
use App\Services\Home\WhyChooseUsFeatureService;
use App\Services\Home\WhyChooseUsService;
use App\Services\Site\SiteThemeService;
use App\Support\Seo\StructuredData;
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
        $settings = $this->siteSettings->getSettings();
        $company = app(CompanyProfileService::class)->getProfile();
        $siteName = $company['name'] ?? config('app.name');

        $contactInformation = app(ContactPageService::class)->getActiveInformation();
        $socialLinks = app(ContactPageService::class)->getActiveSocialLinks();

        $heroImages = is_array($settings['hero_images'] ?? null) ? $settings['hero_images'] : [];
        $ogImage = $settings['og_image'] ?? ($heroImages[0] ?? ($company['logo'] ?? null));

        $description = $settings['seo_description']
            ?? 'Architectural excellence and modern living — premium residential and commercial developments.';

        return Inertia::render('home', [
            'featuredProjects' => ProjectCardResource::collection($this->projects->featuredPublished(6))->resolve(),
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
                'title' => $settings['seo_title'] ?? null,
                'default_title' => $siteName.' | Premium Real Estate Development',
                'description' => $description,
                'keywords' => $settings['seo_keywords'] ?? null,
                'canonical_url' => route('home'),
                'robots' => null,
                'og_title' => null,
                'og_description' => $description,
                'og_image' => $ogImage,
                'og_type' => 'website',
                'twitter_card' => 'summary_large_image',
                'twitter_title' => null,
                'twitter_description' => $description,
                'twitter_image' => $ogImage,
                'json_ld' => [
                    StructuredData::organization($company, $socialLinks, $this->contactValue($contactInformation, ['email']), $this->contactValue($contactInformation, ['hotline', 'phone'])),
                    StructuredData::website($siteName, url('/')),
                ],
            ],
        ]);
    }

    /**
     * @param  array<int, mixed>  $information
     * @param  array<int, string>  $types
     */
    private function contactValue(array $information, array $types): ?string
    {
        foreach ($information as $item) {
            $entry = is_array($item) ? $item : (array) $item;
            $type = $entry['type'] ?? null;
            $type = is_object($type) ? ($type->value ?? null) : $type;

            if (in_array($type, $types, true) && is_string($entry['value'] ?? null) && $entry['value'] !== '') {
                return $entry['value'];
            }
        }

        return null;
    }
}
