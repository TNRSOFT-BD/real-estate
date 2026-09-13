<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\About\AboutPageService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __construct(private readonly AboutPageService $pageService) {}

    public function show(): Response
    {
        return Inertia::render('about/index', $this->pageService->getPublicPageData());
    }
}