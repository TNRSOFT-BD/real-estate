<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\WhyChooseUs;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\UpdateWhyChooseUsSettingsRequest;
use App\Models\Home\WhyChooseUsSetting;
use App\Services\Home\WhyChooseUsFeatureService;
use App\Services\Home\WhyChooseUsService;
use Inertia\Inertia;
use Inertia\Response;

class WhyChooseUsController extends Controller
{
    public function __construct(
        private readonly WhyChooseUsService $service,
        private readonly WhyChooseUsFeatureService $featureService,
    ) {}

    public function edit(): Response
    {
        $this->authorize('view', WhyChooseUsSetting::class);

        return Inertia::render('admin/why-choose-us/edit', [
            'settings' => $this->service->getSettings(),
            'features' => $this->featureService->all(),
        ]);
    }

    public function update(UpdateWhyChooseUsSettingsRequest $request)
    {
        $this->authorize('update', WhyChooseUsSetting::class);

        $this->service->update($request->validated());

        return back()->with('success', 'Why Choose Us section updated.');
    }
}
