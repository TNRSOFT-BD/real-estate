<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Company\CompanyProfile;
use Illuminate\Database\Seeder;

class CompanyProfileSeeder extends Seeder
{
    public function run(): void
    {
        CompanyProfile::updateOrCreate(['id' => 1], [
            'name' => config('app.name', 'Laravel'),
            'tagline' => 'Design-led property development, delivered with clarity and care.',
            'logo' => null,
        ]);
    }
}
