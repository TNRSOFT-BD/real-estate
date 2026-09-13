<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Project\ProjectStatus;
use Illuminate\Database\Seeder;

class ProjectStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            ['name' => 'Upcoming', 'slug' => 'upcoming', 'color' => '#3b82f6'],
            ['name' => 'Ongoing', 'slug' => 'ongoing', 'color' => '#f59e0b'],
            ['name' => 'Completed', 'slug' => 'completed', 'color' => '#10b981'],
            ['name' => 'Sold Out', 'slug' => 'sold-out', 'color' => '#ef4444'],
            ['name' => 'Coming Soon', 'slug' => 'coming-soon', 'color' => '#8b5cf6'],
            ['name' => 'Archived', 'slug' => 'archived', 'color' => '#6b7280'],
        ];

        foreach ($statuses as $index => $status) {
            ProjectStatus::updateOrCreate(
                ['slug' => $status['slug']],
                [
                    'name' => $status['name'],
                    'color' => $status['color'],
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );
        }
    }
}
