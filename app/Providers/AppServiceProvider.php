<?php

namespace App\Providers;

use App\Enums\ContactPermission;
use App\Models\User;
use App\Repositories\Contracts\Contact\ContactFaqRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactFormFieldRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactInformationRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactLiveChatRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactLocationRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactPageSettingRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactSocialLinkRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactSubmissionRepositoryInterface;
use App\Repositories\Contracts\Contact\ContactTeamMemberRepositoryInterface;
use App\Repositories\Eloquent\Contact\EloquentContactFaqRepository;
use App\Repositories\Eloquent\Contact\EloquentContactFormFieldRepository;
use App\Repositories\Eloquent\Contact\EloquentContactInformationRepository;
use App\Repositories\Eloquent\Contact\EloquentContactLiveChatRepository;
use App\Repositories\Eloquent\Contact\EloquentContactLocationRepository;
use App\Repositories\Eloquent\Contact\EloquentContactPageSettingRepository;
use App\Repositories\Eloquent\Contact\EloquentContactSocialLinkRepository;
use App\Repositories\Eloquent\Contact\EloquentContactSubmissionRepository;
use App\Repositories\Eloquent\Contact\EloquentContactTeamMemberRepository;
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(function (User $user) {
            if ($user->isAdministrator()) {
                return true;
            }

            return null;
        });

        foreach (ContactPermission::all() as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }

        app(RateLimiter::class)->for('contact-submit', function ($job) {
            return Limit::perMinutes(5, 5);
        });
    }
}
