<?php

namespace Tests\Feature\Home;

use App\Models\Home\WhyChooseUsFeature;
use App\Models\Home\WhyChooseUsSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WhyChooseUsTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_guests_are_redirected(): void
    {
        $this->get(route('admin.why-choose-us.edit'))->assertRedirect('/login');
    }

    public function test_non_admin_is_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get(route('admin.why-choose-us.edit'))->assertForbidden();
    }

    public function test_admin_can_update_settings(): void
    {
        $this->actingAs($this->admin())
            ->put(route('admin.why-choose-us.update'), [
                'eyebrow' => 'Reasons',
                'title' => 'Built on trust',
                'description' => 'Why buyers choose us.',
            ])
            ->assertRedirect();

        $settings = WhyChooseUsSetting::singleton();
        $this->assertSame('Reasons', $settings->eyebrow);
        $this->assertSame('Built on trust', $settings->title);
    }

    public function test_admin_can_manage_features(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('admin.why-choose-us.features.store'), [
                'title' => 'Prime Location',
                'description' => 'Close to everything.',
                'icon' => 'MapPin',
            ])
            ->assertRedirect();

        $feature = WhyChooseUsFeature::query()->firstOrFail();
        $this->assertSame(1, $feature->sort_order);
        $this->assertTrue($feature->is_active);

        $this->actingAs($admin)
            ->put(route('admin.why-choose-us.features.update', $feature), [
                'title' => 'Great Location',
                'description' => 'Close to everything.',
                'icon' => 'Compass',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('why_choose_us_features', ['id' => $feature->id, 'title' => 'Great Location', 'icon' => 'Compass']);

        $this->actingAs($admin)
            ->patch(route('admin.why-choose-us.features.toggle', $feature))
            ->assertRedirect();

        $this->assertFalse($feature->fresh()->is_active);

        $second = WhyChooseUsFeature::create(['title' => 'Second', 'sort_order' => 2]);

        $this->actingAs($admin)
            ->patch(route('admin.why-choose-us.features.reorder'), ['ids' => [$second->id, $feature->id]])
            ->assertRedirect();

        $this->assertSame(1, $second->fresh()->sort_order);

        $this->actingAs($admin)
            ->delete(route('admin.why-choose-us.features.destroy', $feature))
            ->assertRedirect();

        $this->assertDatabaseMissing('why_choose_us_features', ['id' => $feature->id]);
    }

    public function test_home_page_includes_only_active_features(): void
    {
        WhyChooseUsSetting::singleton()->update(['title' => 'Dynamic heading']);
        WhyChooseUsFeature::create(['title' => 'Visible', 'sort_order' => 1, 'is_active' => true]);
        WhyChooseUsFeature::create(['title' => 'Hidden', 'sort_order' => 2, 'is_active' => false]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->where('whyChooseUs.title', 'Dynamic heading')
                ->has('whyChooseUs.features', 1)
                ->where('whyChooseUs.features.0.title', 'Visible')
            );
    }
}
