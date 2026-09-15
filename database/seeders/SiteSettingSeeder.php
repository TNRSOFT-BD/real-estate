<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Site\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::updateOrCreate(['id' => 1], [
            'background_color' => '#F4F2ED',
            'theme_mode' => 'auto',
            'hero_video_quality' => 'good',
            'hero_video_enabled' => true,
            'hero_eyebrow' => 'Excellence in Real Estate',
            'hero_title' => 'Crafting Iconic Landmarks & Luxury Living',
            'hero_description' => "Discover bespoke architectural designs and premium residential properties in the city's most prestigious locations.",
        ]);
    }
}
