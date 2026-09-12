<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\StoreContactTeamMemberRequest;
use App\Http\Requests\Contact\UpdateContactTeamMemberRequest;
use App\Models\Contact\ContactTeamMember;
use App\Repositories\Contracts\Contact\ContactTeamMemberRepositoryInterface;
use App\Services\Contact\ContactMediaService;
use App\Services\Contact\ContactPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactTeamController extends Controller
{
    public function __construct(
        private readonly ContactTeamMemberRepositoryInterface $teamMemberRepository,
        private readonly ContactMediaService $mediaService,
        private readonly ContactPageService $pageService,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ContactTeamMember::class);

        return Inertia::render('admin/contact/team/index', [
            'items' => $this->teamMemberRepository->paginate($request->only(['search', 'department', 'is_active'])),
            'filters' => (object) $request->only(['search', 'department', 'is_active']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', ContactTeamMember::class);

        return Inertia::render('admin/contact/team/create');
    }

    public function store(StoreContactTeamMemberRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $path = $this->mediaService->upload($request->file('avatar'), 'contact/team');

            if ($path !== null) {
                $data['avatar'] = $path;
            } else {
                unset($data['avatar']);
            }
        }

        $this->teamMemberRepository->create($data);
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.team.index')->with('success', 'Team member created.');
    }

    public function edit(ContactTeamMember $member): Response
    {
        $this->authorize('update', $member);

        return Inertia::render('admin/contact/team/edit', [
            'item' => $member,
        ]);
    }

    public function update(UpdateContactTeamMemberRequest $request, ContactTeamMember $member)
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $path = $this->mediaService->replace($member->avatar, $request->file('avatar'), 'contact/team');

            if ($path !== null) {
                $data['avatar'] = $path;
            } else {
                unset($data['avatar']);
            }
        }

        $this->teamMemberRepository->update($member, $data);
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.team.index')->with('success', 'Team member updated.');
    }

    public function destroy(ContactTeamMember $member)
    {
        $this->authorize('delete', $member);

        $this->mediaService->delete($member->avatar);
        $this->teamMemberRepository->delete($member);
        $this->pageService->invalidatePublicCache();

        return to_route('admin.contact.team.index')->with('success', 'Team member deleted.');
    }

    public function toggle(ContactTeamMember $member)
    {
        $this->authorize('update', $member);

        $this->teamMemberRepository->toggleActive($member);
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Team member status updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', ContactTeamMember::class);

        $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);

        $this->teamMemberRepository->reorder($request->input('ids'));
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Order updated.');
    }
}
