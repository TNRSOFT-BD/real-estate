<?php

namespace Tests\Feature\Project;

class ProjectTypeCrudTest extends ProjectTestCase
{
    public function test_guests_are_redirected(): void
    {
        $this->get(route('admin.project-types.index'))->assertRedirect('/login');
    }

    public function test_admin_can_create_a_type(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.project-types.store'), ['name' => 'Commercial', 'is_active' => true])
            ->assertRedirect(route('admin.project-types.index'));

        $this->assertDatabaseHas('project_types', ['slug' => 'commercial']);
    }

    public function test_admin_can_update_a_type(): void
    {
        $type = $this->makeType();

        $this->actingAs($this->admin())
            ->put(route('admin.project-types.update', $type), ['name' => 'Residential Updated', 'is_active' => true])
            ->assertRedirect();

        $this->assertDatabaseHas('project_types', ['id' => $type->id, 'name' => 'Residential Updated']);
    }

    public function test_toggle_changes_active_state(): void
    {
        $type = $this->makeType(['is_active' => true]);

        $this->actingAs($this->admin())->patch(route('admin.project-types.toggle', $type))->assertRedirect();

        $this->assertDatabaseHas('project_types', ['id' => $type->id, 'is_active' => false]);
    }

    public function test_delete_is_blocked_when_in_use(): void
    {
        $type = $this->makeType();
        $this->makeProject(['project_type_id' => $type->id]);

        $this->actingAs($this->admin())
            ->delete(route('admin.project-types.destroy', $type))
            ->assertSessionHas('error');

        $this->assertDatabaseHas('project_types', ['id' => $type->id]);
    }

    public function test_delete_is_allowed_when_unused(): void
    {
        $type = $this->makeType();

        $this->actingAs($this->admin())
            ->delete(route('admin.project-types.destroy', $type))
            ->assertRedirect(route('admin.project-types.index'));

        $this->assertDatabaseMissing('project_types', ['id' => $type->id]);
    }

    public function test_reassign_moves_projects_then_allows_delete(): void
    {
        $admin = $this->admin();
        $from = $this->makeType(['slug' => 'from']);
        $to = $this->makeType(['name' => 'Commercial', 'slug' => 'commercial']);
        $status = $this->makeStatus();

        $first = $this->makeProject(['slug' => 'first', 'project_type_id' => $from->id, 'project_status_id' => $status->id]);
        $second = $this->makeProject(['slug' => 'second', 'project_type_id' => $from->id, 'project_status_id' => $status->id]);

        $this->actingAs($admin)
            ->patch(route('admin.project-types.reassign', $from), ['target_id' => $to->id])
            ->assertSessionHas('success');

        $this->assertDatabaseHas('projects', ['id' => $first->id, 'project_type_id' => $to->id]);
        $this->assertDatabaseHas('projects', ['id' => $second->id, 'project_type_id' => $to->id]);

        $this->actingAs($admin)
            ->delete(route('admin.project-types.destroy', $from))
            ->assertRedirect(route('admin.project-types.index'));

        $this->assertDatabaseMissing('project_types', ['id' => $from->id]);
    }
}
