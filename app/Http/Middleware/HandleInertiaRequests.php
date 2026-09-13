<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use App\Services\Company\CompanyProfileService;
use App\Services\Contact\ContactPageService;
use App\Services\Legal\LegalPageService;
use App\Services\Site\SiteThemeService;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $company = app(CompanyProfileService::class)->getProfile();

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => $company['name'],
            'company' => $company,
            'theme' => app(SiteThemeService::class)->themeForFrontend(),
            'footer' => fn (): array => [
                'information' => app(ContactPageService::class)->getActiveInformation(),
                'socialLinks' => app(ContactPageService::class)->getActiveSocialLinks(),
                'legal' => app(LegalPageService::class)->getFooterPages(),
            ],
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
}
