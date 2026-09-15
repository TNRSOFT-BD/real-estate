<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\HomeAbout;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\StoreHomeAboutStatRequest;
use App\Http\Requests\Home\UpdateHomeAboutStatRequest;
use App\Models\Home\HomeAboutSetting;
use App\Models\Home\HomeAboutStat;
use App\Services\Home\HomeAboutStatService;
use Illuminate\Http\Request;

class HomeAboutStatController extends Controller
{
    public function __construct(
        private readonly HomeAboutStatService $service,
    ) {}

    public function store(StoreHomeAboutStatRequest $request)
    {
        $this->authorize('update', HomeAboutSetting::class);

        $this->service->create($request->validated());

        return back()->with('success', 'Statistic added.');
    }

    public function update(UpdateHomeAboutStatRequest $request, HomeAboutStat $stat)
    {
        $this->authorize('update', HomeAboutSetting::class);

        $this->service->update($stat, $request->validated());

        return back()->with('success', 'Statistic updated.');
    }

    public function destroy(HomeAboutStat $stat)
    {
        $this->authorize('update', HomeAboutSetting::class);

        $this->service->delete($stat);

        return back()->with('success', 'Statistic deleted.');
    }

    public function reorder(Request $request)
    {
        $this->authorize('update', HomeAboutSetting::class);

        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer'],
        ]);

        $this->service->reorder($validated['ids']);

        return back()->with('success', 'Statistics reordered.');
    }
}
