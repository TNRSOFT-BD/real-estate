<?php

namespace Tests\Feature\Seo;

use Tests\Feature\Project\ProjectTestCase;

class SeoMetaTest extends ProjectTestCase
{
    public function test_project_page_exposes_seo_tags_in_server_html(): void
    {
        $project = $this->makeProject([
            'title' => 'Skyline Tower',
            'slug' => 'skyline-tower',
            'is_published' => true,
            'meta_title' => 'Skyline Tower — Premium Living',
            'meta_description' => 'A landmark residence in the heart of the city.',
            'hero_banner' => 'projects/hero.jpg',
            'location_city' => 'Dhaka',
        ]);

        $this->get(route('projects.show', $project->slug))
            ->assertOk()
            ->assertSee('<title inertia>Skyline Tower — Premium Living', false)
            ->assertSee('name="description"', false)
            ->assertSee('A landmark residence in the heart of the city.', false)
            ->assertSee('rel="canonical"', false)
            ->assertSee('property="og:image"', false)
            ->assertSee(url('/storage/projects/hero.jpg'), false)
            ->assertSee('name="twitter:image"', false)
            ->assertSee('application/ld+json', false)
            ->assertSee('RealEstateListing', false)
            ->assertSee('BreadcrumbList', false);
    }

    public function test_seo_image_urls_are_absolute(): void
    {
        $project = $this->makeProject([
            'is_published' => true,
            'hero_banner' => 'projects/hero.jpg',
        ]);

        $this->get(route('projects.show', $project->slug))
            ->assertOk()
            ->assertSee('content="'.url('/storage/projects/hero.jpg').'"', false)
            ->assertDontSee('content="/storage/projects/hero.jpg"', false);
    }

    public function test_home_page_exposes_organization_and_website_schema(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertSee('<title inertia>', false)
            ->assertSee('application/ld+json', false)
            ->assertSee('Organization', false)
            ->assertSee('WebSite', false);
    }

    public function test_sitemap_lists_published_projects(): void
    {
        $project = $this->makeProject([
            'title' => 'Published Project',
            'slug' => 'published-project',
            'is_published' => true,
        ]);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee(route('projects.index'), false)
            ->assertSee(route('projects.show', $project->slug), false)
            ->assertSee(route('about.show'), false)
            ->assertSee(route('contact.show'), false);
    }

    public function test_sitemap_excludes_draft_projects(): void
    {
        $project = $this->makeProject([
            'title' => 'Hidden Draft',
            'slug' => 'hidden-draft',
            'is_published' => false,
        ]);

        $this->get('/sitemap.xml')
            ->assertOk()
            ->assertDontSee(route('projects.show', $project->slug), false);
    }

    public function test_robots_txt_references_sitemap_and_blocks_admin(): void
    {
        $this->get('/robots.txt')
            ->assertOk()
            ->assertSee('Disallow: /admin', false)
            ->assertSee('Disallow: /dashboard', false)
            ->assertSee('Sitemap: '.url('/sitemap.xml'), false);
    }
}
