<?php

declare(strict_types=1);

namespace App\Services\Project;

use App\Models\Project\Project;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class ProjectSeoService
{
    /**
     * Resolve the public SEO metadata for a project using the documented fallbacks.
     *
     * @return array<string, string|null>
     */
    public function build(Project $project): array
    {
        $title = $project->meta_title ?: $project->title;

        $description = $project->og_description
            ?: $project->meta_description
            ?: $project->short_description
            ?: Str::limit(trim(strip_tags((string) $project->overview)), 160) ?: null;

        $ogImage = $project->og_image ?: $project->hero_banner;

        $canonical = $project->canonical_url
            ?: (Route::has('projects.show') ? route('projects.show', $project->slug) : null);

        return [
            'title' => $title,
            'description' => $description,
            'keywords' => $project->meta_keywords,
            'canonical_url' => $canonical,
            'robots' => $project->robots,
            'og_title' => $project->og_title ?: $title,
            'og_description' => $project->og_description ?: $description,
            'og_image' => $ogImage,
            'twitter_card' => $project->twitter_card,
            'twitter_title' => $project->twitter_title ?: $title,
            'twitter_description' => $project->twitter_description ?: $description,
            'twitter_image' => $project->twitter_image ?: $ogImage,
        ];
    }
}
