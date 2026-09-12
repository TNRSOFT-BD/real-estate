<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactFormFieldRequest;
use App\Http\Requests\Contact\UpdateContactFormFieldRequest;
use App\Models\Contact\ContactFormField;
use App\Repositories\Contracts\Contact\ContactFormFieldRepositoryInterface;
use App\Services\Contact\ContactPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactFormFieldController extends Controller
{
    public function __construct(
        private readonly ContactFormFieldRepositoryInterface $formFieldRepository,
        private readonly ContactPageService $pageService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContactFormField::class);

        return Inertia::render('admin/contact/form-fields/index', [
            'items' => $this->formFieldRepository->paginate($request->only(['search', 'type', 'is_active'])),
            'filters' => (object) $request->only(['search', 'type', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ContactFormField::class);

        return Inertia::render('admin/contact/form-fields/create');
    }

    public function store(StoreContactFormFieldRequest $request)
    {
        $this->formFieldRepository->create($request->validated());
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.form-fields.index')->with('success', 'Form field created.');
    }

    public function edit(ContactFormField $field): Response
    {
        $this->authorize('update', $field);

        return Inertia::render('admin/contact/form-fields/edit', [
            'item' => $field,
        ]);
    }

    public function update(UpdateContactFormFieldRequest $request, ContactFormField $field)
    {
        $this->formFieldRepository->update($field, $request->validated());
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.form-fields.index')->with('success', 'Form field updated.');
    }

    public function destroy(ContactFormField $field)
    {
        $this->authorize('delete', $field);

        $this->formFieldRepository->delete($field);
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.form-fields.index')->with('success', 'Form field deleted.');
    }

    public function toggle(ContactFormField $field)
    {
        $this->authorize('update', $field);

        $this->formFieldRepository->toggleActive($field);
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Form field status updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', ContactFormField::class);

        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $this->formFieldRepository->reorder($request->input('ids'));
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Order updated.');
    }
}
