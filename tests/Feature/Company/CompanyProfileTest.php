<?php

namespace Tests\Feature\Company;

use App\Models\Company\CompanyProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CompanyProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_update_the_company_profile(): void
    {
        $this->put(route('admin.about.company.update'), ['name' => 'X'])->assertRedirect('/login');
    }

    public function test_admin_can_update_name_tagline_logo_and_favicon(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->put(route('admin.about.company.update'), [
                'name' => 'Acme Realty',
                'tagline' => 'Building better.',
                'logo' => UploadedFile::fake()->image('logo.png', 200, 60),
                'favicon' => UploadedFile::fake()->image('favicon.png', 32, 32),
            ])
            ->assertRedirect();

        $profile = CompanyProfile::singleton();

        $this->assertSame('Acme Realty', $profile->name);
        $this->assertSame('Building better.', $profile->tagline);
        $this->assertNotNull($profile->logo);
        $this->assertNotNull($profile->favicon);
    }
}
