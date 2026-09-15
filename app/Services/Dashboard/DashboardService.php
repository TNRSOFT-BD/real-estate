<?php

declare(strict_types=1);

namespace App\Services\Dashboard;

use App\Models\Contact\ContactFaq;
use App\Models\Contact\ContactLocation;
use App\Models\Contact\ContactSubmission;
use App\Models\Contact\ContactTeamMember;
use App\Models\Legal\LegalPage;
use App\Models\Project\Project;
use App\Models\Project\ProjectStatus;
use App\Models\Project\ProjectType;
use App\Repositories\Contracts\Contact\ContactSubmissionRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;

class DashboardService
{
    public function __construct(
        private readonly ProjectRepositoryInterface $projects,
        private readonly ContactSubmissionRepositoryInterface $submissions,
    ) {}

    /**
     * Aggregated figures for the admin dashboard.
     *
     * @return array{projects: array<string, mixed>, submissions: array<string, mixed>, content: array<string, int>}
     */
    public function summary(): array
    {
        $totalProjects = $this->projects->count();
        $publishedProjects = $this->projects->countPublished();

        return [
            'projects' => [
                'total' => $totalProjects,
                'published' => $publishedProjects,
                'draft' => max(0, $totalProjects - $publishedProjects),
                'featured' => $this->projects->countFeatured(),
                'recent' => $this->projects->recent(5)
                    ->map(fn (Project $project): array => [
                        'id' => $project->id,
                        'title' => $project->title,
                        'slug' => $project->slug,
                        'is_published' => $project->is_published,
                        'is_featured' => $project->is_featured,
                        'type' => $project->type?->name,
                        'status' => $project->status ? [
                            'name' => $project->status->name,
                            'color' => $project->status->color,
                        ] : null,
                        'created_at' => $project->created_at?->toIso8601String(),
                    ])
                    ->all(),
            ],
            'submissions' => [
                ...$this->submissions->countsOverview(),
                'recent' => $this->submissions->recent(5)
                    ->map(fn (ContactSubmission $submission): array => [
                        'id' => $submission->id,
                        'name' => $submission->name,
                        'email' => $submission->email,
                        'subject' => $submission->subject,
                        'status' => $submission->status->value,
                        'created_at' => $submission->created_at?->toIso8601String(),
                    ])
                    ->all(),
            ],
            'content' => [
                'project_types' => ProjectType::query()->count(),
                'project_statuses' => ProjectStatus::query()->count(),
                'legal_pages' => LegalPage::query()->count(),
                'legal_published' => LegalPage::query()->published()->count(),
                'faqs' => ContactFaq::query()->count(),
                'team_members' => ContactTeamMember::query()->count(),
                'locations' => ContactLocation::query()->count(),
            ],
        ];
    }
}
