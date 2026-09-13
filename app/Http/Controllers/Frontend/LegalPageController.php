<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Enums\LegalPageType;
use App\Http\Controllers\Controller;
use App\Services\Legal\LegalPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function __construct(
        private readonly LegalPageService $legalPageService,
    ) {}

    public function show(Request $request): Response
    {
        $type = LegalPageType::from((string) $request->route('type'));

        $page = $this->legalPageService->getPublicPage($type);

        abort_if($page === null, 404);

        return Inertia::render('legal/show', [
            'type' => $type->value,
            'page' => $page,
        ]);
    }
}
