<?php

declare(strict_types=1);

namespace App\Support\Seo;

use App\Support\Media;

class SeoMetaBuilder
{
    /**
     * Normalise the SEO metadata for an Inertia page into a flat array that is
     * safe to render server side (absolute URLs, resolved fallbacks).
     *
     * @param  array<string, mixed>  $page
     * @return array{
     *     title: string,
     *     description: ?string,
     *     keywords: ?string,
     *     canonical: string,
     *     robots: ?string,
     *     og_type: string,
     *     og_title: string,
     *     og_description: ?string,
     *     og_image: ?string,
     *     og_url: string,
     *     og_site_name: string,
     *     og_locale: string,
     *     twitter_card: string,
     *     twitter_title: string,
     *     twitter_description: ?string,
     *     twitter_image: ?string,
     *     json_ld: array<int, array<string, mixed>>
     * }
     */
    public static function forPage(array $page): array
    {
        $props = is_array($page['props'] ?? null) ? $page['props'] : [];
        $seo = is_array($props['seo'] ?? null) ? $props['seo'] : [];
        $company = is_array($props['company'] ?? null) ? $props['company'] : [];

        $siteName = self::string($company['name'] ?? $props['name'] ?? config('app.name')) ?? '';

        $pageUrl = self::string($page['url'] ?? null);
        $canonical = self::string($seo['canonical_url'] ?? null)
            ?: ($pageUrl !== null ? url($pageUrl) : url()->current());

        $pageTitle = self::string($seo['title'] ?? null) ?? '';
        $documentTitle = self::string($seo['default_title'] ?? null) ?? $siteName;

        if ($pageTitle !== '') {
            $documentTitle = $pageTitle;
        }

        if ($documentTitle !== '' && $documentTitle !== $siteName && ! str_contains($documentTitle, $siteName)) {
            $documentTitle = $documentTitle.' | '.$siteName;
        }

        $description = self::string($seo['description'] ?? null);
        $ogTitle = self::string($seo['og_title'] ?? null) ?? ($pageTitle !== '' ? $pageTitle : $siteName);
        $ogDescription = self::string($seo['og_description'] ?? null) ?? $description;

        $ogImage = Media::absolute(self::string($seo['og_image'] ?? null))
            ?? Media::absolute(self::string($company['logo'] ?? null));
        $twitterImage = Media::absolute(self::string($seo['twitter_image'] ?? null)) ?? $ogImage;

        return [
            'title' => $documentTitle,
            'description' => $description,
            'keywords' => self::string($seo['keywords'] ?? null),
            'canonical' => $canonical,
            'robots' => self::string($seo['robots'] ?? null),
            'og_type' => self::string($seo['og_type'] ?? null) ?? 'website',
            'og_title' => $ogTitle,
            'og_description' => $ogDescription,
            'og_image' => $ogImage,
            'og_url' => $canonical,
            'og_site_name' => $siteName,
            'og_locale' => self::locale(),
            'twitter_card' => self::string($seo['twitter_card'] ?? null) ?? 'summary_large_image',
            'twitter_title' => self::string($seo['twitter_title'] ?? null) ?? $ogTitle,
            'twitter_description' => self::string($seo['twitter_description'] ?? null) ?? $ogDescription,
            'twitter_image' => $twitterImage,
            'json_ld' => self::jsonLd($seo['json_ld'] ?? []),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function jsonLd(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $blocks = [];

        foreach ($value as $block) {
            if (is_array($block) && $block !== []) {
                $blocks[] = $block;
            }
        }

        return $blocks;
    }

    private static function string(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }

    private static function locale(): string
    {
        $locale = str_replace('-', '_', app()->getLocale());

        return $locale === 'en' ? 'en_US' : $locale;
    }
}
