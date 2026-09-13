<?php

namespace Tests\Feature\Project;

class ProjectStatusCrudTest extends ProjectTestCase
{
    public function test_guests_are_redirected(): void
    {
        $this->get(route('admin.project-statuses.index'))->assertRedirect('/login');
    }

    public function test_admin_can_create_a_status(): void
    {
        $this->actingAs($this->admin())
            ->post(route('admin.project-statuses.store'), ['name' => 'Completed', 'color' => '#10b981', 'is_active' => true])
            ->assertRedirect(route('admin.project-statuses.index'));

        $this->assertDatabaseHas('project_statuses', ['slug' => 'completed']);
    }

    public function test_delete_is_blocked_when_in_use(): void
    {
        $status = $this->makeStatus();
        $this->makeProject(['project_status_id' => $status->id]);

        $this->actingAs($this->admin())
            ->delete(route('admin.project-statuses.destroy', $status))
            ->assertSessionHas('error');

        $this->assertDatabaseHas('project_statuses', ['id' => $status->id]);
    }

    public function test_delete_is_allowed_when_unused(): void
    {
        $status = $this->makeStatus();

        $this->actingAs($this->admin())
            ->delete(route('admin.project-statuses.destroy', $status))
            ->assertRedirect(route('admin.project-statuses.index'));

        $this->assertDatabaseMissing('project_statuses', ['id' => $status->id]);
    }

    public function test_reassign_moves_projects_then_allows_delete(): void
    {
        $admin = $this->admin();
        $from = $this->makeStatus(['slug' => 'from']);
        $to = $this->makeStatus(['name' => 'Completed', 'slug' => 'completed']);
        $type = $this->makeType();

        $project = $this->makeProject(['slug' => 'project', 'project_type_id' => $type->id, 'project_status_id' => $from->id]);

        $this->actingAs($admin)
            ->patch(route('admin.project-statuses.reassign', $from), ['target_id' => $to->id])
            ->assertSessionHas('success');

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'project_status_id' => $to->id]);

        $this->actingAs($admin)
            ->delete(route('admin.project-statuses.destroy', $from))
            ->assertRedirect(route('admin.project-statuses.index'));

        $this->assertDatabaseMissing('project_statuses', ['id' => $from->id]);
    }
}
