<?php

namespace Tests\Feature\Project;

use App\Models\Project\Project;
use App\Models\Project\ProjectStatus;
use App\Models\Project\ProjectType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

abstract class ProjectTestCase extends TestCase
{
    use RefreshDatabase;

    protected function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    protected function makeType(array $overrides = []): ProjectType
    {
        return ProjectType::create(array_merge([
            'name' => 'Residential',
            'slug' => 'residential',
            'sort_order' => 1,
            'is_active' => true,
        ], $overrides));
    }

    protected function makeStatus(array $overrides = []): ProjectStatus
    {
        return ProjectStatus::create(array_merge([
            'name' => 'Ongoing',
            'slug' => 'ongoing',
            'color' => '#f59e0b',
            'sort_order' => 1,
            'is_active' => true,
        ], $overrides));
    }

    protected function makeProject(array $overrides = []): Project
    {
        $typeId = $overrides['project_type_id'] ?? $this->makeType()->id;
        $statusId = $overrides['project_status_id'] ?? $this->makeStatus()->id;

        return Project::create(array_merge([
            'title' => 'Skyline Tower',
            'slug' => 'skyline-tower',
            'project_type_id' => $typeId,
            'project_status_id' => $statusId,
        ], $overrides));
    }
}
