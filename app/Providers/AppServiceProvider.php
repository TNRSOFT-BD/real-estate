<?php

namespace App\Providers;

use App\Enums\AboutPermission;
use App\Enums\CompanyPermission;
use App\Enums\ContactPermission;
use App\Enums\HomeAboutPermission;
use App\Enums\LegalPermission;
use App\Enums\ProjectPermission;
use App\Enums\SitePermission;
use App\Models\About\AboutItem;
use App\Models\About\AboutPageSetting;
use App\Models\Company\CompanyProfile;
use App\Models\Home\HomeAboutSetting;
use App\Models\Legal\LegalPage;
use App\Models\Project\Project;
use App\Models\Project\ProjectFloorPlan;
use App\Models\Project\ProjectGallery;
use App\Models\Project\ProjectPricingPlan;
use App\Models\Project\ProjectStatus;
use App\Models\Project\ProjectType;
use App\Models\Site\SiteSetting;
use App\Models\User;
use App\Policies\AboutItemPolicy;
use App\Policies\AboutPageSettingsPolicy;
use App\Policies\CompanyProfilePolicy;
use App\Policies\HomeAboutPolicy;
use App\Policies\LegalPagePolicy;
use App\Policies\ProjectFloorPlanPolicy;
use App\Policies\ProjectGalleryPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\ProjectPricingPlanPolicy;
use App\Policies\ProjectStatusPolicy;
use App\Policies\ProjectTypePolicy;
use App\Policies\SiteThemePolicy;
use App\Repositories\Contracts\About\AboutItemRepositoryInterface;
use App\Repositories\Contracts\About\AboutPageSettingRepositoryInterface;
use App\Repositories\Contracts\Company\CompanyProfileRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactFaqRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactFormFieldRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactInformationRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactLiveChatRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactLocationRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactPageSettingRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactSocialLinkRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactSubmissionRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactTeamMemberRepositoryInterface;
use App\Repositories\Contracts\Home\HomeAboutSettingRepositoryInterface;
use App\Repositories\Contracts\Home\HomeAboutStatRepositoryInterface;
use App\Repositories\Contracts\Legal\LegalPageRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectFloorPlanRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectGalleryRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectPricingPlanRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectStatusRepositoryInterface;
use App\Repositories\Contracts\Project\ProjectTypeRepositoryInterface;
use App\Repositories\Contracts\Site\SiteSettingRepositoryInterface;
use App\Repositories\Eloquent\About\EloquentAboutItemRepository;
use App\Repositories\Eloquent\About\EloquentAboutPageSettingRepository;
use App\Repositories\Eloquent\Company\EloquentCompanyProfileRepository;
use App\Repositories\Eloquent\Contact\EloquentContactFaqRepository;
use App\Repositories\Eloquent\Contact\EloquentContactFormFieldRepository;
use App\Repositories\Eloquent\Contact\EloquentContactInformationRepository;
use App\Repositories\Eloquent\Contact\EloquentContactLiveChatRepository;
use App\Repositories\Eloquent\Contact\EloquentContactLocationRepository;
use App\Repositories\Eloquent\Contact\EloquentContactPageSettingRepository;
use App\Repositories\Eloquent\Contact\EloquentContactSocialLinkRepository;
use App\Repositories\Eloquent\Contact\EloquentContactSubmissionRepository;
use App\Repositories\Eloquent\Contact\EloquentContactTeamMemberRepository;
use App\Repositories\Eloquent\Home\EloquentHomeAboutSettingRepository;
use App\Repositories\Eloquent\Home\EloquentHomeAboutStatRepository;
use App\Repositories\Eloquent\Legal\EloquentLegalPageRepository;
use App\Repositories\Eloquent\Project\EloquentProjectFloorPlanRepository;
use App\Repositories\Eloquent\Project\EloquentProjectGalleryRepository;
use App\Repositories\Eloquent\Project\EloquentProjectPricingPlanRepository;
use App\Repositories\Eloquent\Project\EloquentProjectRepository;
use App\Repositories\Eloquent\Project\EloquentProjectStatusRepository;
use App\Repositories\Eloquent\Project\EloquentProjectTypeRepository;
use App\Repositories\Eloquent\Site\EloquentSiteSettingRepository;
use Illuminate\Cache\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ContactPageSettingRepositoryInterface::class, EloquentContactPageSettingRepository::class);
        $this->app->bind(ContactInformationRepositoryInterface::class, EloquentContactInformationRepository::class);
        $this->app->bind(ContactFormFieldRepositoryInterface::class, EloquentContactFormFieldRepository::class);
        $this->app->bind(ContactSubmissionRepositoryInterface::class, EloquentContactSubmissionRepository::class);
        $this->app->bind(ContactFaqRepositoryInterface::class, EloquentContactFaqRepository::class);
        $this->app->bind(ContactTeamMemberRepositoryInterface::class, EloquentContactTeamMemberRepository::class);
        $this->app->bind(ContactLocationRepositoryInterface::class, EloquentContactLocationRepository::class);
        $this->app->bind(ContactSocialLinkRepositoryInterface::class, EloquentContactSocialLinkRepository::class);
        $this->app->bind(ContactLiveChatRepositoryInterface::class, EloquentContactLiveChatRepository::class);

        $this->app->bind(AboutPageSettingRepositoryInterface::class, EloquentAboutPageSettingRepository::class);
        $this->app->bind(AboutItemRepositoryInterface::class, EloquentAboutItemRepository::class);

        $this->app->bind(CompanyProfileRepositoryInterface::class, EloquentCompanyProfileRepository::class);

        $this->app->bind(HomeAboutSettingRepositoryInterface::class, EloquentHomeAboutSettingRepository::class);
        $this->app->bind(HomeAboutStatRepositoryInterface::class, EloquentHomeAboutStatRepository::class);

        $this->app->bind(LegalPageRepositoryInterface::class, EloquentLegalPageRepository::class);

        $this->app->bind(ProjectRepositoryInterface::class, EloquentProjectRepository::class);
        $this->app->bind(ProjectTypeRepositoryInterface::class, EloquentProjectTypeRepository::class);
        $this->app->bind(ProjectStatusRepositoryInterface::class, EloquentProjectStatusRepository::class);
        $this->app->bind(ProjectGalleryRepositoryInterface::class, EloquentProjectGalleryRepository::class);
        $this->app->bind(ProjectPricingPlanRepositoryInterface::class, EloquentProjectPricingPlanRepository::class);
        $this->app->bind(ProjectFloorPlanRepositoryInterface::class, EloquentProjectFloorPlanRepository::class);

        $this->app->bind(SiteSettingRepositoryInterface::class, EloquentSiteSettingRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(SiteSetting::class, SiteThemePolicy::class);
        Gate::policy(AboutPageSetting::class, AboutPageSettingsPolicy::class);
        Gate::policy(AboutItem::class, AboutItemPolicy::class);
        Gate::policy(CompanyProfile::class, CompanyProfilePolicy::class);
        Gate::policy(HomeAboutSetting::class, HomeAboutPolicy::class);
        Gate::policy(LegalPage::class, LegalPagePolicy::class);
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(ProjectType::class, ProjectTypePolicy::class);
        Gate::policy(ProjectStatus::class, ProjectStatusPolicy::class);
        Gate::policy(ProjectGallery::class, ProjectGalleryPolicy::class);
        Gate::policy(ProjectPricingPlan::class, ProjectPricingPlanPolicy::class);
        Gate::policy(ProjectFloorPlan::class, ProjectFloorPlanPolicy::class);

        Gate::before(function (User $user) {
            if ($user->isAdministrator()) {
                return true;
            }

            return null;
        });

        foreach (ContactPermission::all() as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }

        foreach (AboutPermission::all() as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }

        foreach (HomeAboutPermission::all() as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }

        foreach (SitePermission::all() as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }

        foreach (CompanyPermission::all() as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }

        foreach (LegalPermission::all() as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }

        foreach (ProjectPermission::all() as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }

        app(RateLimiter::class)->for('contact-submit', function ($job) {
            return Limit::perMinutes(5, 5);
        });
    }
}
