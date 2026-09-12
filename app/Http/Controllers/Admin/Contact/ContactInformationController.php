<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactInformationRequest;
use App\Http\Requests\Contact\UpdateContactInformationRequest;
use App\Models\Contact\ContactInformation;
use App\Repositories\Contracts\Contact\ContactInformationRepositoryInterface;
use App\Services\Contact\ContactPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactInformationController extends Controller
{
    public function __construct(
        private readonly ContactInformationRepositoryInterface $informationRepository,
        private readonly ContactPageService $pageService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContactInformation::class);

        return Inertia::render('admin/contact/information/index', [
            'items' => $this->informationRepository->paginate($request->only(['search', 'type', 'is_active'])),
            'filters' => (object) $request->only(['search', 'type', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ContactInformation::class);

        return Inertia::render('admin/contact/information/create');
    }

    public function store(StoreContactInformationRequest $request)
    {
        $this->informationRepository->create($request->validated());
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.information.index')->with('success', 'Contact information created.');
    }

    public function edit(ContactInformation $information): Response
    {
        $this->authorize('update', $information);

        return Inertia::render('admin/contact/information/edit', [
            'item' => $information,
        ]);
    }

    public function update(UpdateContactInformationRequest $request, ContactInformation $information)
    {
        $this->informationRepository->update($information, $request->validated());
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.information.index')->with('success', 'Contact information updated.');
    }

    public function destroy(ContactInformation $information)
    {
        $this->authorize('delete', $information);

        $this->informationRepository->delete($information);
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.information.index')->with('success', 'Contact information deleted.');
    }

    public function toggle(ContactInformation $information)
    {
        $this->authorize('update', $information);

        $this->informationRepository->toggleActive($information);
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Contact information status updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', ContactInformation::class);

        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $this->informationRepository->reorder($request->input('ids'));
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Order updated.');
    }
}
