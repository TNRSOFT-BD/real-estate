<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Project\Project;
use App\Models\Project\ProjectFloorPlan;
use App\Models\Project\ProjectGallery;
use App\Models\Project\ProjectPricingPlan;
use App\Models\Project\ProjectStatus;
use App\Models\Project\ProjectType;
use Illuminate\Database\Seeder;

/**
 * Populates the public portfolio with realistic, production-like demo data.
 *
 * The seeder is additive: it creates any missing project and only fills fields
 * or relations that are still empty, so re-running it never wipes content that
 * was edited through the admin panel.
 */
class ProjectSeeder extends Seeder
{
    /**
     * Existing uploads for these slugs are replaced because the stored image is
     * a placeholder that does not represent the property.
     *
     * @var list<string>
     */
    private const REPLACE_IMAGE_SLUGS = ['green-valley-villas'];

    public function run(): void
    {
        $types = ProjectType::query()->pluck('id', 'slug');
        $statuses = ProjectStatus::query()->pluck('id', 'slug');

        foreach ($this->projects() as $definition) {
            $this->seedProject($definition, $types->all(), $statuses->all());
        }
    }

    /**
     * @param  array<string, mixed>  $definition
     * @param  array<string, int>  $types
     * @param  array<string, int>  $statuses
     */
    private function seedProject(array $definition, array $types, array $statuses): void
    {
        $slug = $definition['slug'];

        $typeId = $types[$definition['type']] ?? null;
        $statusId = $statuses[$definition['status']] ?? null;

        if ($typeId === null || $statusId === null) {
            return;
        }

        $project = Project::withTrashed()->firstOrNew(['slug' => $slug]);

        $isNew = ! $project->exists;

        if ($isNew) {
            $project->fill([
                'title' => $definition['title'],
                'project_code' => $definition['project_code'],
                'project_type_id' => $typeId,
                'project_status_id' => $statusId,
                'is_published' => true,
                'is_featured' => $definition['is_featured'],
                'sort_order' => $definition['sort_order'],
                'published_at' => now()->subDays($definition['published_days_ago'] ?? 0),
            ]);
        }

        $project->deleted_at = null;

        foreach ($definition['content'] as $key => $value) {
            if ($project->{$key} === null || $project->{$key} === '' || $project->{$key} === []) {
                $project->{$key} = $value;
            }
        }

        if ($isNew) {
            $project->project_type_id = $typeId;
            $project->project_status_id = $statusId;
        }

        if ($project->hero_banner === null || $project->hero_banner === '' || in_array($slug, self::REPLACE_IMAGE_SLUGS, true)) {
            $project->hero_banner = $definition['content']['hero_banner'];
            $project->hero_banner_alt = $definition['content']['hero_banner_alt'];
        }

        $project->save();

        $this->seedGalleries($project, $definition['galleries'] ?? []);
        $this->seedPricingPlans($project, $definition['pricing'] ?? []);
        $this->seedFloorPlans($project, $definition['floor_plans'] ?? []);
    }

    /**
     * @param  array<int, array<string, mixed>>  $galleries
     */
    private function seedGalleries(Project $project, array $galleries): void
    {
        if ($galleries === [] || $project->galleries()->exists()) {
            return;
        }

        foreach ($galleries as $index => $gallery) {
            ProjectGallery::create([
                'project_id' => $project->id,
                'image_path' => $gallery['image_path'],
                'type' => $gallery['type'],
                'caption' => $gallery['caption'] ?? null,
                'alt_text' => $gallery['alt_text'] ?? null,
                'sort_order' => $index,
                'is_featured' => (bool) ($gallery['is_featured'] ?? false),
            ]);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $plans
     */
    private function seedPricingPlans(Project $project, array $plans): void
    {
        if ($plans === []) {
            return;
        }

        // Only skip when the project already has fully populated plans.
        $hasPopulatedPlans = $project->pricingPlans()->whereNotNull('total_price')->exists();

        if ($hasPopulatedPlans) {
            return;
        }

        $project->pricingPlans()->delete();

        foreach ($plans as $index => $plan) {
            ProjectPricingPlan::create([
                'project_id' => $project->id,
                'unit_type' => $plan['unit_type'],
                'size_sqft' => $plan['size_sqft'] ?? null,
                'price_per_sqft' => $plan['price_per_sqft'] ?? null,
                'total_price' => $plan['total_price'] ?? null,
                'booking_money' => $plan['booking_money'] ?? null,
                'down_payment_percentage' => $plan['down_payment_percentage'] ?? null,
                'installment_plan' => $plan['installment_plan'] ?? null,
                'status' => $plan['status'] ?? 'available',
                'sort_order' => $index,
                'is_featured' => (bool) ($plan['is_featured'] ?? false),
            ]);
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $plans
     */
    private function seedFloorPlans(Project $project, array $plans): void
    {
        if ($plans === [] || $project->floorPlans()->exists()) {
            return;
        }

        foreach ($plans as $index => $plan) {
            ProjectFloorPlan::create([
                'project_id' => $project->id,
                'title' => $plan['title'],
                'description' => $plan['description'] ?? null,
                'image_path' => $plan['image_path'],
                'total_area' => $plan['total_area'] ?? null,
                'bedrooms' => $plan['bedrooms'] ?? null,
                'bathrooms' => $plan['bathrooms'] ?? null,
                'balcony' => $plan['balcony'] ?? null,
                'lounge' => $plan['lounge'] ?? null,
                'sort_order' => $index,
            ]);
        }
    }

    private function image(string $id, int $width = 1600): string
    {
        return "https://images.unsplash.com/photo-{$id}?q=80&w={$width}&auto=format&fit=crop";
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private function projects(): array
    {
        return [
            'sunrise-residency' => [
                'title' => 'Sunrise Residency',
                'slug' => 'sunrise-residency',
                'project_code' => 'SR-APT-001',
                'type' => 'apartment',
                'status' => 'ongoing',
                'is_featured' => true,
                'sort_order' => 1,
                'published_days_ago' => 2,
                'content' => [
                    'short_description' => 'Sun-drenched apartments with panoramic city views in the heart of Gulshan.',
                    'overview' => $this->overview([
                        'Sunrise Residency is a 15-storey residential tower designed around light, air and calm. Every apartment opens onto a private balcony, framing the skyline of Gulshan while keeping the roar of the city at a comfortable distance.',
                        'The building sits on a landscaped podium with a resort-style pool, a fully equipped gym and a rooftop garden. Wide lobbies, high-speed lifts and thoughtful landscaping make coming home feel like arriving at a hotel.',
                        'Built to modern seismic and energy standards, the development pairs RCC-framed structure with solar water heating, rainwater harvesting and 100% generator backup.',
                    ]),
                    'location_address' => 'Plot 12, Road 5, Gulshan Avenue',
                    'location_area' => 'Gulshan 1',
                    'location_city' => 'Dhaka',
                    'location_country' => 'Bangladesh',
                    'google_map_url' => 'https://maps.google.com/?q=Gulshan+1+Dhaka',
                    'latitude' => 23.7806,
                    'longitude' => 90.4153,
                    'total_land_area' => '1.2 acres',
                    'total_units' => 240,
                    'number_of_floors' => 15,
                    'number_of_buildings' => 1,
                    'units_per_floor' => 16,
                    'handover_date' => '2027-06-30',
                    'property_features' => $this->residentialFeatures(),
                    'amenities' => $this->residentialAmenities(),
                    'hero_banner' => $this->image('1545324418-cc1a3fa10c00'),
                    'hero_banner_alt' => 'Sunrise Residency residential tower at dusk',
                    'at_a_glance_image' => $this->image('1600585154340-be6161a56a0c'),
                    'at_a_glance_image_alt' => 'Bright living room inside Sunrise Residency',
                    'promo_video_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                    'legal_approval_no' => 'RAJUK/BA-1234/2024',
                    'meta_title' => 'Sunrise Residency — Luxury Apartments in Gulshan, Dhaka',
                    'meta_description' => 'Discover 2, 3 and 4-bedroom apartments at Sunrise Residency, Gulshan 1. Modern amenities, prime location and flexible payment plans.',
                    'meta_keywords' => 'Sunrise Residency, apartments in Gulshan, Dhaka apartments, luxury flats Dhaka',
                    'og_title' => 'Sunrise Residency — Luxury Apartments in Gulshan',
                    'og_description' => 'Sun-drenched apartments with panoramic city views in the heart of Gulshan.',
                ],
                'galleries' => [
                    ['image_path' => $this->image('1545324418-cc1a3fa10c00'), 'type' => 'exterior', 'caption' => 'Tower facade', 'alt_text' => 'Sunrise Residency tower facade'],
                    ['image_path' => $this->image('1600585154340-be6161a56a0c'), 'type' => 'interior', 'caption' => 'Light-filled living room', 'alt_text' => 'Living room'],
                    ['image_path' => $this->image('1600566753086-00f18fb6b3ea'), 'type' => 'interior', 'caption' => 'Open-plan kitchen', 'alt_text' => 'Kitchen'],
                    ['image_path' => $this->image('1600607687939-ce8a6c25118c'), 'type' => 'interior', 'caption' => 'Master bedroom', 'alt_text' => 'Bedroom'],
                    ['image_path' => $this->image('1571896349842-33c89424de2d'), 'type' => 'exterior', 'caption' => 'Rooftop lounge', 'alt_text' => 'Rooftop'],
                    ['image_path' => $this->image('1600210492486-724fe5c67fb0'), 'type' => 'interior', 'caption' => 'Guest bathroom', 'alt_text' => 'Bathroom'],
                ],
                'pricing' => [
                    ['unit_type' => 'Studio', 'size_sqft' => 550, 'price_per_sqft' => 8500, 'total_price' => 4675000, 'booking_money' => 200000, 'down_payment_percentage' => 20, 'installment_plan' => '36 monthly installments', 'status' => 'available'],
                    ['unit_type' => '2 Bed Apartment', 'size_sqft' => 1120, 'price_per_sqft' => 7800, 'total_price' => 8736000, 'booking_money' => 300000, 'down_payment_percentage' => 20, 'installment_plan' => '48 monthly installments', 'status' => 'available', 'is_featured' => true],
                    ['unit_type' => '3 Bed Apartment', 'size_sqft' => 1450, 'price_per_sqft' => 8500, 'total_price' => 12325000, 'booking_money' => 500000, 'down_payment_percentage' => 25, 'installment_plan' => '48 monthly installments', 'status' => 'available'],
                    ['unit_type' => '4 Bed Duplex', 'size_sqft' => 2200, 'price_per_sqft' => 9200, 'total_price' => 20240000, 'booking_money' => 800000, 'down_payment_percentage' => 25, 'installment_plan' => '60 monthly installments', 'status' => 'available'],
                    ['unit_type' => 'Penthouse', 'size_sqft' => 3200, 'price_per_sqft' => 12000, 'total_price' => 38400000, 'booking_money' => 1500000, 'down_payment_percentage' => 30, 'installment_plan' => '60 monthly installments', 'status' => 'sold_out'],
                ],
                'floor_plans' => $this->apartmentFloorPlans(),
            ],
            'green-valley-villas' => [
                'title' => 'Green Valley Villas',
                'slug' => 'green-valley-villas',
                'project_code' => 'SR-VIL-002',
                'type' => 'villa',
                'status' => 'ongoing',
                'is_featured' => true,
                'sort_order' => 2,
                'published_days_ago' => 6,
                'content' => [
                    'short_description' => 'A gated enclave of 24 contemporary villas wrapped in landscaped gardens.',
                    'overview' => $this->overview([
                        'Green Valley Villas is a limited collection of just 24 detached and semi-detached homes set within a private, gated enclave. Each plot is oriented to maximise natural light and garden views, with double-height living spaces and private terraces.',
                        'Residents share a clubhouse, swimming pool, children\u2019s play area and miles of tree-lined walking trails. The community is designed as a quiet pocket of green, minutes from schools, hospitals and the expressway.',
                        'Every villa is finished to a specification usually reserved for bespoke homes: imported stone counters, engineered hardwood floors, VRV air conditioning and provision for a private lift.',
                    ]),
                    'location_address' => 'Block C, Bashundhara Residential Area',
                    'location_area' => 'Bashundhara R/A',
                    'location_city' => 'Dhaka',
                    'location_country' => 'Bangladesh',
                    'google_map_url' => 'https://maps.google.com/?q=Bashundhara+Residential+Area+Dhaka',
                    'latitude' => 23.8223,
                    'longitude' => 90.4260,
                    'total_land_area' => '6.5 acres',
                    'total_units' => 24,
                    'number_of_floors' => 3,
                    'number_of_buildings' => 24,
                    'units_per_floor' => 1,
                    'handover_date' => '2026-12-31',
                    'property_features' => [
                        ['key' => 'Plot size', 'value' => '5–8 katha', 'icon' => 'LandPlot'],
                        ['key' => 'Villas', 'value' => '24 units', 'icon' => 'House'],
                        ['key' => 'Ceiling height', 'value' => 'Double height living', 'icon' => 'Building'],
                        ['key' => 'Parking', 'value' => '2 cars per villa', 'icon' => 'Car'],
                        ['key' => 'Garden', 'value' => 'Private lawn', 'icon' => 'Trees'],
                        ['key' => 'Structure', 'value' => 'RCC framed', 'icon' => 'HardHat'],
                        ['key' => 'Power backup', 'value' => 'Full generator', 'icon' => 'Zap'],
                        ['key' => 'Eco features', 'value' => 'Solar + rainwater harvesting', 'icon' => 'Leaf'],
                    ],
                    'amenities' => $this->villaAmenities(),
                    'hero_banner' => $this->image('1613977257363-707ba9348227'),
                    'hero_banner_alt' => 'Green Valley Villas contemporary villa exterior',
                    'at_a_glance_image' => $this->image('1580587771525-78b9dba3b914'),
                    'at_a_glance_image_alt' => 'Green Valley Villas garden and facade',
                    'promo_video_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                    'legal_approval_no' => 'RAJUK/BA-0871/2024',
                    'meta_title' => 'Green Valley Villas — Gated Villas in Bashundhara, Dhaka',
                    'meta_description' => 'A limited collection of 24 contemporary villas with private gardens, clubhouse and resort amenities in Bashundhara, Dhaka.',
                    'meta_keywords' => 'Green Valley Villas, villas in Dhaka, Bashundhara villas, gated community Dhaka',
                    'og_title' => 'Green Valley Villas — A Gated Enclave of 24 Villas',
                    'og_description' => 'Contemporary villas wrapped in landscaped gardens in Bashundhara, Dhaka.',
                ],
                'galleries' => [
                    ['image_path' => $this->image('1613977257363-707ba9348227'), 'type' => 'exterior', 'caption' => 'Villa facade', 'alt_text' => 'Villa facade'],
                    ['image_path' => $this->image('1580587771525-78b9dba3b914'), 'type' => 'exterior', 'caption' => 'Private garden', 'alt_text' => 'Garden'],
                    ['image_path' => $this->image('1600596542815-ffad4c1539a9'), 'type' => 'exterior', 'caption' => 'Evening view', 'alt_text' => 'Villa at dusk'],
                    ['image_path' => $this->image('1600210492486-724fe5c67fb0'), 'type' => 'interior', 'caption' => 'Living room', 'alt_text' => 'Living room'],
                    ['image_path' => $this->image('1600566753190-17f0baa2a6c3'), 'type' => 'interior', 'caption' => 'Dining area', 'alt_text' => 'Dining area'],
                    ['image_path' => $this->image('1600607687920-4e2a09cf159d'), 'type' => 'interior', 'caption' => 'Master suite', 'alt_text' => 'Master suite'],
                ],
                'pricing' => [
                    ['unit_type' => 'Type A — 4 Bed Villa', 'size_sqft' => 3200, 'price_per_sqft' => 11000, 'total_price' => 35200000, 'booking_money' => 2000000, 'down_payment_percentage' => 25, 'installment_plan' => '48 monthly installments', 'status' => 'available'],
                    ['unit_type' => 'Type B — 5 Bed Villa', 'size_sqft' => 4100, 'price_per_sqft' => 12000, 'total_price' => 49200000, 'booking_money' => 3000000, 'down_payment_percentage' => 25, 'installment_plan' => '60 monthly installments', 'status' => 'available', 'is_featured' => true],
                    ['unit_type' => 'Type C — Corner Villa', 'size_sqft' => 4600, 'price_per_sqft' => 13500, 'total_price' => 62100000, 'booking_money' => 4000000, 'down_payment_percentage' => 30, 'installment_plan' => '60 monthly installments', 'status' => 'sold_out'],
                ],
                'floor_plans' => [
                    ['title' => 'Ground Floor', 'description' => 'Formal lounge, guest bedroom, family dining and an open kitchen that opens to the private garden.', 'image_path' => $this->image('1503387762-592deb58ef4e'), 'total_area' => '1,250 sqft', 'bedrooms' => '1', 'bathrooms' => '1', 'balcony' => 'Yes', 'lounge' => 'Formal + family'],
                    ['title' => 'First Floor', 'description' => 'Master suite with walk-in closet and two additional bedrooms arranged around a light well.', 'image_path' => $this->image('1581094794329-c8112a89af12'), 'total_area' => '1,150 sqft', 'bedrooms' => '3', 'bathrooms' => '3', 'balcony' => 'Yes', 'lounge' => 'Family'],
                    ['title' => 'Roof Terrace', 'description' => 'Landscaped roof terrace with an outdoor lounge, kitchenette and panoramic views.', 'image_path' => $this->image('1503387762-592deb58ef4e'), 'total_area' => '800 sqft', 'bedrooms' => '—', 'bathrooms' => '1', 'balcony' => 'Yes', 'lounge' => 'Outdoor'],
                ],
            ],
            'mcp-lakeside-tower' => [
                'title' => 'MCP Lakeside Tower Updated',
                'slug' => 'mcp-lakeside-tower',
                'project_code' => 'SR-APT-003',
                'type' => 'apartment',
                'status' => 'ongoing',
                'is_featured' => true,
                'sort_order' => 3,
                'published_days_ago' => 9,
                'content' => [
                    'short_description' => 'Waterfront apartments overlooking the lake, minutes from the business district.',
                    'overview' => $this->overview([
                        'MCP Lakeside Tower is a 16-storey residential address that makes the most of its rare waterfront setting. Floor-to-ceiling glazing frames the lake from every principal room, while deep balconies create shaded outdoor rooms.',
                        'The podium holds a lap pool, a residents\u2019 lounge and a landscaped deck that steps down toward the water\u2019s edge. A dedicated pedestrian promenade connects the tower to the surrounding park.',
                        'Interiors are delivered to a turnkey standard with imported kitchen cabinetry, stone counters and VRV air conditioning. Buyers can select from a curated palette of finishes.',
                    ]),
                    'location_address' => 'Road 11, Banani Lakefront',
                    'location_area' => 'Banani',
                    'location_city' => 'Dhaka',
                    'location_country' => 'Bangladesh',
                    'google_map_url' => 'https://maps.google.com/?q=Banani+Dhaka',
                    'latitude' => 23.7937,
                    'longitude' => 90.4066,
                    'total_land_area' => '1.8 acres',
                    'total_units' => 288,
                    'number_of_floors' => 16,
                    'number_of_buildings' => 1,
                    'units_per_floor' => 18,
                    'handover_date' => '2027-03-31',
                    'property_features' => $this->residentialFeatures(),
                    'amenities' => $this->residentialAmenities(),
                    'hero_banner' => $this->image('1600607687939-ce8a6c25118c'),
                    'hero_banner_alt' => 'MCP Lakeside Tower waterfront apartments',
                    'at_a_glance_image' => $this->image('1502672260266-1c1ef2d93688'),
                    'at_a_glance_image_alt' => 'MCP Lakeside Tower interior',
                    'promo_video_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                    'legal_approval_no' => 'RAJUK/BA-1180/2024',
                    'meta_title' => 'MCP Lakeside Tower — Waterfront Apartments in Banani',
                    'meta_description' => 'Lakefront apartments at MCP Lakeside Tower, Banani. Floor-to-ceiling views, resort amenity deck and flexible payment plans.',
                    'meta_keywords' => 'MCP Lakeside Tower, Banani apartments, waterfront apartments Dhaka, lake view flats',
                    'og_title' => 'MCP Lakeside Tower — Waterfront Living in Banani',
                    'og_description' => 'Waterfront apartments overlooking the lake, minutes from the business district.',
                ],
                'galleries' => [
                    ['image_path' => $this->image('1502672260266-1c1ef2d93688'), 'type' => 'interior', 'caption' => 'Living area', 'alt_text' => 'Living area'],
                    ['image_path' => $this->image('1600607687920-4e2a09cf159d'), 'type' => 'interior', 'caption' => 'Bedroom', 'alt_text' => 'Bedroom'],
                    ['image_path' => $this->image('1600585154526-990dced4db0d'), 'type' => 'interior', 'caption' => 'Kitchen', 'alt_text' => 'Kitchen'],
                    ['image_path' => $this->image('1600047509807-ba8f99d2cdde'), 'type' => 'interior', 'caption' => 'Lobby', 'alt_text' => 'Lobby'],
                ],
                'pricing' => [
                    ['unit_type' => '2 Bed Apartment', 'size_sqft' => 1250, 'price_per_sqft' => 9500, 'total_price' => 11875000, 'booking_money' => 500000, 'down_payment_percentage' => 20, 'installment_plan' => '48 monthly installments', 'status' => 'available'],
                    ['unit_type' => '3 Bed Apartment', 'size_sqft' => 1680, 'price_per_sqft' => 10500, 'total_price' => 17640000, 'booking_money' => 700000, 'down_payment_percentage' => 25, 'installment_plan' => '48 monthly installments', 'status' => 'available', 'is_featured' => true],
                    ['unit_type' => 'Lake-view Duplex', 'size_sqft' => 2600, 'price_per_sqft' => 13000, 'total_price' => 33800000, 'booking_money' => 1500000, 'down_payment_percentage' => 30, 'installment_plan' => '60 monthly installments', 'status' => 'available'],
                ],
                'floor_plans' => $this->apartmentFloorPlans(),
            ],
            'mcp-verify-tower' => [
                'title' => 'MCP Verify Tower Updated',
                'slug' => 'mcp-verify-tower',
                'project_code' => 'SR-RES-004',
                'type' => 'residential',
                'status' => 'upcoming',
                'is_featured' => false,
                'sort_order' => 4,
                'published_days_ago' => 14,
                'content' => [
                    'short_description' => 'An upcoming residential tower engineered for efficiency, daylight and long-term value.',
                    'overview' => $this->overview([
                        'MCP Verify Tower is our next-generation residential product: a compact, highly efficient tower that delivers generous, daylight-filled homes on a modest footprint.',
                        'The design pairs a slim floor plate with a central service core, so every unit enjoys cross ventilation and an external view. Shared amenities are stacked vertically to free the ground plane for gardens.',
                        'Construction begins later this year, with an allocated handover in 2028. Early reservation buyers benefit from launch pricing and a choice of preferred floors.',
                    ]),
                    'location_address' => 'Sector 4, Uttara Model Town',
                    'location_area' => 'Uttara',
                    'location_city' => 'Dhaka',
                    'location_country' => 'Bangladesh',
                    'google_map_url' => 'https://maps.google.com/?q=Uttara+Model+Town+Dhaka',
                    'latitude' => 23.8759,
                    'longitude' => 90.3795,
                    'total_land_area' => '0.9 acres',
                    'total_units' => 176,
                    'number_of_floors' => 14,
                    'number_of_buildings' => 1,
                    'units_per_floor' => 8,
                    'handover_date' => '2028-06-30',
                    'property_features' => $this->residentialFeatures(),
                    'amenities' => $this->residentialAmenities(),
                    'hero_banner' => $this->image('1560448204-e02f11c3d0e2'),
                    'hero_banner_alt' => 'MCP Verify Tower residential building',
                    'at_a_glance_image' => $this->image('1522708323590-d24dbb6b02675'),
                    'at_a_glance_image_alt' => 'MCP Verify Tower living space',
                    'legal_approval_no' => 'RAJUK/BA-1402/2025',
                    'meta_title' => 'MCP Verify Tower — Upcoming Apartments in Uttara',
                    'meta_description' => 'Reserve an apartment at MCP Verify Tower, Uttara. Efficient layouts, cross ventilation and launch pricing.',
                    'meta_keywords' => 'MCP Verify Tower, Uttara apartments, upcoming project Dhaka',
                    'og_title' => 'MCP Verify Tower — Upcoming Apartments in Uttara',
                    'og_description' => 'An upcoming residential tower engineered for efficiency and daylight.',
                ],
                'galleries' => [
                    ['image_path' => $this->image('1560448204-e02f11c3d0e2'), 'type' => 'exterior', 'caption' => 'Tower concept', 'alt_text' => 'Tower concept'],
                    ['image_path' => $this->image('1522708323590-d24dbb6b02675'), 'type' => 'interior', 'caption' => 'Living room concept', 'alt_text' => 'Living room'],
                    ['image_path' => $this->image('1560185007-c5ca9d2c014d'), 'type' => 'interior', 'caption' => 'Kitchen concept', 'alt_text' => 'Kitchen'],
                    ['image_path' => $this->image('1600573472592-401b489a3cdc'), 'type' => 'interior', 'caption' => 'Bedroom concept', 'alt_text' => 'Bedroom'],
                ],
                'pricing' => [
                    ['unit_type' => '2 Bedroom Apartment', 'size_sqft' => 980, 'price_per_sqft' => 7200, 'total_price' => 7056000, 'booking_money' => 300000, 'down_payment_percentage' => 20, 'installment_plan' => '48 monthly installments', 'status' => 'available'],
                    ['unit_type' => '3 Bedroom Apartment', 'size_sqft' => 1320, 'price_per_sqft' => 7600, 'total_price' => 10032000, 'booking_money' => 400000, 'down_payment_percentage' => 20, 'installment_plan' => '48 monthly installments', 'status' => 'available', 'is_featured' => true],
                    ['unit_type' => '3 Bed Corner Unit', 'size_sqft' => 1450, 'price_per_sqft' => 8000, 'total_price' => 11600000, 'booking_money' => 500000, 'down_payment_percentage' => 25, 'installment_plan' => '60 monthly installments', 'status' => 'available'],
                ],
                'floor_plans' => $this->apartmentFloorPlans(),
            ],
            'riverside-heights' => [
                'title' => 'Riverside Heights',
                'slug' => 'riverside-heights',
                'project_code' => 'SR-APT-005',
                'type' => 'apartment',
                'status' => 'completed',
                'is_featured' => true,
                'sort_order' => 5,
                'published_days_ago' => 20,
                'content' => [
                    'short_description' => 'A completed, fully occupied waterfront community with a vibrant riverside promenade.',
                    'overview' => $this->overview([
                        'Riverside Heights is a completed three-tower community that has become a landmark on the city\u2019s eastern waterfront. The development is fully occupied and known for its generous public realm, mature landscaping and riverfront promenade.',
                        'Each tower is served by its own lobby and concierge, while residents share a 25-metre pool, a gym, tennis courts and a clubhouse that hosts everything from yoga classes to community dinners.',
                        'With only a small number of resale units available, Riverside Heights represents a rare opportunity to own within one of the city\u2019s most established addresses.',
                    ]),
                    'location_address' => '1 Riverside Drive, Keraniganj',
                    'location_area' => 'Keraniganj',
                    'location_city' => 'Dhaka',
                    'location_country' => 'Bangladesh',
                    'google_map_url' => 'https://maps.google.com/?q=Keraniganj+Dhaka',
                    'latitude' => 23.6985,
                    'longitude' => 90.4089,
                    'total_land_area' => '7.4 acres',
                    'total_units' => 620,
                    'number_of_floors' => 18,
                    'number_of_buildings' => 3,
                    'units_per_floor' => 12,
                    'handover_date' => '2023-11-30',
                    'property_features' => $this->residentialFeatures(),
                    'amenities' => $this->residentialAmenities(),
                    'hero_banner' => $this->image('1512917774080-9991f1c4c750'),
                    'hero_banner_alt' => 'Riverside Heights waterfront residential community',
                    'at_a_glance_image' => $this->image('1600585154340-be6161a56a0c'),
                    'at_a_glance_image_alt' => 'Riverside Heights interior',
                    'promo_video_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                    'legal_approval_no' => 'RAJUK/BA-0455/2021',
                    'meta_title' => 'Riverside Heights — Completed Waterfront Apartments',
                    'meta_description' => 'Own a resale apartment at Riverside Heights, a completed waterfront community with resort amenities and a riverside promenade.',
                    'meta_keywords' => 'Riverside Heights, completed apartments Dhaka, waterfront community, resale apartments',
                    'og_title' => 'Riverside Heights — Completed Waterfront Community',
                    'og_description' => 'A completed, fully occupied waterfront community with a vibrant promenade.',
                ],
                'galleries' => [
                    ['image_path' => $this->image('1512917774080-9991f1c4c750'), 'type' => 'exterior', 'caption' => 'Riverside community', 'alt_text' => 'Riverside community'],
                    ['image_path' => $this->image('1600585154340-be6161a56a0c'), 'type' => 'interior', 'caption' => 'Living room', 'alt_text' => 'Living room'],
                    ['image_path' => $this->image('1600121848594-d8644e57abab'), 'type' => 'exterior', 'caption' => 'Riverfront promenade', 'alt_text' => 'Promenade'],
                    ['image_path' => $this->image('1600566752355-35792bedcfea'), 'type' => 'interior', 'caption' => 'Kitchen', 'alt_text' => 'Kitchen'],
                    ['image_path' => $this->image('1600210492486-724fe5c67fb0'), 'type' => 'interior', 'caption' => 'Bathroom', 'alt_text' => 'Bathroom'],
                ],
                'pricing' => [
                    ['unit_type' => '2 Bed Apartment', 'size_sqft' => 1180, 'price_per_sqft' => 9000, 'total_price' => 10620000, 'booking_money' => 500000, 'down_payment_percentage' => 20, 'installment_plan' => 'Ready — bank finance available', 'status' => 'available'],
                    ['unit_type' => '3 Bed Apartment', 'size_sqft' => 1560, 'price_per_sqft' => 9800, 'total_price' => 15288000, 'booking_money' => 700000, 'down_payment_percentage' => 25, 'installment_plan' => 'Ready — bank finance available', 'status' => 'available', 'is_featured' => true],
                    ['unit_type' => '4 Bed River Suite', 'size_sqft' => 2100, 'price_per_sqft' => 11500, 'total_price' => 24150000, 'booking_money' => 1000000, 'down_payment_percentage' => 30, 'installment_plan' => 'Ready — bank finance available', 'status' => 'sold_out'],
                ],
                'floor_plans' => $this->apartmentFloorPlans(),
            ],
            'meridian-business-bay' => [
                'title' => 'Meridian Business Bay',
                'slug' => 'meridian-business-bay',
                'project_code' => 'SR-COM-006',
                'type' => 'office',
                'status' => 'upcoming',
                'is_featured' => true,
                'sort_order' => 6,
                'published_days_ago' => 4,
                'content' => [
                    'short_description' => 'Grade-A office floors and a retail podium in the heart of the central business district.',
                    'overview' => $this->overview([
                        'Meridian Business Bay is a Grade-A commercial development offering column-free office floors, a double-height retail podium and generous landscaped setbacks.',
                        'The tower targets LEED Gold certification with a high-performance facade, efficient VRF cooling and a rooftop solar array. Six high-speed lifts and a smart access-control system keep the building moving.',
                        'Floors are available for lease and strata sale from 4,000 sqft, with pre-let opportunities for anchor tenants on the retail podium.',
                    ]),
                    'location_address' => 'Kemal Ataturk Avenue, Banani',
                    'location_area' => 'Banani',
                    'location_city' => 'Dhaka',
                    'location_country' => 'Bangladesh',
                    'google_map_url' => 'https://maps.google.com/?q=Kemal+Ataturk+Avenue+Banani+Dhaka',
                    'latitude' => 23.7944,
                    'longitude' => 90.4039,
                    'total_land_area' => '2.6 acres',
                    'total_units' => 96,
                    'number_of_floors' => 12,
                    'number_of_buildings' => 2,
                    'units_per_floor' => 8,
                    'handover_date' => '2027-12-31',
                    'property_features' => $this->commercialFeatures(),
                    'amenities' => $this->commercialAmenities(),
                    'hero_banner' => $this->image('1486406146926-c627a92ad1ab'),
                    'hero_banner_alt' => 'Meridian Business Bay commercial tower',
                    'at_a_glance_image' => $this->image('1497366754035-f200968a6e72'),
                    'at_a_glance_image_alt' => 'Modern office interior',
                    'legal_approval_no' => 'RAJUK/BA-1509/2025',
                    'meta_title' => 'Meridian Business Bay — Grade-A Office Space in Banani',
                    'meta_description' => 'Grade-A office floors, retail podium and LEED Gold design at Meridian Business Bay, Banani.',
                    'meta_keywords' => 'Meridian Business Bay, office space Dhaka, commercial property Banani, grade A office',
                    'og_title' => 'Meridian Business Bay — Grade-A Office Space',
                    'og_description' => 'Column-free office floors and a retail podium in the central business district.',
                ],
                'galleries' => [
                    ['image_path' => $this->image('1486406146926-c627a92ad1ab'), 'type' => 'exterior', 'caption' => 'Tower facade', 'alt_text' => 'Tower facade'],
                    ['image_path' => $this->image('1497366754035-f200968a6e72'), 'type' => 'interior', 'caption' => 'Office floor', 'alt_text' => 'Office floor'],
                    ['image_path' => $this->image('1524758631624-e2822e304c36'), 'type' => 'interior', 'caption' => 'Meeting room', 'alt_text' => 'Meeting room'],
                    ['image_path' => $this->image('1497366811353-6870744d04b2'), 'type' => 'interior', 'caption' => 'Co-working lounge', 'alt_text' => 'Lounge'],
                ],
                'pricing' => [
                    ['unit_type' => 'Office floor — 4,000 sqft', 'size_sqft' => 4000, 'price_per_sqft' => 16000, 'total_price' => 64000000, 'booking_money' => 3000000, 'down_payment_percentage' => 30, 'installment_plan' => 'Lease or strata sale', 'status' => 'available'],
                    ['unit_type' => 'Office floor — 6,500 sqft', 'size_sqft' => 6500, 'price_per_sqft' => 15500, 'total_price' => 100750000, 'booking_money' => 5000000, 'down_payment_percentage' => 30, 'installment_plan' => 'Lease or strata sale', 'status' => 'available', 'is_featured' => true],
                    ['unit_type' => 'Retail unit — Ground', 'size_sqft' => 2200, 'price_per_sqft' => 28000, 'total_price' => 61600000, 'booking_money' => 4000000, 'down_payment_percentage' => 35, 'installment_plan' => 'Lease or strata sale', 'status' => 'unavailable'],
                ],
                'floor_plans' => [
                    ['title' => 'Typical Office Floor', 'description' => 'Column-free floor plate with a central core, raised flooring and dedicated AHU zones.', 'image_path' => $this->image('1503387762-592deb58ef4e'), 'total_area' => '4,000 sqft', 'bedrooms' => '—', 'bathrooms' => '4', 'balcony' => '—', 'lounge' => 'Open plan'],
                    ['title' => 'Retail Podium', 'description' => 'Double-height retail units with dedicated frontage, service access and signage rights.', 'image_path' => $this->image('1581094794329-c8112a89af12'), 'total_area' => '2,200 sqft', 'bedrooms' => '—', 'bathrooms' => '2', 'balcony' => '—', 'lounge' => 'Open plan'],
                ],
            ],
            'lakeview-township' => [
                'title' => 'Lakeview Township',
                'slug' => 'lakeview-township',
                'project_code' => 'SR-MIX-007',
                'type' => 'mixed-use',
                'status' => 'ongoing',
                'is_featured' => true,
                'sort_order' => 7,
                'published_days_ago' => 12,
                'content' => [
                    'short_description' => 'A mixed-use township combining residences, retail and green public space around a central lake.',
                    'overview' => $this->overview([
                        'Lakeview Township is a master-planned, mixed-use neighbourhood organised around a restored central lake. Residential blocks, a retail high street, offices and a school share a continuous network of parks and pedestrian streets.',
                        'The masterplan prioritises walking and cycling over cars, with generous green corridors and a waterfront promenade that doubles as public space for the whole district.',
                        'Phase one includes 480 apartments, 60,000 sqft of retail and a lakeside community centre. Later phases add a boutique hotel and serviced residences.',
                    ]),
                    'location_address' => 'Purbachal New Town, Sector 9',
                    'location_area' => 'Purbachal',
                    'location_city' => 'Dhaka',
                    'location_country' => 'Bangladesh',
                    'google_map_url' => 'https://maps.google.com/?q=Purbachal+New+Town+Dhaka',
                    'latitude' => 23.8388,
                    'longitude' => 90.5744,
                    'total_land_area' => '22 acres',
                    'total_units' => 480,
                    'number_of_floors' => 14,
                    'number_of_buildings' => 6,
                    'units_per_floor' => 10,
                    'handover_date' => '2028-03-31',
                    'property_features' => [
                        ['key' => 'Masterplan', 'value' => '22 acres', 'icon' => 'LandPlot'],
                        ['key' => 'Central lake', 'value' => '3.5 acres', 'icon' => 'Waves'],
                        ['key' => 'Green corridor', 'value' => '40% open space', 'icon' => 'Trees'],
                        ['key' => 'Retail', 'value' => '60,000 sqft', 'icon' => 'Store'],
                        ['key' => 'Parking', 'value' => '2 levels underground', 'icon' => 'Car'],
                        ['key' => 'Structure', 'value' => 'RCC framed', 'icon' => 'HardHat'],
                        ['key' => 'Power backup', 'value' => '100% generator', 'icon' => 'Zap'],
                        ['key' => 'Connectivity', 'value' => 'Expressway 5 min', 'icon' => 'Compass'],
                    ],
                    'amenities' => array_merge($this->residentialAmenities(), [
                        ['name' => 'Retail High Street', 'icon' => 'Store'],
                        ['name' => 'Lakeside Promenade', 'icon' => 'Flower2'],
                        ['name' => 'School & Daycare', 'icon' => 'School'],
                        ['name' => 'Medical Centre', 'icon' => 'Hospital'],
                    ]),
                    'hero_banner' => $this->image('1449844908441-8829872d2607'),
                    'hero_banner_alt' => 'Lakeview Township masterplan and residences',
                    'at_a_glance_image' => $this->image('1600585154340-be6161a56a0c'),
                    'at_a_glance_image_alt' => 'Lakeview Township interior',
                    'promo_video_url' => 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
                    'legal_approval_no' => 'RAJUK/BA-1333/2025',
                    'meta_title' => 'Lakeview Township — Mixed-Use Living in Purbachal',
                    'meta_description' => 'A 22-acre mixed-use township with a central lake, retail high street, residences and 40% open space in Purbachal.',
                    'meta_keywords' => 'Lakeview Township, Purbachal apartments, mixed use development Dhaka, township',
                    'og_title' => 'Lakeview Township — A Mixed-Use Neighbourhood in Purbachal',
                    'og_description' => 'Residences, retail and green public space around a central lake.',
                ],
                'galleries' => [
                    ['image_path' => $this->image('1449844908441-8829872d2607'), 'type' => 'exterior', 'caption' => 'Masterplan view', 'alt_text' => 'Masterplan'],
                    ['image_path' => $this->image('1600585154340-be6161a56a0c'), 'type' => 'interior', 'caption' => 'Residence living room', 'alt_text' => 'Living room'],
                    ['image_path' => $this->image('1600585154526-990dced4db0d'), 'type' => 'interior', 'caption' => 'Kitchen', 'alt_text' => 'Kitchen'],
                    ['image_path' => $this->image('1493809842364-78817add7ffb'), 'type' => 'interior', 'caption' => 'Lounge', 'alt_text' => 'Lounge'],
                    ['image_path' => $this->image('1576941089067-2de3c901e126'), 'type' => 'exterior', 'caption' => 'Lakeside promenade', 'alt_text' => 'Promenade'],
                ],
                'pricing' => [
                    ['unit_type' => '2 Bed Apartment', 'size_sqft' => 1100, 'price_per_sqft' => 7800, 'total_price' => 8580000, 'booking_money' => 350000, 'down_payment_percentage' => 20, 'installment_plan' => '48 monthly installments', 'status' => 'available'],
                    ['unit_type' => '3 Bed Apartment', 'size_sqft' => 1520, 'price_per_sqft' => 8200, 'total_price' => 12464000, 'booking_money' => 500000, 'down_payment_percentage' => 25, 'installment_plan' => '48 monthly installments', 'status' => 'available', 'is_featured' => true],
                    ['unit_type' => '4 Bed Apartment', 'size_sqft' => 2050, 'price_per_sqft' => 8800, 'total_price' => 18040000, 'booking_money' => 800000, 'down_payment_percentage' => 25, 'installment_plan' => '60 monthly installments', 'status' => 'available'],
                ],
                'floor_plans' => $this->apartmentFloorPlans(),
            ],
        ];
    }

    /**
     * @param  list<string>  $paragraphs
     */
    private function overview(array $paragraphs): string
    {
        $body = implode('', array_map(fn (string $paragraph): string => "<p>{$paragraph}</p>", $paragraphs));

        return "<h3>About the development</h3>{$body}";
    }

    /**
     * @return list<array{key: string, value: string, icon: string}>
     */
    private function residentialFeatures(): array
    {
        return [
            ['key' => 'Building height', 'value' => 'G+14', 'icon' => 'Building'],
            ['key' => 'Ceiling height', 'value' => '10 ft', 'icon' => 'House'],
            ['key' => 'Parking ratio', 'value' => '1 : 1.2', 'icon' => 'Car'],
            ['key' => 'High-speed lifts', 'value' => '4 lifts', 'icon' => 'ArrowUpDown'],
            ['key' => 'Structure', 'value' => 'RCC framed', 'icon' => 'HardHat'],
            ['key' => 'Water supply', 'value' => 'WASA + reserve tank', 'icon' => 'Droplets'],
            ['key' => 'Power backup', 'value' => '100% generator', 'icon' => 'Zap'],
            ['key' => 'Eco features', 'value' => 'Solar + rainwater harvesting', 'icon' => 'Leaf'],
        ];
    }

    /**
     * @return list<array{name: string, icon: string}>
     */
    private function residentialAmenities(): array
    {
        return [
            ['name' => 'Swimming Pool', 'icon' => 'Waves'],
            ['name' => 'Gymnasium', 'icon' => 'Dumbbell'],
            ['name' => 'Rooftop Garden', 'icon' => 'Trees'],
            ['name' => 'Community Hall', 'icon' => 'Users'],
            ['name' => "Children's Play Area", 'icon' => 'Baby'],
            ['name' => '24/7 Security', 'icon' => 'ShieldCheck'],
            ['name' => 'CCTV Surveillance', 'icon' => 'Camera'],
            ['name' => 'Power Backup', 'icon' => 'Zap'],
            ['name' => 'Cafe & Lounge', 'icon' => 'Coffee'],
            ['name' => 'Indoor Games', 'icon' => 'BellRing'],
            ['name' => 'Jogging Track', 'icon' => 'Bike'],
            ['name' => 'Landscaped Garden', 'icon' => 'Flower2'],
            ['name' => 'Visitor Parking', 'icon' => 'Car'],
            ['name' => 'Waste Management', 'icon' => 'Recycle'],
        ];
    }

    /**
     * @return list<array{name: string, icon: string}>
     */
    private function villaAmenities(): array
    {
        return [
            ['name' => 'Clubhouse', 'icon' => 'Building2'],
            ['name' => 'Swimming Pool', 'icon' => 'Waves'],
            ['name' => 'Gymnasium', 'icon' => 'Dumbbell'],
            ['name' => 'Children\u2019s Play Area', 'icon' => 'Baby'],
            ['name' => 'Jogging Trail', 'icon' => 'Bike'],
            ['name' => 'Landscaped Gardens', 'icon' => 'Flower2'],
            ['name' => 'Gated Community', 'icon' => 'Lock'],
            ['name' => '24/7 Security', 'icon' => 'ShieldCheck'],
            ['name' => 'CCTV Surveillance', 'icon' => 'Camera'],
            ['name' => 'Power Backup', 'icon' => 'Zap'],
            ['name' => 'Visitor Parking', 'icon' => 'Car'],
            ['name' => 'Waste Management', 'icon' => 'Recycle'],
        ];
    }

    /**
     * @return list<array{key: string, value: string, icon: string}>
     */
    private function commercialFeatures(): array
    {
        return [
            ['key' => 'Building height', 'value' => 'G+11', 'icon' => 'Building2'],
            ['key' => 'Floor plate', 'value' => '4,000–6,500 sqft', 'icon' => 'LandPlot'],
            ['key' => 'Parking ratio', 'value' => '1 : 2', 'icon' => 'Car'],
            ['key' => 'Lifts', 'value' => '6 high-speed', 'icon' => 'ArrowUpDown'],
            ['key' => 'Structure', 'value' => 'RCC framed', 'icon' => 'HardHat'],
            ['key' => 'Power backup', 'value' => '100% + UPS', 'icon' => 'Zap'],
            ['key' => 'Certification', 'value' => 'LEED Gold target', 'icon' => 'Leaf'],
            ['key' => 'Connectivity', 'value' => 'Metro 5 min', 'icon' => 'TrainFront'],
        ];
    }

    /**
     * @return list<array{name: string, icon: string}>
     */
    private function commercialAmenities(): array
    {
        return [
            ['name' => 'High-speed Elevators', 'icon' => 'ArrowUpDown'],
            ['name' => 'Central Air Conditioning', 'icon' => 'AirVent'],
            ['name' => 'Fibre Internet', 'icon' => 'Wifi'],
            ['name' => '24/7 Security', 'icon' => 'ShieldCheck'],
            ['name' => 'CCTV Surveillance', 'icon' => 'Camera'],
            ['name' => 'Backup Generator', 'icon' => 'Zap'],
            ['name' => 'Ample Parking', 'icon' => 'Car'],
            ['name' => 'Food Court', 'icon' => 'UtensilsCrossed'],
            ['name' => 'Conference Facilities', 'icon' => 'Users'],
            ['name' => 'Retail Podium', 'icon' => 'Store'],
            ['name' => 'Prayer Room', 'icon' => 'Church'],
            ['name' => 'Waste Management', 'icon' => 'Recycle'],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function apartmentFloorPlans(): array
    {
        return [
            ['title' => '2 Bed Apartment', 'description' => 'Efficient two-bedroom layout with an open living and dining area, a private balcony and a compact utility zone.', 'image_path' => $this->image('1503387762-592deb58ef4e'), 'total_area' => '1,120 sqft', 'bedrooms' => '2', 'bathrooms' => '2', 'balcony' => 'Yes', 'lounge' => 'Living + dining'],
            ['title' => '3 Bed Apartment', 'description' => 'Corner three-bedroom home with cross ventilation, a dedicated study nook and a larger wraparound balcony.', 'image_path' => $this->image('1581094794329-c8112a89af12'), 'total_area' => '1,450 sqft', 'bedrooms' => '3', 'bathrooms' => '3', 'balcony' => 'Yes', 'lounge' => 'Living + family'],
            ['title' => 'Penthouse', 'description' => 'Duplex penthouse with a double-height living room, private roof terrace and panoramic city views.', 'image_path' => $this->image('1503387762-592deb58ef4e'), 'total_area' => '3,200 sqft', 'bedrooms' => '4', 'bathrooms' => '4', 'balcony' => 'Yes', 'lounge' => 'Formal + family'],
        ];
    }
}
