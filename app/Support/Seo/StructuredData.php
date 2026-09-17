<?php

declare(strict_types=1);

namespace App\Support\Seo;

use App\Models\Project\Project;
use App\Support\Media;

class StructuredData
{
    /**
     * @param  array<string, mixed>  $company
     * @param  iterable<int, mixed>  $socialLinks
     * @return array<string, mixed>
     */
    public static function organization(array $company, iterable $socialLinks = [], ?string $contactEmail = null, ?string $telephone = null): array
    {
        $sameAs = [];

        foreach ($socialLinks as $link) {
            $url = is_array($link) ? ($link['url'] ?? null) : ($link->url ?? null);

            if (is_string($url) && $url !== '') {
                $sameAs[] = $url;
            }
        }

        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => $company['name'] ?? null,
            'url' => url('/'),
        ];

        $tagline = $company['tagline'] ?? null;
        if (is_string($tagline) && $tagline !== '') {
            $data['description'] = $tagline;
        }

        $logo = Media::absolute(is_string($company['logo'] ?? null) ? $company['logo'] : null);
        if ($logo !== null) {
            $data['logo'] = $logo;
        }

        if ($sameAs !== []) {
            $data['sameAs'] = array_values(array_unique($sameAs));
        }

        if (is_string($contactEmail) && $contactEmail !== '') {
            $data['email'] = $contactEmail;
        }

        if (is_string($telephone) && $telephone !== '') {
            $data['telephone'] = $telephone;
        }

        return array_filter($data, fn ($value): bool => $value !== null && $value !== []);
    }

    /**
     * @return array<string, mixed>
     */
    public static function website(string $name, ?string $url = null): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => $name,
            'url' => $url ?? url('/'),
        ];
    }

    /**
     * @param  array<int, array{name: string, url: string}>  $items
     * @return array<string, mixed>
     */
    public static function breadcrumb(array $items): array
    {
        $list = [];

        foreach (array_values($items) as $index => $item) {
            $list[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $item['name'],
                'item' => $item['url'],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $list,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function realEstateListing(Project $project, string $canonical, ?string $currency = null): array
    {
        $description = $project->og_description
            ?: $project->meta_description
            ?: $project->short_description
            ?: null;

        $image = Media::absolute($project->og_image ?: $project->hero_banner);

        $data = [
            '@context' => 'https://schema.org',
            '@type' => 'RealEstateListing',
            'name' => $project->meta_title ?: $project->title,
            'url' => $canonical,
        ];

        if (is_string($description) && $description !== '') {
            $data['description'] = $description;
        }

        if ($image !== null) {
            $data['image'] = $image;
        }

        $address = array_filter([
            'streetAddress' => $project->location_address,
            'addressLocality' => $project->location_city,
            'addressRegion' => $project->location_area,
            'addressCountry' => $project->location_country,
        ], fn ($value): bool => is_string($value) && $value !== '');

        if ($address !== []) {
            $data['address'] = ['@type' => 'PostalAddress', ...$address];
        }

        if ($project->latitude !== null && $project->longitude !== null) {
            $data['geo'] = [
                '@type' => 'GeoCoordinates',
                'latitude' => (float) $project->latitude,
                'longitude' => (float) $project->longitude,
            ];
        }

        $offers = self::offerFromPlans($project, $canonical, $currency);
        if ($offers !== null) {
            $data['offers'] = $offers;
        }

        return $data;
    }

    /**
     * @return array<string, mixed>|null
     */
    private static function offerFromPlans(Project $project, string $canonical, ?string $currency): ?array
    {
        $prices = $project->pricingPlans
            ->pluck('total_price')
            ->filter(fn ($value): bool => $value !== null && (float) $value > 0)
            ->map(fn ($value): float => (float) $value);

        if ($prices->isEmpty()) {
            return null;
        }

        return [
            '@type' => 'Offer',
            'price' => $prices->min(),
            'priceCurrency' => $currency ?: config('projects.currency.code'),
            'availability' => 'https://schema.org/InStock',
            'url' => $canonical,
        ];
    }
}
