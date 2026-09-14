<?php

namespace Tests\Feature\Project;

class ProjectEnquiryTest extends ProjectTestCase
{
    public function test_guest_can_submit_a_project_enquiry(): void
    {
        $project = $this->makeProject(['is_published' => true]);

        $this->post(route('projects.enquiry', ['slug' => $project->slug]), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '01700000000',
            'message' => 'I would like a site visit.',
        ])->assertRedirect();

        $this->assertDatabaseHas('contact_submissions', [
            'project_id' => $project->id,
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'source' => 'project_page',
            'subject' => 'Project enquiry: '.$project->title,
        ]);
    }

    public function test_enquiry_requires_name_and_email(): void
    {
        $project = $this->makeProject(['is_published' => true]);

        $this->post(route('projects.enquiry', ['slug' => $project->slug]), [])
            ->assertSessionHasErrors(['name', 'email']);
    }

    public function test_honeypot_enquiries_are_ignored(): void
    {
        $project = $this->makeProject(['is_published' => true]);

        $this->post(route('projects.enquiry', ['slug' => $project->slug]), [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'message' => 'spam',
            'website' => 'http://spam.example',
        ])->assertRedirect();

        $this->assertDatabaseCount('contact_submissions', 0);
    }

    public function test_enquiry_for_unpublished_project_returns_not_found(): void
    {
        $project = $this->makeProject(['is_published' => false]);

        $this->post(route('projects.enquiry', ['slug' => $project->slug]), [
            'name' => 'Jane',
            'email' => 'jane@example.com',
        ])->assertNotFound();
    }
}
