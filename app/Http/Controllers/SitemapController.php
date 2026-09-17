<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Repositories\Contracts\Legal\LegalPageRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(
        ProjectRepositoryInterface $projects,
        LegalPageRepositoryInterface $legalPages,
    ): Response {
        $fallback = now()->toAtomString();

        $urls = [
            ['loc' => url('/'), 'lastmod' => $fallback, 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => route('projects.index'), 'lastmod' => $fallback, 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => route('about.show'), 'lastmod' => $fallback, 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => route('contact.show'), 'lastmod' => $fallback, 'changefreq' => 'monthly', 'priority' => '0.7'],
        ];

        foreach ($projects->allPublished() as $project) {
            $urls[] = [
                'loc' => route('projects.show', $project->slug),
                'lastmod' => $project->updated_at?->toAtomString() ?? $fallback,
                'changefreq' => 'weekly',
                'priority' => '0.8',
            ];
        }

        foreach ($legalPages->allPublished() as $page) {
            $urls[] = [
                'loc' => route('legal.show', $page->slug),
                'lastmod' => $page->updated_at?->toAtomString() ?? $fallback,
                'changefreq' => 'yearly',
                'priority' => '0.3',
            ];
        }

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
