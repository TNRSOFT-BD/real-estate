<?php

namespace Tests\Feature\Project;

use App\Models\Project\ProjectFloorPlan;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProjectFloorPlanTest extends ProjectTestCase
{
    public function test_admin_can_add_a_floor_plan(): void
    {
        Storage::fake('public');
        $project = $this->makeProject();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.floor-plans.store', $project), [
                'title' => 'Second Floor',
                'description' => 'Spacious layout',
                'image' => UploadedFile::fake()->image('plan.jpg', 800, 600),
                'total_area' => '2800 Sq. Ft',
                'bedrooms' => '150 Sq. Ft',
                'bathrooms' => '2',
                'balcony' => 'Allowed',
                'lounge' => '650 Sq. Ft',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('project_floor_plans', ['project_id' => $project->id, 'title' => 'Second Floor']);
    }

    public function test_title_and_image_are_required(): void
    {
        $project = $this->makeProject();

        $this->actingAs($this->admin())
            ->post(route('admin.projects.floor-plans.store', $project), [])
            ->assertSessionHasErrors(['title', 'image']);
    }

    public function test_admin_can_update_reorder_and_delete_floor_plans(): void
    {
        Storage::fake('public');
        $project = $this->makeProject();

        $first = ProjectFloorPlan::create(['project_id' => $project->id, 'title' => 'First', 'image_path' => 'a.jpg', 'sort_order' => 1]);
        $second = ProjectFloorPlan::create(['project_id' => $project->id, 'title' => 'Second', 'image_path' => 'b.jpg', 'sort_order' => 2]);

        $admin = $this->admin();

        $this->actingAs($admin)
            ->put(route('admin.projects.floor-plans.update', ['project' => $project->id, 'floorPlan' => $first->id]), [
                'title' => 'Ground Floor',
                'description' => 'Updated',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('project_floor_plans', ['id' => $first->id, 'title' => 'Ground Floor']);

        $this->actingAs($admin)
            ->patch(route('admin.projects.floor-plans.reorder', $project), ['ids' => [$second->id, $first->id]])
            ->assertRedirect();

        $this->assertSame(1, $second->fresh()->sort_order);
        $this->assertSame(2, $first->fresh()->sort_order);

        $this->actingAs($admin)
            ->delete(route('admin.projects.floor-plans.destroy', ['project' => $project->id, 'floorPlan' => $second->id]))
            ->assertRedirect();

        $this->assertDatabaseMissing('project_floor_plans', ['id' => $second->id]);
    }

    public function test_floor_plan_of_another_project_is_not_accessible(): void
    {
        $type = $this->makeType();
        $status = $this->makeStatus();

        $project = $this->makeProject(['project_type_id' => $type->id, 'project_status_id' => $status->id]);
        $other = $this->makeProject(['slug' => 'other-tower', 'title' => 'Other Tower', 'project_type_id' => $type->id, 'project_status_id' => $status->id]);

        $plan = ProjectFloorPlan::create(['project_id' => $other->id, 'title' => 'First', 'image_path' => 'a.jpg', 'sort_order' => 1]);

        $this->actingAs($this->admin())
            ->delete(route('admin.projects.floor-plans.destroy', ['project' => $project->id, 'floorPlan' => $plan->id]))
            ->assertNotFound();
    }
}
