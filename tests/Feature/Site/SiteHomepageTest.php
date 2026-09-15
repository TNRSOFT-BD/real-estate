<?php

namespace Tests\Feature\Site;

use App\Models\Site\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SiteHomepageTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_guests_are_redirected(): void
    {
        $this->get(route('admin.site.homepage.edit'))->assertRedirect('/login');
    }

    public function test_non_admin_is_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get(route('admin.site.homepage.edit'))->assertForbidden();
    }

    public function test_admin_can_update_the_hero_video_quality(): void
    {
        $this->actingAs($this->admin())
            ->put(route('admin.site.homepage.update'), [
                'hero_video_quality' => 'best',
                'hero_video_enabled' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('site_settings', ['hero_video_quality' => 'best', 'hero_video_enabled' => true]);
    }

    public function test_admin_can_disable_the_hero_video(): void
    {
        $this->actingAs($this->admin())
            ->put(route('admin.site.homepage.update'), [
                'hero_video_quality' => 'good',
                'hero_video_enabled' => false,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('site_settings', ['hero_video_enabled' => false]);
    }

    public function test_admin_can_update_hero_content(): void
    {
        $this->actingAs($this->admin())
            ->put(route('admin.site.homepage.update'), [
                'hero_eyebrow' => 'Welcome',
                'hero_title' => 'New Heading',
                'hero_description' => 'A brand new description.',
                'hero_video_quality' => 'good',
                'hero_video_enabled' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('site_settings', [
            'hero_eyebrow' => 'Welcome',
            'hero_title' => 'New Heading',
            'hero_description' => 'A brand new description.',
        ]);
    }

    public function test_admin_can_upload_multiple_hero_images(): void
    {
        Storage::fake('public');

        $this->actingAs($this->admin())
            ->post(route('admin.site.homepage.images.store'), [
                'images' => [
                    UploadedFile::fake()->image('one.jpg', 1200, 800),
                    UploadedFile::fake()->image('two.jpg', 1200, 800),
                ],
            ])
            ->assertRedirect();

        $this->assertCount(2, SiteSetting::singleton()->hero_images);
    }

    public function test_deleting_a_hero_image_removes_the_file_from_storage(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('site/hero/a.jpg', 'x');
        Storage::disk('public')->put('site/hero/b.jpg', 'x');
        SiteSetting::singleton()->update(['hero_images' => ['site/hero/a.jpg', 'site/hero/b.jpg']]);

        $this->actingAs($this->admin())
            ->delete(route('admin.site.homepage.images.destroy'), ['path' => 'site/hero/b.jpg'])
            ->assertRedirect();

        $this->assertSame(['site/hero/a.jpg'], SiteSetting::singleton()->hero_images);
        Storage::disk('public')->assertMissing('site/hero/b.jpg');
        Storage::disk('public')->assertExists('site/hero/a.jpg');
    }

    public function test_admin_can_reorder_hero_images(): void
    {
        Storage::fake('public');
        SiteSetting::singleton()->update(['hero_images' => ['site/hero/a.jpg', 'site/hero/b.jpg']]);

        $this->actingAs($this->admin())
            ->patch(route('admin.site.homepage.images.reorder'), ['images' => ['site/hero/b.jpg', 'site/hero/a.jpg']])
            ->assertRedirect();

        $this->assertSame(['site/hero/b.jpg', 'site/hero/a.jpg'], SiteSetting::singleton()->hero_images);
    }

    public function test_hero_video_quality_is_validated(): void
    {
        $this->actingAs($this->admin())
            ->put(route('admin.site.homepage.update'), [
                'hero_video_quality' => 'ultra',
                'hero_video_enabled' => true,
            ])
            ->assertSessionHasErrors('hero_video_quality');
    }

    public function test_admin_can_set_a_hero_video_url(): void
    {
        $this->actingAs($this->admin())
            ->put(route('admin.site.homepage.update'), [
                'hero_video_source' => 'url',
                'hero_video_link' => 'https://cdn.example.com/hero.mp4',
                'hero_video_quality' => 'good',
                'hero_video_enabled' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('site_settings', [
            'hero_video_source' => 'url',
            'hero_video_link' => 'https://cdn.example.com/hero.mp4',
        ]);
    }

    public function test_admin_can_reset_the_hero_video_to_default(): void
    {
        SiteSetting::singleton()->update([
            'hero_video_source' => 'upload',
            'hero_video_url' => 'https://res.cloudinary.com/demo/video/upload/v1/old.mp4',
            'hero_video_public_id' => 'site/hero/old',
        ]);

        $this->actingAs($this->admin())
            ->put(route('admin.site.homepage.update'), [
                'hero_video_source' => 'default',
                'hero_video_quality' => 'good',
                'hero_video_enabled' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('site_settings', ['hero_video_source' => 'default']);
    }

    public function test_hero_video_signature_is_returned_when_configured(): void
    {
        config()->set('cloudinary.cloud_name', 'demo');
        config()->set('cloudinary.api_key', 'key');
        config()->set('cloudinary.api_secret', 'secret');

        $this->actingAs($this->admin())
            ->getJson(route('admin.site.homepage.video.signature'))
            ->assertOk()
            ->assertJsonStructure(['cloud_name', 'api_key', 'timestamp', 'folder', 'signature', 'upload_url'])
            ->assertJson([
                'cloud_name' => 'demo',
                'api_key' => 'key',
                'upload_url' => 'https://api.cloudinary.com/v1_1/demo/video/upload',
            ]);
    }

    public function test_saving_an_uploaded_hero_video_deletes_the_previous_from_cloudinary(): void
    {
        config()->set('cloudinary.cloud_name', 'demo');
        config()->set('cloudinary.api_key', 'key');
        config()->set('cloudinary.api_secret', 'secret');

        Http::fake([
            'api.cloudinary.com/v1_1/demo/video/destroy' => Http::response(['result' => 'ok'], 200),
        ]);

        SiteSetting::singleton()->update([
            'hero_video_source' => 'upload',
            'hero_video_url' => 'https://res.cloudinary.com/demo/video/upload/v1/old.mp4',
            'hero_video_public_id' => 'site/hero/old',
        ]);

        $this->actingAs($this->admin())
            ->post(route('admin.site.homepage.video.store'), [
                'url' => 'https://res.cloudinary.com/demo/video/upload/v1/new.mp4',
                'public_id' => 'site/hero/new',
            ])
            ->assertRedirect();

        $settings = SiteSetting::singleton();
        $this->assertSame('upload', $settings->hero_video_source);
        $this->assertSame('https://res.cloudinary.com/demo/video/upload/v1/new.mp4', $settings->hero_video_url);
        $this->assertSame('site/hero/new', $settings->hero_video_public_id);

        Http::assertSent(fn ($request): bool => str_contains($request->url(), '/video/destroy') && ($request['public_id'] ?? null) === 'site/hero/old');
    }
}
