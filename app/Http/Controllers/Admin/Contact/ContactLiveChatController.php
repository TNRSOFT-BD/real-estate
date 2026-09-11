<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contact\UpdateContactLiveChatRequest;
use App\Models\Contact\ContactLiveChatSetting;
use App\Repositories\Contracts\Contact\ContactLiveChatRepositoryInterface;
use App\Services\Contact\ContactPageService;
use Inertia\Inertia;
use Inertia\Response;

class ContactLiveChatController extends Controller
{
    public function __construct(
        private readonly ContactLiveChatRepositoryInterface $liveChatRepository,
        private readonly ContactPageService $pageService,
    ) {}

    public function edit(): Response
    {
        $this->authorize('view', ContactLiveChatSetting::class);

        return Inertia::render('admin/contact/live-chat/edit', [
            'settings' => $this->liveChatRepository->getSingleton(),
        ]);
    }

    public function update(UpdateContactLiveChatRequest $request)
    {
        $this->liveChatRepository->updateSettings($request->validated());
        $this->pageService->invalidatePublicCache();

        return back()->with('success', 'Live chat settings updated.');
    }
}
