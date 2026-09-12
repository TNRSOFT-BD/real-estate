<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactSocialLinkRequest;
use App\Http\Requests\Contact\UpdateContactSocialLinkRequest;
use App\Models\Contact\ContactSocialLink;
use App\Repositories\Contracts\Contact\ContactSocialLinkRepositoryInterface;
use App\Services\Contact\ContactPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactSocialLinkController extends Controller
{
    public function __construct(
        private readonly ContactSocialLinkRepositoryInterface $socialLinkRepository,
        private readonly ContactPageService $pageService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContactSocialLink::class);

        return Inertia::render('admin/contact/social-links/index', [
            'items' => $this->socialLinkRepository->paginate($request->only(['search', 'is_active'])),
            'filters' => (object) $request->only(['search', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ContactSocialLink::class);

        return Inertia::render('admin/contact/social-links/create');
    }

    public function store(StoreContactSocialLinkRequest $request)
    {
        $this->socialLinkRepository->create($request->validated());
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.social-links.index')->with('success', 'Social link created.');
    }

    public function edit(ContactSocialLink $link): Response
    {
        $this->authorize('update', $link);

        return Inertia::render('admin/contact/social-links/edit', [
            'item' => $link,
        ]);
    }

    public function update(UpdateContactSocialLinkRequest $request, ContactSocialLink $link)
    {
        $this->socialLinkRepository->update($link, $request->validated());
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.social-links.index')->with('success', 'Social link updated.');
    }

    public function destroy(ContactSocialLink $link)
    {
        $this->authorize('delete', $link);

        $this->socialLinkRepository->delete($link);
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.social-links.index')->with('success', 'Social link deleted.');
    }

    public function toggle(ContactSocialLink $link)
    {
        $this->authorize('update', $link);

        $this->socialLinkRepository->toggleActive($link);
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Social link status updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', ContactSocialLink::class);

        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $this->socialLinkRepository->reorder($request->input('ids'));
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Order updated.');
    }
}
