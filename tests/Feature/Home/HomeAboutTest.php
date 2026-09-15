<?php

namespace Tests\Feature\Home;

use App\Models\Home\HomeAboutSetting;
use App\Models\Home\HomeAboutStat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HomeAboutTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_guests_are_redirected(): void
    {
        $this->get(route('admin.home-about.edit'))->assertRedirect('/login');
    }

    public function test_non_admin_is_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get(route('admin.home-about.edit'))->assertForbidden();
    }

    public function test_admin_can_update_settings_and_description_is_sanitized(): void
    {
        $this->actingAs($this->admin())
            ->put(route('admin.home-about.update'), [
                'heading' => 'Our story',
                'description' => '<p>Hello <script>alert(1)</script>world</p>',
                'badge_figure' => '98%',
                'badge_copy' => 'refer us',
            ])
            ->assertRedirect();

        $settings = HomeAboutSetting::singleton();
        $this->assertSame('Our story', $settings->heading);
        $this->assertStringNotContainsString('<script', (string) $settings->description);
        $this->assertStringContainsString('world', (string) $settings->description);
    }

    public function test_uploading_a_main_image_replaces_the_previous_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('site/about/old.jpg', 'x');
        HomeAboutSetting::singleton()->update(['main_image' => 'site/about/old.jpg']);

        $this->actingAs($this->admin())
            ->put(route('admin.home-about.update'), [
                'main_image' => UploadedFile::fake()->image('new.jpg', 600, 800),
            ])
            ->assertRedirect();

        Storage::disk('public')->assertMissing('site/about/old.jpg');
        $this->assertNotSame('site/about/old.jpg', HomeAboutSetting::singleton()->main_image);
    }

    public function test_admin_can_manage_stats(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('admin.home-about.stats.store'), ['figure' => '18', 'label' => 'Years'])
            ->assertRedirect();

        $stat = HomeAboutStat::query()->firstOrFail();

        $this->actingAs($admin)
            ->put(route('admin.home-about.stats.update', $stat), ['figure' => '20', 'label' => 'Years of service'])
            ->assertRedirect();

        $this->assertDatabaseHas('home_about_stats', ['id' => $stat->id, 'figure' => '20']);

        $second = HomeAboutStat::create(['figure' => '2', 'label' => 'Second', 'sort_order' => 2]);

        $this->actingAs($admin)
            ->patch(route('admin.home-about.stats.reorder'), ['ids' => [$second->id, $stat->id]])
            ->assertRedirect();

        $this->assertSame(1, $second->fresh()->sort_order);

        $this->actingAs($admin)
            ->delete(route('admin.home-about.stats.destroy', $stat))
            ->assertRedirect();

        $this->assertDatabaseMissing('home_about_stats', ['id' => $stat->id]);
    }

    public function test_home_page_includes_the_about_data(): void
    {
        HomeAboutSetting::singleton()->update(['heading' => 'Dynamic heading']);
        HomeAboutStat::create(['figure' => '18', 'label' => 'Years', 'sort_order' => 1]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->where('about.heading', 'Dynamic heading')
                ->has('about.stats', 1)
                ->where('about.stats.0.figure', '18')
            );
    }
}
