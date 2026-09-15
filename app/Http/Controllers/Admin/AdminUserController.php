<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Exceptions\AdminManagementException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ChangeAdminPasswordRequest;
use App\Http\Requests\Admin\StoreAdminRequest;
use App\Http\Requests\Admin\UpdateAdminRequest;
use App\Models\User;
use App\Repositories\Contracts\Admin\AdminRepositoryInterface;
use App\Services\Admin\AdminService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function __construct(
        private readonly AdminRepositoryInterface $repository,
        private readonly AdminService $service,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $filters = $request->only(['search', 'per_page']);

        return Inertia::render('admin/admins/index', [
            'items' => $this->repository->paginate($filters),
            'filters' => (object) $filters,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('admin/admins/create');
    }

    public function store(StoreAdminRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return to_route('admin.admins.index')->with('success', 'Administrator created successfully.');
    }

    public function edit(User $admin): Response
    {
        $this->ensureAdministrator($admin);
        $this->authorize('update', $admin);

        return Inertia::render('admin/admins/edit', [
            'item' => $admin->only(['id', 'name', 'email']),
        ]);
    }

    public function update(UpdateAdminRequest $request, User $admin): RedirectResponse
    {
        $this->ensureAdministrator($admin);

        $this->service->update($admin, $request->validated());

        return back()->with('success', 'Administrator updated successfully.');
    }

    public function updatePassword(ChangeAdminPasswordRequest $request, User $admin): RedirectResponse
    {
        $this->ensureAdministrator($admin);

        $this->service->changePassword($admin, $request->validated()['password']);

        return back()->with('success', 'Password changed successfully.');
    }

    public function destroy(Request $request, User $admin): RedirectResponse
    {
        $this->ensureAdministrator($admin);
        $this->authorize('delete', $admin);

        /** @var User $actor */
        $actor = $request->user();

        try {
            $this->service->delete($admin, $actor);
        } catch (AdminManagementException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('admin.admins.index')->with('success', 'Administrator deleted successfully.');
    }

    /**
     * Ensure the bound user is actually an administrator to prevent IDOR
     * against arbitrary users through this module.
     */
    private function ensureAdministrator(User $admin): void
    {
        abort_unless($admin->isAdministrator(), 404);
    }
}
