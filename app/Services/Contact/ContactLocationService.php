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
            ];
        } catch (\Throwable $e) {
            Log::warning('Google Maps geocoding failed', ['error' => $e->getMessage()]);

            return null;
        }
    }
}
