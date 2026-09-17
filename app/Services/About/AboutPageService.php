<?php

declare(strict_types=1);

namespace App\Services\About;

use App\Models\About\AboutItem;
use App\Repositories\Contracts\About\AboutItemRepositoryInterface;
use App\Repositories\Contracts\About\AboutPageSettingRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactInformationRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactSocialLinkRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactTeamMemberRepositoryInterface;
use App\Services\Company\CompanyProfileService;
use App\Support\Seo\StructuredData;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class AboutPageService
{
    private const TTL = 3600;

    public function __construct(
        private readonly AboutPageSettingRepositoryInterface $settingsRepository,
        private readonly AboutItemRepositoryInterface $itemRepository,
        private readonly ContactInformationRepositoryInterface $informationRepository,
        private readonly ContactSocialLinkRepositoryInterface $socialLinkRepository,
        private readonly ContactTeamMemberRepositoryInterface $teamMemberRepository,
    ) {}

    public function getPublicPageData(): array
    {
        return [
            'hero' => $this->getHero(),
            'contactInformation' => $this->getActiveInformation(),
            'socialLinks' => $this->getActiveSocialLinks(),
            'teamMembers' => $this->getActiveTeamMembers(),
            'seo' => $this->buildSeoData(),
        ];
    }

    public function getSettings(): array
    {
        return Cache::remember(
            'about.page.settings',
            self::TTL,
            fn () => $this->settingsRepository->getSingleton()->only([
                'hero_badge',
                'hero_title',
                'hero_highlight',
                'hero_description',
                'hero_image',
                'hero_cta_text',
                'hero_cta_link',
                'intro_badge',
                'intro_title',
                'intro_description',
                'intro_image',
                'direction_badge',
                'values_badge',
                'values_title',
                'journey_badge',
                'journey_title',
                'why_badge',
                'why_title',
                'team_badge',
                'team_title',
                'team_description',
                'partners_title',
                'closing_badge',
                'closing_title',
                'closing_description',
                'closing_button_text',
                'closing_button_link',
                'seo_title',
                'seo_description',
                'seo_keywords',
                'canonical_url',
                'og_title',
                'og_description',
                'og_image',
                'twitter_card',
                'is_active',
            ]),
        );
    }

    /**
     * Assemble the About hero payload from the singleton settings plus the
     * normalised repeatable About sections so the frontend contract stays stable.
     */
    public function getHero(): array
    {
        $mission = $this->items(AboutItem::TYPE_MISSION)->first();
        $vision = $this->items(AboutItem::TYPE_VISION)->first();

        return array_merge($this->getSettings(), [
            'stats' => $this->items(AboutItem::TYPE_STATISTIC)
                ->map(fn (AboutItem $item) => ['value' => $item->value, 'label' => $item->label])
                ->values()
                ->all(),
            'values' => $this->items(AboutItem::TYPE_VALUE)
                ->map(fn (AboutItem $item) => ['title' => $item->title, 'description' => $item->description])
                ->values()
                ->all(),
            'journey' => $this->items(AboutItem::TYPE_MILESTONE)
                ->map(fn (AboutItem $item) => ['year' => $item->year, 'title' => $item->title, 'description' => $item->description])
                ->values()
                ->all(),
            'why_items' => $this->items(AboutItem::TYPE_FEATURE)
                ->map(fn (AboutItem $item) => ['title' => $item->title, 'description' => $item->description])
                ->values()
                ->all(),
            'partners' => $this->items(AboutItem::TYPE_PARTNER)
                ->map(fn (AboutItem $item) => [
                    'name' => $item->title,
                    'url' => $item->url,
                    'image' => $item->image,
                    'image_alt' => $item->image_alt,
                ])
                ->values()
                ->all(),
            'mission_title' => $mission?->title,
            'mission_description' => $mission?->description,
            'mission_image' => $mission?->image,
            'vision_title' => $vision?->title,
            'vision_description' => $vision?->description,
            'vision_image' => $vision?->image,
        ]);
    }

    /**
     * @return Collection<int, AboutItem>
     */
    private function items(string $type): Collection
    {
        return Cache::remember(
            "about.items.{$type}",
            self::TTL,
            fn () => $this->itemRepository->getActiveByType($type),
        );
    }

    public function getActiveInformation(): array
    {
        return Cache::remember(
            'about.information.active',
            self::TTL,
            fn () => $this->informationRepository->getAllActive()->toArray(),
        );
    }

    public function getActiveSocialLinks(): array
    {
        return Cache::remember(
            'about.social.active',
            self::TTL,
            fn () => $this->socialLinkRepository->getAllActive()->toArray(),
        );
    }

    public function getActiveTeamMembers(): array
    {
        return Cache::remember(
            'about.team.active',
            self::TTL,
            fn () => $this->teamMemberRepository->getAllActive()->toArray(),
        );
    }

    public function buildSeoData(): array
    {
        $settings = $this->getSettings();
        $company = app(CompanyProfileService::class)->getProfile();

        return [
            'title' => $settings['seo_title'] ?? null,
            'default_title' => 'About Us',
            'description' => $settings['seo_description'] ?? null,
            'keywords' => $settings['seo_keywords'] ?? null,
            'canonical_url' => ($settings['canonical_url'] ?? null) ?: route('about.show'),
            'robots' => null,
            'og_title' => $settings['og_title'] ?? null,
            'og_description' => $settings['og_description'] ?? null,
            'og_image' => $settings['og_image'] ?? null,
            'og_type' => 'website',
            'twitter_card' => $settings['twitter_card'] ?? null,
            'json_ld' => [
                StructuredData::organization($company, $this->getActiveSocialLinks(), $this->contactValue(['email']), $this->contactValue(['hotline', 'phone'])),
            ],
        ];
    }

    /**
     * @param  array<int, string>  $types
     */
    private function contactValue(array $types): ?string
    {
        foreach ($this->getActiveInformation() as $item) {
            $entry = is_array($item) ? $item : (array) $item;
            $type = $entry['type'] ?? null;
            $type = is_object($type) ? ($type->value ?? null) : $type;

            if (in_array($type, $types, true) && is_string($entry['value'] ?? null) && $entry['value'] !== '') {
                return $entry['value'];
            }
        }

        return null;
    }

    public function invalidatePublicCache(): void
    {
        Cache::forget('about.page.settings');
        Cache::forget('about.information.active');
        Cache::forget('about.social.active');
        Cache::forget('about.team.active');

        foreach (AboutItem::types() as $type) {
            Cache::forget("about.items.{$type}");
        }
    }
}
