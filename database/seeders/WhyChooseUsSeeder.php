<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Home\WhyChooseUsFeature;
use App\Models\Home\WhyChooseUsSetting;
use Illuminate\Database\Seeder;

class WhyChooseUsSeeder extends Seeder
{
    public function run(): void
    {
        WhyChooseUsSetting::singleton()->update([
            'eyebrow' => 'Why Choose Us',
            'title' => 'Your Dream Home Our Commitment',
            'description' => 'We go beyond just selling properties. We build lasting relationships by offering quality, trust and exceptional service — because your future matters.',
        ]);

        if (WhyChooseUsFeature::query()->count() === 0) {
            $features = [
                [
                    'title' => 'Prime Location',
                    'description' => 'Close to schools, hospitals, shopping centers and key facilities. Everything you need is within reach.',
                    'icon' => 'MapPin',
                ],
                [
                    'title' => 'Trusted Developer',
                    'description' => 'Years of experience, a solid reputation and a commitment to quality in every project.',
                    'icon' => 'ShieldCheck',
                ],
                [
                    'title' => 'Quality Construction',
                    'description' => 'Built with durable materials and modern standards for long-lasting value and comfort.',
                    'icon' => 'Building2',
                ],
                [
                    'title' => 'Modern Amenities',
                    'description' => "More than a home, it's a lifestyle. Enjoy premium facilities designed for your convenience.",
                    'icon' => 'Star',
                ],
                [
                    'title' => 'Flexible Payment Plans',
                    'description' => 'Easy options for every stage of life. Your dream home is more affordable than you think.',
                    'icon' => 'CreditCard',
                ],
                [
                    'title' => 'Dedicated Support',
                    'description' => "We're with you, before and after purchase. Your satisfaction is our top priority.",
                    'icon' => 'Headset',
                ],
            ];

            foreach ($features as $index => $feature) {
                WhyChooseUsFeature::create([...$feature, 'sort_order' => $index + 1, 'is_active' => true]);
            }
        }
    }
}
