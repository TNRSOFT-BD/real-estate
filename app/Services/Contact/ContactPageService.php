<?php

declare(strict_types=1);

namespace App\Services\Contact;

use App\Repositories\Contracts\Contact\ContactFaqRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactFormFieldRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactInformationRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactLiveChatRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactLocationRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactPageSettingRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactSocialLinkRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactTeamMemberRepositoryInterface;
use App\Services\Company\CompanyProfileService;
use App\Support\Seo\StructuredData;
use Illuminate\Support\Facades\Cache;

class ContactPageService
{
    private const TTL = 3600;

    public function __construct(
        private readonly ContactPageSettingRepositoryInterface $settingsRepository,
        private readonly ContactInformationRepositoryInterface $informationRepository,
        private readonly ContactFormFieldRepositoryInterface $formFieldRepository,
        private readonly ContactFaqRepositoryInterface $faqRepository,
        private readonly ContactTeamMemberRepositoryInterface $teamMemberRepository,
        private readonly ContactLocationRepositoryInterface $locationRepository,
        private readonly ContactSocialLinkRepositoryInterface $socialLinkRepository,
        private readonly ContactLiveChatRepositoryInterface $liveChatRepository,
    ) {}

    public function getPublicPageData(): array
    {
        return [
            'hero' => $this->getSettings(),
            'contactInformation' => $this->getActiveInformation(),
            'form' => $this->getActiveForm(),
            'faqs' => $this->getActiveFaqs(),
            'teamMembers' => $this->getActiveTeamMembers(),
            'locations' => $this->getActiveLocations(),
            'socialLinks' => $this->getActiveSocialLinks(),
            'liveChat' => $this->getLiveChatSettings(),
            'seo' => $this->buildSeoData(),
        ];
    }

    public function getSettings(): array
    {
        return Cache::remember(
            'contact.page.settings',
            self::TTL,
            fn () => $this->settingsRepository->getSingleton()->only([
                'hero_badge',
                'hero_title',
                'hero_highlight',
                'hero_description',
                'hero_primary_button_text',
                'hero_primary_button_link',
                'hero_secondary_button_text',
                'hero_secondary_button_link',
                'hero_background_image',
                'form_title',
                'form_description',
                'form_success_message',
                'faq_badge',
                'faq_title',
                'faq_description',
                'team_badge',
                'team_title',
                'team_description',
                'location_badge',
                'location_title',
                'location_description',
                'live_chat_title',
                'live_chat_description',
                'closing_badge',
                'closing_title',
                'closing_description',
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

    public function getActiveInformation(): array
    {
        return Cache::remember(
            'contact.information.active',
            self::TTL,
            fn () => $this->informationRepository->getAllActive()->toArray(),
        );
    }

    public function getActiveForm(): array
    {
        return Cache::remember(
            'contact.form.fields.active',
            self::TTL,
            fn () => $this->formFieldRepository->getAllActive()->toArray(),
        );
    }

    public function getActiveFaqs(): array
    {
        return Cache::remember(
            'contact.faqs.contact',
            self::TTL,
            fn () => $this->faqRepository->getActiveForLocation('contact')->toArray(),
        );
    }

    public function getActiveTeamMembers(): array
    {
        return Cache::remember(
            'contact.team.active',
            self::TTL,
            fn () => $this->teamMemberRepository->getAllActive()->toArray(),
        );
    }

    public function getPrimaryLocation(): ?array
    {
        return Cache::remember(
            'contact.locations.primary',
            self::TTL,
            fn () => $this->locationRepository->getPrimary()?->toArray(),
        );
    }

    public function getActiveLocations(): array
    {
        return Cache::remember(
            'contact.locations.active',
            self::TTL,
            fn () => $this->locationRepository->getAllActive()->toArray(),
        );
    }

    public function getActiveSocialLinks(): array
    {
        return Cache::remember(
            'contact.social.active',
            self::TTL,
            fn () => $this->socialLinkRepository->getAllActive()->toArray(),
        );
    }

    public function getLiveChatSettings(): ?array
    {
        return Cache::remember(
            'contact.livechat.settings',
            self::TTL,
            fn () => $this->liveChatRepository->getSingleton()->only([
                'enabled',
                'provider',
                'script_url',
                'widget_id',
                'button_text',
                'position',
                'availability_text',
            ]),
        );
    }

    public function buildSeoData(): array
    {
        $settings = $this->getSettings();
        $company = app(CompanyProfileService::class)->getProfile();

        return [
            'title' => $settings['seo_title'] ?? null,
            'default_title' => 'Contact Us',
            'description' => $settings['seo_description'] ?? null,
            'keywords' => $settings['seo_keywords'] ?? null,
            'canonical_url' => ($settings['canonical_url'] ?? null) ?: route('contact.show'),
            'robots' => null,
            'og_title' => $settings['og_title'] ?? null,
            'og_description' => $settings['og_description'] ?? null,
            'og_image' => $settings['og_image'] ?? null,
            'og_type' => 'website',
            'twitter_card' => $settings['twitter_card'] ?? null,
            'json_ld' => [
                StructuredData::organization($company, $this->getActiveSocialLinks(), $this->contactValue(['email']), $this->contactValue(['hotline', 'phone'])),
                StructuredData::breadcrumb([
                    ['name' => 'Home', 'url' => url('/')],
                    ['name' => 'Contact', 'url' => route('contact.show')],
                ]),
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
        Cache::forget('contact.page.settings');
        Cache::forget('contact.information.active');
        Cache::forget('contact.form.fields.active');
        Cache::forget('contact.faqs.contact');
        Cache::forget('contact.team.active');
        Cache::forget('contact.locations.active');
        Cache::forget('contact.locations.primary');
        Cache::forget('contact.social.active');
        Cache::forget('contact.livechat.settings');
    }
}
