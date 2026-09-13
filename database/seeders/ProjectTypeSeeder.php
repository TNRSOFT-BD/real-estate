<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Project\ProjectType;
use Illuminate\Database\Seeder;

class ProjectTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Residential', 'slug' => 'residential', 'icon' => 'Home'],
            ['name' => 'Commercial', 'slug' => 'commercial', 'icon' => 'Building2'],
            ['name' => 'Mixed Use', 'slug' => 'mixed-use', 'icon' => 'Layers'],
            ['name' => 'Apartment', 'slug' => 'apartment', 'icon' => 'Building'],
            ['name' => 'Villa', 'slug' => 'villa', 'icon' => 'House'],
            ['name' => 'Office', 'slug' => 'office', 'icon' => 'Briefcase'],
            ['name' => 'Land', 'slug' => 'land', 'icon' => 'Map'],
        ];

        foreach ($types as $index => $type) {
            ProjectType::updateOrCreate(
                ['slug' => $type['slug']],
                [
                    'name' => $type['name'],
                    'icon' => $type['icon'],
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ],
            );
        }
    }
}
