<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Models\Project\ProjectReview;
use App\Repositories\Contracts\Project\ProjectReviewRepositoryInterface;

class ProjectReviewService
{
    public function __construct(
        private readonly ProjectReviewRepositoryInterface $repository,
    ) {}

    /**
     * @param  array{name: string, email: string, rating: int, comment: string}  $attributes
     */
    public function createForProject(int $projectId, array $attributes, ?string $ip, ?string $userAgent): ProjectReview
    {
        return $this->repository->create([
            'project_id' => $projectId,
            'name' => $attributes['name'],
            'email' => $attributes['email'],
            'rating' => $attributes['rating'],
            'comment' => $attributes['comment'],
            'is_approved' => false,
            'ip_hash' => $ip !== null ? hash('sha256', $ip) : null,
            'user_agent' => $userAgent,
        ]);
    }

    public function approve(ProjectReview $review): ProjectReview
    {
        return $this->repository->update($review, ['is_approved' => true]);
    }

    public function unapprove(ProjectReview $review): ProjectReview
    {
        return $this->repository->update($review, ['is_approved' => false]);
    }

    public function delete(ProjectReview $review): void
    {
        $this->repository->delete($review);
    }
}
