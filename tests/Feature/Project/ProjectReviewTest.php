<?php

namespace Tests\Feature\Project;

use App\Models\Project\ProjectReview;
use Inertia\Testing\AssertableInertia as Assert;

class ProjectReviewTest extends ProjectTestCase
{
    public function test_guest_can_submit_a_review_that_awaits_approval(): void
    {
        $project = $this->makeProject(['is_published' => true]);

        $this->post(route('projects.reviews.store', ['slug' => $project->slug]), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'rating' => 5,
            'comment' => 'Fantastic location and finish.',
        ])->assertRedirect();

        $this->assertDatabaseHas('project_reviews', [
            'project_id' => $project->id,
            'name' => 'Jane Doe',
            'rating' => 5,
            'is_approved' => false,
        ]);
    }

    public function test_review_requires_valid_fields(): void
    {
        $project = $this->makeProject(['is_published' => true]);

        $this->post(route('projects.reviews.store', ['slug' => $project->slug]), [
            'rating' => 9,
        ])->assertSessionHasErrors(['name', 'email', 'rating', 'comment']);
    }

    public function test_honeypot_submissions_are_ignored(): void
    {
        $project = $this->makeProject(['is_published' => true]);

        $this->post(route('projects.reviews.store', ['slug' => $project->slug]), [
            'name' => 'Bot',
            'email' => 'bot@example.com',
            'rating' => 5,
            'comment' => 'spam',
            'website' => 'http://spam.example',
        ])->assertRedirect();

        $this->assertDatabaseCount('project_reviews', 0);
    }

    public function test_public_page_only_exposes_approved_reviews(): void
    {
        $project = $this->makeProject(['is_published' => true]);

        ProjectReview::create(['project_id' => $project->id, 'name' => 'Approved', 'email' => 'a@example.com', 'rating' => 4, 'comment' => 'Good', 'is_approved' => true]);
        ProjectReview::create(['project_id' => $project->id, 'name' => 'Pending', 'email' => 'p@example.com', 'rating' => 5, 'comment' => 'Hidden', 'is_approved' => false]);

        $this->get(route('projects.show', $project->slug))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('projects/show')
                ->has('reviews', 1)
                ->where('reviews.0.name', 'Approved')
                ->where('reviewSummary.count', 1)
                ->where('reviewSummary.average', fn ($average) => (float) $average === 4.0)
            );
    }

    public function test_admin_can_approve_unapprove_and_delete_reviews(): void
    {
        $project = $this->makeProject();
        $review = ProjectReview::create(['project_id' => $project->id, 'name' => 'Jane', 'email' => 'jane@example.com', 'rating' => 5, 'comment' => 'Nice', 'is_approved' => false]);

        $admin = $this->admin();

        $this->actingAs($admin)
            ->patch(route('admin.projects.reviews.approve', ['project' => $project->id, 'review' => $review->id]))
            ->assertRedirect();

        $this->assertTrue($review->fresh()->is_approved);

        $this->actingAs($admin)
            ->patch(route('admin.projects.reviews.unapprove', ['project' => $project->id, 'review' => $review->id]))
            ->assertRedirect();

        $this->assertFalse($review->fresh()->is_approved);

        $this->actingAs($admin)
            ->delete(route('admin.projects.reviews.destroy', ['project' => $project->id, 'review' => $review->id]))
            ->assertRedirect();

        $this->assertSoftDeleted('project_reviews', ['id' => $review->id]);
    }
}
