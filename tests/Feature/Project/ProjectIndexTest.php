<?php

namespace Tests\Feature\Project;

use Inertia\Testing\AssertableInertia as Assert;

class ProjectIndexTest extends ProjectTestCase
{
    public function test_only_published_projects_are_listed(): void
    {
        $type = $this->makeType();
        $status = $this->makeStatus();

        $this->makeProject(['title' => 'Published Tower', 'slug' => 'published-tower', 'is_published' => true, 'project_type_id' => $type->id, 'project_status_id' => $status->id]);
        $this->makeProject(['title' => 'Draft Tower', 'slug' => 'draft-tower', 'is_published' => false, 'project_type_id' => $type->id, 'project_status_id' => $status->id]);

        $this->get(route('projects.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('projects/index')
                ->has('projects.data', 1)
                ->where('projects.data.0.slug', 'published-tower')
                ->has('types')
                ->has('statuses')
            );
    }

    public function test_projects_can_be_filtered_by_type_slug(): void
    {
        $residential = $this->makeType(['name' => 'Residential', 'slug' => 'residential']);
        $commercial = $this->makeType(['name' => 'Commercial', 'slug' => 'commercial']);
        $status = $this->makeStatus();

        $this->makeProject(['title' => 'Home', 'slug' => 'home', 'is_published' => true, 'project_type_id' => $residential->id, 'project_status_id' => $status->id]);
        $this->makeProject(['title' => 'Office', 'slug' => 'office', 'is_published' => true, 'project_type_id' => $commercial->id, 'project_status_id' => $status->id]);

        $this->get(route('projects.index', ['project_type' => 'residential']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('projects.data', 1)
                ->where('projects.data.0.slug', 'home')
                ->where('filters.project_type', 'residential')
            );
    }

    public function test_projects_can_be_filtered_by_status_slug(): void
    {
        $type = $this->makeType();
        $ongoing = $this->makeStatus(['name' => 'Ongoing', 'slug' => 'ongoing']);
        $completed = $this->makeStatus(['name' => 'Completed', 'slug' => 'completed']);

        $this->makeProject(['title' => 'Active', 'slug' => 'active', 'is_published' => true, 'project_type_id' => $type->id, 'project_status_id' => $ongoing->id]);
        $this->makeProject(['title' => 'Done', 'slug' => 'done', 'is_published' => true, 'project_type_id' => $type->id, 'project_status_id' => $completed->id]);

        $this->get(route('projects.index', ['project_status' => 'completed']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('projects.data', 1)
                ->where('projects.data.0.slug', 'done')
            );
    }

    public function test_featured_projects_are_listed_first(): void
    {
        $type = $this->makeType();
        $status = $this->makeStatus();

        $this->makeProject(['title' => 'Standard', 'slug' => 'standard', 'is_published' => true, 'is_featured' => false, 'project_type_id' => $type->id, 'project_status_id' => $status->id]);
        $this->makeProject(['title' => 'Featured', 'slug' => 'featured', 'is_published' => true, 'is_featured' => true, 'project_type_id' => $type->id, 'project_status_id' => $status->id]);

        $this->get(route('projects.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('projects.data.0.slug', 'featured'));
    }
}
