<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Home\HomeAboutSetting;
use App\Models\Home\HomeAboutStat;
use Illuminate\Database\Seeder;

class HomeAboutSeeder extends Seeder
{
    public function run(): void
    {
        HomeAboutSetting::singleton()->update([
            'heading' => "We know every block because we've walked it.",
            'description' => '<p>For over eighteen years, our agents have matched families, first-time buyers, and investors with homes across the city — not by algorithm, but by knowing the neighborhoods, the schools, and often the sellers themselves. Real estate is personal, and we treat every closing that way.</p>',
            'badge_figure' => '98%',
            'badge_copy' => 'of clients refer us to someone they trust',
        ]);

        if (HomeAboutStat::query()->count() === 0) {
            $stats = [
                ['figure' => '18', 'label' => 'Years serving the city'],
                ['figure' => '1,240+', 'label' => 'Homes placed with families'],
                ['figure' => '4.9', 'label' => 'Average client rating'],
            ];

            foreach ($stats as $index => $stat) {
                HomeAboutStat::create([...$stat, 'sort_order' => $index + 1]);
            }
        }
    }
}
