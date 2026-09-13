<?php

namespace Tests\Feature\Project;

use App\Models\Project\Project;
use App\Models\User;
use App\Services\Project\ProjectSeoService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProjectCrudTest extends ProjectTestCase
{
    public function test_guests_are_redirected(): void
    {
        $this->get(route('admin.projects.index'))->assertRedirect('/login');
    }

    public function test_non_admin_is_forbidden(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->get(route('admin.projects.index'))->assertForbidden();
    }

    public function test_admin_can_create_a_project(): void
    {
        $type = $this->makeType();
        $status = $this->makeStatus();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.store'), [
                'title' => 'Skyline Tower',
                'project_type_id' => $type->id,
                'project_status_id' => $status->id,
                'is_published' => true,
                'is_featured' => false,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('projects', ['slug' => 'skyline-tower', 'is_published' => true]);
    }

    public function test_duplicate_titles_get_a_unique_slug(): void
    {
        $type = $this->makeType();
        $status = $this->makeStatus();

        $this->makeProject(['slug' => 'skyline-tower', 'project_type_id' => $type->id, 'project_status_id' => $status->id]);

        $this->actingAs($this->admin())->post(route('admin.projects.store'), [
            'title' => 'Skyline Tower',
            'project_type_id' => $type->id,
            'project_status_id' => $status->id,
        ]);

        $this->assertDatabaseHas('projects', ['slug' => 'skyline-tower-2']);
    }

    public function test_title_is_required(): void
    {
        $type = $this->makeType();
        $status = $this->makeStatus();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.store'), ['project_type_id' => $type->id, 'project_status_id' => $status->id])
            ->assertSessionHasErrors('title');
    }

    public function test_inactive_type_is_rejected_for_new_projects(): void
    {
        $type = $this->makeType(['is_active' => false]);
        $status = $this->makeStatus();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.store'), [
                'title' => 'Blocked',
                'project_type_id' => $type->id,
                'project_status_id' => $status->id,
            ])
            ->assertSessionHasErrors('project_type_id');
    }

    public function test_inactive_type_remains_valid_when_editing_same_project(): void
    {
        $type = $this->makeType(['is_active' => false]);
        $status = $this->makeStatus();
        $project = $this->makeProject(['project_type_id' => $type->id, 'project_status_id' => $status->id]);

        $this->actingAs($this->admin())
            ->put(route('admin.projects.update', $project), [
                'title' => 'Skyline Tower Updated',
                'project_type_id' => $type->id,
                'project_status_id' => $status->id,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'title' => 'Skyline Tower Updated']);
    }

    public function test_publish_unpublish_and_feature_toggle(): void
    {
        $admin = $this->admin();
        $project = $this->makeProject();

        $this->actingAs($admin)->patch(route('admin.projects.publish', $project))->assertRedirect();
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'is_published' => true]);

        $this->actingAs($admin)->patch(route('admin.projects.unpublish', $project))->assertRedirect();
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'is_published' => false]);

        $this->actingAs($admin)->patch(route('admin.projects.feature', $project))->assertRedirect();
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'is_featured' => true]);
    }

    public function test_google_maps_url_is_validated(): void
    {
        $type = $this->makeType();
        $status = $this->makeStatus();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.store'), [
                'title' => 'Bad Map',
                'project_type_id' => $type->id,
                'project_status_id' => $status->id,
                'google_map_url' => 'https://example.com/not-maps',
            ])
            ->assertSessionHasErrors('google_map_url');

        $this->actingAs($this->admin())
            ->post(route('admin.projects.store'), [
                'title' => 'Good Map',
                'project_type_id' => $type->id,
                'project_status_id' => $status->id,
                'google_map_url' => 'https://maps.app.goo.gl/btPbKGAcaEZLPJum8',
            ])
            ->assertSessionHasNoErrors();
    }

    public function test_seo_falls_back_to_hero_banner_and_title(): void
    {
        $project = $this->makeProject(['title' => 'Skyline Tower', 'hero_banner' => 'projects/hero.jpg']);

        $seo = app(ProjectSeoService::class)->build($project);

        $this->assertSame('Skyline Tower', $seo['title']);
        $this->assertSame('projects/hero.jpg', $seo['og_image']);
        $this->assertSame('projects/hero.jpg', $seo['twitter_image']);
    }

    public function test_features_and_amenities_with_icons_are_persisted(): void
    {
        $type = $this->makeType();
        $status = $this->makeStatus();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.store'), [
                'title' => 'Icon Project',
                'project_type_id' => $type->id,
                'project_status_id' => $status->id,
                'property_features' => [
                    ['key' => 'Building height', 'value' => 'G+10', 'icon' => 'Building2'],
                ],
                'amenities' => [
                    ['name' => 'Swimming Pool', 'icon' => 'Waves'],
                    ['name' => 'Parking', 'icon' => ''],
                ],
            ])
            ->assertSessionHasNoErrors();

        $project = Project::where('slug', 'icon-project')->firstOrFail();

        $this->assertSame(
            [['key' => 'Building height', 'value' => 'G+10', 'icon' => 'Building2']],
            $project->property_features,
        );

        $this->assertSame(
            [
                ['name' => 'Swimming Pool', 'icon' => 'Waves'],
                ['name' => 'Parking', 'icon' => null],
            ],
            $project->amenities,
        );
    }

    public function test_replacing_the_hero_banner_deletes_the_previous_file(): void
    {
        Storage::fake('public');

        $admin = $this->admin();
        $type = $this->makeType();
        $status = $this->makeStatus();

        $this->actingAs($admin)
            ->post(route('admin.projects.store'), [
                'title' => 'Hero Replace',
                'project_type_id' => $type->id,
                'project_status_id' => $status->id,
                'hero_banner' => UploadedFile::fake()->image('first.jpg', 120, 80),
            ])
            ->assertSessionHasNoErrors();

        $project = Project::where('slug', 'hero-replace')->firstOrFail();
        $firstPath = $project->hero_banner;
        Storage::disk('public')->assertExists($firstPath);

        $this->actingAs($admin)
            ->put(route('admin.projects.update', $project), [
                'title' => 'Hero Replace',
                'project_type_id' => $type->id,
                'project_status_id' => $status->id,
                'hero_banner' => UploadedFile::fake()->image('second.jpg', 120, 80),
            ])
            ->assertSessionHasNoErrors();

        $project->refresh();

        $this->assertNotSame($firstPath, $project->hero_banner);
        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($project->hero_banner);
    }

    public function test_admin_can_soft_delete_a_project(): void
    {
        $admin = $this->admin();
        $project = $this->makeProject();

        $this->actingAs($admin)
            ->delete(route('admin.projects.destroy', $project))
            ->assertRedirect(route('admin.projects.index'));

        $this->assertSoftDeleted('projects', ['id' => $project->id]);
    }
}
