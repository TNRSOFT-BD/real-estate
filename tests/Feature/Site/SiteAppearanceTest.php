<?php

namespace Tests\Feature\Site;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteAppearanceTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_guests_are_redirected(): void
    {
        $this->get(route('admin.site.appearance.edit'))->assertRedirect('/login');
    }

    public function test_non_admin_is_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get(route('admin.site.appearance.edit'))->assertForbidden();
    }

    public function test_admin_can_update_the_appearance(): void
    {
        $this->actingAs($this->admin())
            ->put(route('admin.site.appearance.update'), [
                'background_color' => '#FFFFFF',
                'theme_mode' => 'dark',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('site_settings', ['background_color' => '#FFFFFF', 'theme_mode' => 'dark']);
    }
}
