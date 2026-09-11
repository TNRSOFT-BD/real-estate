<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactFaqRequest;
use App\Http\Requests\Contact\UpdateContactFaqRequest;
use App\Models\Contact\ContactFaq;
use App\Repositories\Contracts\Contact\ContactFaqRepositoryInterface;
use App\Services\Contact\ContactPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactFaqController extends Controller
{
    public function __construct(
        private readonly ContactFaqRepositoryInterface $faqRepository,
        private readonly ContactPageService $pageService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContactFaq::class);

        return Inertia::render('admin/contact/faqs/index', [
            'items' => $this->faqRepository->paginate($request->only(['search', 'category', 'display_location', 'is_active'])),
            'filters' => $request->only(['search', 'category', 'display_location', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ContactFaq::class);

        return Inertia::render('admin/contact/faqs/create');
    }

    public function store(StoreContactFaqRequest $request)
    {
        $this->faqRepository->create($request->validated());
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.faqs.index')->with('success', 'FAQ created.');
    }

    public function edit(ContactFaq $faq): Response
    {
        $this->authorize('update', $faq);

        return Inertia::render('admin/contact/faqs/edit', [
            'item' => $faq,
        ]);
    }

    public function update(UpdateContactFaqRequest $request, ContactFaq $faq)
    {
        $this->faqRepository->update($faq, $request->validated());
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.faqs.index')->with('success', 'FAQ updated.');
    }

    public function destroy(ContactFaq $faq)
    {
        $this->authorize('delete', $faq);

        $this->faqRepository->delete($faq);
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.faqs.index')->with('success', 'FAQ deleted.');
    }

    public function toggle(ContactFaq $faq)
    {
        $this->authorize('update', $faq);

        $this->faqRepository->toggleActive($faq);
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'FAQ status updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', ContactFaq::class);

        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $this->faqRepository->reorder($request->input('ids'));
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Order updated.');
    }
}
