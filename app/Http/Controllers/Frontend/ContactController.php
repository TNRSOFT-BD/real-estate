<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\DTOs\Contact\CreateContactSubmissionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactSubmissionRequest;
use App\Services\Contact\ContactFormService;
use App\Services\Contact\ContactPageService;
use App\Services\Contact\ContactSubmissionService;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __construct(
        private readonly ContactPageService $pageService,
        private readonly ContactSubmissionService $submissionService,
        private readonly ContactFormService $formService,
    ) {}

    public function show(): Response
    {
        return Inertia::render('contact/index', $this->pageService->getPublicPageData());
    }

    public function store(StoreContactSubmissionRequest $request)
    {
        $fields = $this->pageService->getActiveForm();

        $this->formService->validateSubmission($request, $fields);

        $normalized = $this->formService->normalizeFormData($request, $fields);

        $dto = CreateContactSubmissionData::fromRequest($request, $normalized);

        $this->submissionService->create($dto);

        return back()->with('success', 'Your message has been sent successfully.');
    }
}
