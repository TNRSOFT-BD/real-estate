<?php

declare(strict_types=1);

namespace App\Services\Contact;

use App\DTOs\Contact\ContactLocationData;
use App\Models\Contact\ContactLocation;
use App\Repositories\Contracts\Contact\ContactLocationRepositoryInterface;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ContactLocationService
{
    public function __construct(
        private readonly ContactLocationRepositoryInterface $locationRepository,
        private readonly ContactPageService $pageService,
    ) {}

    public function create(ContactLocationData $data): ContactLocation
    {
        $location = $this->locationRepository->create($data->toArray());

        if ($data->isPrimary) {
            $this->setPrimary($location);
        }

        $this->pageService->invalidatePublicCache();

        return $location;
    }

    public function update(ContactLocation $location, ContactLocationData $data): ContactLocation
    {
        $location = $this->locationRepository->update($location, $data->toArray());

        if ($data->isPrimary) {
            $this->setPrimary($location);
        }

        $this->pageService->invalidatePublicCache();

        return $location;
    }

    public function delete(ContactLocation $location): void
    {
        DB::transaction(function () use ($location) {
            if ($location->is_primary) {
                $fallback = ContactLocation::query()
                    ->where('id', '!=', $location->id)
                    ->active()
                    ->ordered()
                    ->first();

                if ($fallback) {
                    $this->locationRepository->setPrimary($fallback);
                }
            }

            $this->locationRepository->delete($location);
        });

        $this->pageService->invalidatePublicCache();
    }

    public function setPrimary(ContactLocation $location): void
    {
        DB::transaction(function () use ($location) {
            $this->locationRepository->setPrimary($location);
        });

        $this->pageService->invalidatePublicCache();
    }

    /**
     * Parse a Google Maps URL / address search query into a location payload
     * when a provider integration is configured.
     */
    public function resolveGoogleMapsUrl(string $url): ?array
    {
        return $this->geocodeWithApi($url);
    }

    /**
     * Parse a Google Maps URL (including shortened goo.gl / maps.app short links)
     * into a location payload without relying on the geocoding API.
     */
    public function resolveGoogleMapsUrlFromLink(string $url): ?array
    {
        return $this->parseGoogleMapsUrl($url);
    }

    private function geocodeWithApi(string $url): ?array
    {
        if (empty(config('services.google_maps.api_key'))) {
            Log::info('Google Maps geocoding skipped: no API key configured');

            return null;
        }

        try {
            $client = new Client(['timeout' => 5]);

            $response = $client->get('https://maps.googleapis.com/maps/api/geocode/json', [
                'query' => [
                    'address' => $url,
                    'key' => config('services.google_maps.api_key'),
                ],
            ]);

            $payload = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR);

            if (($payload['status'] ?? '') !== 'OK' || empty($payload['results'])) {
                return null;
            }

            $result = $payload['results'][0];
            $placeId = $result['place_id'] ?? null;

            return [
                'formatted_address' => $result['formatted_address'] ?? null,
                'latitude' => $result['geometry']['location']['lat'] ?? null,
                'longitude' => $result['geometry']['location']['lng'] ?? null,
                'place_id' => $placeId,
                'google_maps_url' => $placeId
                    ? "https://www.google.com/maps/place/?q=place_id:{$placeId}"
                    : null,
                ...$this->buildAddressFromResult($result),
            ];
        } catch (\Throwable $e) {
            Log::warning('Google Maps geocoding failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Try to extract a place ID and coordinates from a Google Maps URL,
     * following shortened links (maps.app.goo.gl, goo.gl, g.co) to their target.
     */
    private function parseGoogleMapsUrl(string $url): ?array
    {
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        $target = $this->expandShortUrl($url) ?? $url;

        $host = (string) parse_url($target, PHP_URL_HOST);

        if (!str_contains($host, 'google')) {
            return null;
        }

        $query = [];
        $fragment = parse_url($target, PHP_URL_FRAGMENT);

        if ($fragment && str_contains($fragment, '=')) {
            parse_str($fragment, $query);
        }

        parse_str((string) parse_url($target, PHP_URL_QUERY), $query);

        $placeId = $query['place_id'] ?? null;

        if (!$placeId && isset($query['cid'])) {
            $placeId = 'cid:' . $query['cid'];
        }

        $coordinates = null;
        if (preg_match('/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,(\d+(?:\.\d+)?)z?)?/i', $target, $coordinateMatch)) {
            $coordinates = [
                'latitude' => (float) $coordinateMatch[1],
                'longitude' => (float) $coordinateMatch[2],
            ];
        }

        if (!$placeId && $coordinates) {
            return $coordinates + ['place_id' => null, 'google_maps_url' => null];
        }

        if ($placeId) {
            return [
                'place_id' => $placeId,
                'latitude' => $coordinates['latitude'] ?? null,
                'longitude' => $coordinates['longitude'] ?? null,
                'google_maps_url' => $this->normalizeGoogleMapsUrl($placeId),
            ];
        }

        return null;
    }

    /**
     * Follow redirects (e.g. maps.app.goo.gl short links) and return the final URL.
     */
    private function expandShortUrl(string $url): ?string
    {
        if (str_contains((string) parse_url($url, PHP_URL_HOST), 'google.com/maps')) {
            return null;
        }

        try {
            $client = new Client(['timeout' => 5, 'allow_redirects' => ['track_redirects' => true]]);

            $response = $client->get($url, [
                'headers' => ['User-Agent' => 'Mozilla/5.0 (compatible; opencode/1.0)'],
            ]);

            $history = (array) $response->getHeader('X-Guzzle-Redirect-History');

            return empty($history) ? null : (string) end($history);
        } catch (\Throwable $e) {
            Log::warning('Google Maps link expansion failed', ['error' => $e->getMessage()]);

            return null;
        }
    }

    private function normalizeGoogleMapsUrl(?string $placeId): ?string
    {
        if (!$placeId || str_starts_with($placeId, 'cid:')) {
            return null;
        }

        return "https://www.google.com/maps/place/?q=place_id:{$placeId}";
    }

    private function buildAddressFromResult(array $result): array
    {
        $address = [
            'street' => null,
            'city' => null,
            'state' => null,
            'country' => null,
            'postal_code' => null,
        ];

        foreach ($result['address_components'] ?? [] as $component) {
            $types = $component['types'] ?? [];

            if (in_array('street_number', $types, true)) {
                $address['street'] = trim(($address['street'] ?? '') . ' ' . ($component['long_name'] ?? ''));
            } elseif (in_array('route', $types, true)) {
                $address['street'] = trim(($address['street'] ?? '') . ' ' . ($component['long_name'] ?? ''));
            } elseif (in_array('locality', $types, true)) {
                $address['city'] = $component['long_name'] ?? null;
            } elseif (in_array('administrative_area_level_1', $types, true)) {
                $address['state'] = $component['short_name'] ?? null;
            } elseif (in_array('country', $types, true)) {
                $address['country'] = $component['long_name'] ?? null;
            } elseif (in_array('postal_code', $types, true)) {
                $address['postal_code'] = $component['long_name'] ?? null;
            }
        }

        return $address;
    }
}
