<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\About;

use App\Http\Controllers\Controller;
use App\Http\Requests\About\StoreAboutItemRequest;
use App\Http\Requests\About\UpdateAboutItemRequest;
use App\Models\About\AboutItem;
use App\Repositories\Contracts\About\AboutItemRepositoryInterface;
use App\Services\About\AboutItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AboutItemController extends Controller
{
    public function __construct(
        private readonly AboutItemRepositoryInterface $repository,
        private readonly AboutItemService $service,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', AboutItem::class);

        return Inertia::render('admin/about/items/index', [
            'items' => $this->repository->paginate($request->only(['search', 'type', 'is_active'])),
            'filters' => (object) $request->only(['search', 'type', 'is_active']),
            'types' => AboutItem::types(),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorize('create', AboutItem::class);

        return Inertia::render('admin/about/items/create', [
            'types' => AboutItem::types(),
            'selectedType' => $request->query('type', AboutItem::TYPE_VALUE),
        ]);
    }

    public function store(StoreAboutItemRequest $request)
    {
        $this->service->create($request->safe()->except('image'), $request->file('image'));

        return to_route('admin.about.items.index')->with('success', 'About item created.');
    }

    public function edit(AboutItem $item): Response
    {
        $this->authorize('update', $item);

        return Inertia::render('admin/about/items/edit', [
            'item' => $item,
            'types' => AboutItem::types(),
        ]);
    }

    public function update(UpdateAboutItemRequest $request, AboutItem $item)
    {
        $this->service->update($item, $request->safe()->except('image'), $request->file('image'));

        return to_route('admin.about.items.index')->with('success', 'About item updated.');
    }

    public function destroy(AboutItem $item)
    {
        $this->authorize('delete', $item);

        $this->service->delete($item);

        return to_route('admin.about.items.index')->with('success', 'About item deleted.');
    }

    public function toggle(AboutItem $item)
    {
        $this->authorize('update', $item);

        $this->service->toggle($item);

        return back()->with('success', 'About item status updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', AboutItem::class);

        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $this->service->reorder($request->input('ids'));

        return back()->with('success', 'Order updated.');
    }
}
