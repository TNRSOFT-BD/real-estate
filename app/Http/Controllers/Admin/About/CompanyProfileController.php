<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\About;

use App\Http\Controllers\Controller;
use App\Http\Requests\Company\UpdateCompanyProfileRequest;
use App\Models\Company\CompanyProfile;
use App\Services\Company\CompanyProfileService;
use Inertia\Inertia;
use Inertia\Response;

class CompanyProfileController extends Controller
{
    public function __construct(
        private readonly CompanyProfileService $profileService,
    ) {}

    public function edit(): Response
    {
        $this->authorize('view', CompanyProfile::class);

        return Inertia::render('admin/about/company/edit', [
            'profile' => $this->profileService->getSettings(),
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request)
    {
        $this->authorize('update', CompanyProfile::class);

        $this->profileService->update($request->safe()->except('logo'), $request->file('logo'));

        return back()->with('success', 'Company profile updated.');
    }
}
