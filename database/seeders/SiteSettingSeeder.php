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
        ]);
    }
}
