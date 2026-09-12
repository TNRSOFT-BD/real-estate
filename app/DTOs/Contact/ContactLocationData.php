<?php

declare(strict_types=1);

namespace App\DTOs\Contact;

final class ContactLocationData
{
    public function __construct(
        public readonly string $name,
        public readonly string $address,
        public readonly ?string $description,
        public readonly ?string $city,
        public readonly ?string $state,
        public readonly ?string $country,
        public readonly ?string $postalCode,
        public readonly ?float $latitude,
        public readonly ?float $longitude,
        public readonly ?string $googleMapsUrl,
        public readonly ?string $placeId,
        public readonly ?string $phone,
        public readonly ?string $email,
        public readonly ?string $businessHours,
        public readonly bool $isPrimary,
        public readonly int $sortOrder,
        public readonly bool $isActive,
    ) {}

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'address' => $this->address,
            'description' => $this->description,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'postal_code' => $this->postalCode,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'google_maps_url' => $this->googleMapsUrl,
            'place_id' => $this->placeId,
            'phone' => $this->phone,
            'email' => $this->email,
            'business_hours' => $this->businessHours,
            'is_primary' => $this->isPrimary,
            'sort_order' => $this->sortOrder,
            'is_active' => $this->isActive,
        ];
    }
}
