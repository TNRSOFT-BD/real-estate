<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Legal\LegalPageService;
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

        return Inertia::render('legal/show', [
            'page' => $page,
        ]);
    }
}
