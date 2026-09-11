<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\DTOs\Contact\ContactLocationData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactLocationRequest;
use App\Http\Requests\Contact\UpdateContactLocationRequest;
use App\Models\Contact\ContactLocation;
use App\Repositories\Contracts\Contact\ContactLocationRepositoryInterface;
use App\Services\Contact\ContactLocationService;
use App\Services\Contact\ContactPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactLocationController extends Controller
{
    public function __construct(
        private readonly ContactLocationRepositoryInterface $locationRepository,
        private readonly ContactLocationService $locationService,
        private readonly ContactPageService $pageService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContactLocation::class);

        return Inertia::render('admin/contact/locations/index', [
            'items' => $this->locationRepository->paginate($request->only(['search', 'is_active'])),
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ContactLocation::class);

        return Inertia::render('admin/contact/locations/create');
    }

    public function store(StoreContactLocationRequest $request)
    {
        $dto = $this->buildDto($request->validated());
        $this->locationService->create($dto);

        return to_route('admin.contact.locations.index')->with('success', 'Location created.');
    }

    public function edit(ContactLocation $location): Response
    {
        $this->authorize('update', $location);

        return Inertia::render('admin/contact/locations/edit', [
            'item' => $location,
        ]);
    }

    public function update(UpdateContactLocationRequest $request, ContactLocation $location)
    {
        $dto = $this->buildDto($request->validated());
        $this->locationService->update($location, $dto);

        return to_route('admin.contact.locations.index')->with('success', 'Location updated.');
    }

    public function destroy(ContactLocation $location)
    {
        $this->authorize('delete', $location);

        $this->locationService->delete($location);

        return to_route('admin.contact.locations.index')->with('success', 'Location deleted.');
    }

    public function setPrimary(ContactLocation $location)
    {
        $this->authorize('update', $location);

        $this->locationService->setPrimary($location);

        return back()->with('success', 'Primary location updated.');
    }

    public function toggle(ContactLocation $location)
    {
        $this->authorize('update', $location);

        $this->locationRepository->toggleActive($location);
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Location status updated.');
    }

    public function resolve(Request $request)
    {
        $this->authorize('create', ContactLocation::class);

        $data = $request->validate(['query' => ['required', 'string', 'max:500']]);

        $resolved = $this->locationService->resolveGoogleMapsUrl($data['query']);

        return response()->json($resolved ?? ['message' => 'Location could not be resolved.']);
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', ContactLocation::class);

        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $this->locationRepository->reorder($request->input('ids'));
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Order updated.');
    }

    private function buildDto(array $validated): ContactLocationData
    {
        return new ContactLocationData(
            name: (string) $validated['name'],
            address: (string) $validated['address'],
            city: $validated['city'] ?? null,
            state: $validated['state'] ?? null,
            country: $validated['country'] ?? null,
            postalCode: $validated['postal_code'] ?? null,
            latitude: isset($validated['latitude']) ? (float) $validated['latitude'] : null,
            longitude: isset($validated['longitude']) ? (float) $validated['longitude'] : null,
            googleMapsUrl: $validated['google_maps_url'] ?? null,
            placeId: $validated['place_id'] ?? null,
            phone: $validated['phone'] ?? null,
            email: $validated['email'] ?? null,
            businessHours: $validated['business_hours'] ?? null,
            isPrimary: (bool) ($validated['is_primary'] ?? false),
            sortOrder: (int) ($validated['sort_order'] ?? 0),
            isActive: (bool) ($validated['is_active'] ?? true),
        );
    }
}
