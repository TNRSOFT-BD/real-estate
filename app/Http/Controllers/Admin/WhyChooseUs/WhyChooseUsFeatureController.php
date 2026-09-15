<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\WhyChooseUs;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\StoreWhyChooseUsFeatureRequest;
use App\Http\Requests\Home\UpdateWhyChooseUsFeatureRequest;
use App\Models\Home\WhyChooseUsFeature;
use App\Models\Home\WhyChooseUsSetting;
use App\Services\Home\WhyChooseUsFeatureService;
use Illuminate\Http\Request;

class WhyChooseUsFeatureController extends Controller
{
    public function __construct(
        private readonly WhyChooseUsFeatureService $service,
    ) {}

    public function store(StoreWhyChooseUsFeatureRequest $request)
    {
        $this->authorize('update', WhyChooseUsSetting::class);

        $this->service->create($request->validated());

        return back()->with('success', 'Feature added.');
    }

    public function update(UpdateWhyChooseUsFeatureRequest $request, WhyChooseUsFeature $feature)
    {
        $this->authorize('update', WhyChooseUsSetting::class);

        $this->service->update($feature, $request->validated());

        return back()->with('success', 'Feature updated.');
    }

    public function destroy(WhyChooseUsFeature $feature)
    {
        $this->authorize('update', WhyChooseUsSetting::class);

        $this->service->delete($feature);

        return back()->with('success', 'Feature deleted.');
    }

    public function toggle(WhyChooseUsFeature $feature)
    {
        $this->authorize('update', WhyChooseUsSetting::class);

        $this->service->toggle($feature);

        return back()->with('success', 'Feature visibility updated.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', WhyChooseUsSetting::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $this->service->reorder($validated['ids']);

        return back()->with('success', 'Features reordered.');
    }
}
