<?php

namespace Tests\Feature\Project;

use Inertia\Testing\AssertableInertia as Assert;

class HomePageTest extends ProjectTestCase
{
    public function test_home_page_renders_with_dynamic_filter_data(): void
    {
        $type = $this->makeType(['name' => 'Residential', 'slug' => 'residential']);
        $status = $this->makeStatus();

        $this->makeProject([
            'title' => 'Published',
            'slug' => 'published',
            'is_published' => true,
            'is_featured' => true,
            'location_city' => 'Dhaka',
            'project_type_id' => $type->id,
            'project_status_id' => $status->id,
        ]);

        $this->makeProject([
            'title' => 'Not Featured',
            'slug' => 'not-featured',
            'is_published' => true,
            'is_featured' => false,
            'location_city' => 'Sylhet',
            'project_type_id' => $type->id,
            'project_status_id' => $status->id,
        ]);

        $this->makeProject([
            'title' => 'Draft',
            'slug' => 'draft',
            'is_published' => false,
            'is_featured' => true,
            'location_city' => 'Chattogram',
            'project_type_id' => $type->id,
            'project_status_id' => $status->id,
        ]);

        $this->get(route('home'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->has('featuredProjects', 1)
                ->where('featuredProjects.0.slug', 'published')
                ->where('hero.video_quality', 'good')
                ->where('hero.video_enabled', true)
            );
    }
}
