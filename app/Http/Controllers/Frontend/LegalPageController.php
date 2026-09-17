<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Legal\LegalPageService;
use App\Support\Seo\StructuredData;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function __construct(
        private readonly LegalPageService $legalPageService,
    ) {}

    public function show(string $slug): Response
    {
        $page = $this->legalPageService->getPublicPage($slug);

        abort_if($page === null, 404);

        $description = Str::limit(trim(strip_tags((string) ($page['content'] ?? ''))), 160) ?: null;

        return Inertia::render('legal/show', [
            'page' => $page,
            'seo' => [
                'title' => $page['title'],
                'description' => $description,
                'keywords' => null,
                'canonical_url' => route('legal.show', $slug),
                'robots' => null,
                'og_title' => $page['title'],
                'og_description' => $description,
                'og_image' => null,
                'og_type' => 'article',
                'twitter_card' => 'summary_large_image',
                'json_ld' => [
                    StructuredData::breadcrumb([
                        ['name' => 'Home', 'url' => url('/')],
                        ['name' => $page['title'], 'url' => route('legal.show', $slug)],
                    ]),
                ],
            ],
        ]);
    }
}
