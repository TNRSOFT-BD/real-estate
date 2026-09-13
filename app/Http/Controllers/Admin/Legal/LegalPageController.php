<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Legal;

use App\Http\Controllers\Controller;
use App\Http\Requests\Legal\StoreLegalPageRequest;
use App\Http\Requests\Legal\UpdateLegalPageRequest;
use App\Models\Legal\LegalPage;
use App\Repositories\Contracts\Legal\LegalPageRepositoryInterface;
use App\Services\Legal\LegalPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    public function __construct(
        private readonly LegalPageRepositoryInterface $repository,
        private readonly LegalPageService $service,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', LegalPage::class);

        return Inertia::render('admin/legal/index', [
            'items' => $this->repository->paginate($request->only(['search', 'status'])),
            'filters' => (object) $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', LegalPage::class);

        return Inertia::render('admin/legal/create');
    }

    public function store(StoreLegalPageRequest $request)
    {
        $page = $this->service->create($request->validated());

        return to_route('admin.legal.edit', $page)->with('success', 'Legal page created.');
    }

    public function edit(LegalPage $page): Response
    {
        $this->authorize('update', $page);

        return Inertia::render('admin/legal/edit', [
            'page' => $page,
        ]);
    }

    public function update(UpdateLegalPageRequest $request, LegalPage $page)
    {
        $this->service->update($page, $request->validated());

        return back()->with('success', 'Legal page updated.');
    }

    public function destroy(LegalPage $page)
    {
        $this->authorize('delete', $page);

        $this->service->delete($page);

        return to_route('admin.legal.index')->with('success', 'Legal page deleted.');
    }

    public function publish(LegalPage $page)
    {
        $this->authorize('publish', $page);

        $this->service->publish($page);

        return back()->with('success', 'Legal page published.');
    }

    public function unpublish(LegalPage $page)
    {
        $this->authorize('publish', $page);

        $this->service->unpublish($page);

        return back()->with('success', 'Legal page unpublished.');
    }
}
