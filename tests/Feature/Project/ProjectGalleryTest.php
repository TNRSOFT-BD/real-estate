<?php

namespace Tests\Feature\Project;

use App\Models\Project\ProjectGallery;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProjectGalleryTest extends ProjectTestCase
{
    public function test_admin_can_upload_gallery_images(): void
    {
        Storage::fake('public');
        $project = $this->makeProject();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.gallery.store', $project), [
                'images' => [
                    UploadedFile::fake()->image('one.jpg', 100, 100),
                    UploadedFile::fake()->image('two.jpg', 100, 100),
                ],
                'types' => ['exterior', 'interior'],
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('project_galleries', 2);
    }

    public function test_images_are_required(): void
    {
        $project = $this->makeProject();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.gallery.store', $project), [])
            ->assertSessionHasErrors('images');
    }

    public function test_admin_can_update_metadata_and_reorder(): void
    {
        $project = $this->makeProject();

        $first = ProjectGallery::create(['project_id' => $project->id, 'image_path' => 'a.jpg', 'type' => 'exterior', 'sort_order' => 1, 'is_featured' => false]);
        $second = ProjectGallery::create(['project_id' => $project->id, 'image_path' => 'b.jpg', 'type' => 'interior', 'sort_order' => 2, 'is_featured' => false]);

        $admin = $this->admin();

        $this->actingAs($admin)
            ->put(route('admin.projects.gallery.update', ['project' => $project->id, 'gallery' => $first->id]), [
                'type' => 'floor_plan',
                'caption' => 'Ground floor',
                'alt_text' => 'Ground floor plan',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('project_galleries', ['id' => $first->id, 'type' => 'floor_plan', 'caption' => 'Ground floor']);

        $this->actingAs($admin)
            ->patch(route('admin.projects.gallery.reorder', $project), ['ids' => [$second->id, $first->id]])
            ->assertRedirect();

        $this->assertSame(1, $second->fresh()->sort_order);
        $this->assertSame(2, $first->fresh()->sort_order);
    }

    public function test_admin_can_delete_a_gallery_image(): void
    {
        $project = $this->makeProject();
        $gallery = ProjectGallery::create(['project_id' => $project->id, 'image_path' => 'a.jpg', 'type' => 'exterior', 'sort_order' => 1, 'is_featured' => false]);

        $this->actingAs($this->admin())
            ->delete(route('admin.projects.gallery.destroy', ['project' => $project->id, 'gallery' => $gallery->id]))
            ->assertRedirect();

        $this->assertDatabaseMissing('project_galleries', ['id' => $gallery->id]);
    }
}
