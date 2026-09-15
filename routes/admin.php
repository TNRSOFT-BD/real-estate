<?php

use App\Http\Controllers\Admin\About\AboutItemController;
use App\Http\Controllers\Admin\About\AboutPageSettingsController;
use App\Http\Controllers\Admin\About\CompanyProfileController;
use App\Http\Controllers\Admin\Contact\ContactFaqController;
use App\Http\Controllers\Admin\Contact\ContactFormFieldController;
use App\Http\Controllers\Admin\Contact\ContactInformationController;
use App\Http\Controllers\Admin\Contact\ContactLiveChatController;
use App\Http\Controllers\Admin\Contact\ContactLocationController;
use App\Http\Controllers\Admin\Contact\ContactPageSettingsController;
use App\Http\Controllers\Admin\Contact\ContactSocialLinkController;
use App\Http\Controllers\Admin\Contact\ContactSubmissionController;
use App\Http\Controllers\Admin\Contact\ContactSubmissionNoteController;
use App\Http\Controllers\Admin\Contact\ContactTeamController;
use App\Http\Controllers\Admin\HomeAbout\HomeAboutController;
use App\Http\Controllers\Admin\HomeAbout\HomeAboutStatController;
use App\Http\Controllers\Admin\Legal\LegalPageController as AdminLegalPageController;
use App\Http\Controllers\Admin\Project\ProjectController;
use App\Http\Controllers\Admin\Project\ProjectFloorPlanController;
use App\Http\Controllers\Admin\Project\ProjectGalleryController;
use App\Http\Controllers\Admin\Project\ProjectPricingPlanController;
use App\Http\Controllers\Admin\Project\ProjectStatusController;
use App\Http\Controllers\Admin\Project\ProjectTypeController;
use App\Http\Controllers\Admin\Site\SiteThemeController;
use App\Http\Controllers\Admin\WhyChooseUs\WhyChooseUsController;
use App\Http\Controllers\Admin\WhyChooseUs\WhyChooseUsFeatureController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::prefix('site')->name('admin.site.')->group(function () {
        Route::get('appearance', [SiteThemeController::class, 'edit'])->name('appearance.edit');
        Route::put('appearance', [SiteThemeController::class, 'update'])->name('appearance.update');

        Route::get('homepage', [SiteThemeController::class, 'homepageEdit'])->name('homepage.edit');
        Route::put('homepage', [SiteThemeController::class, 'homepageUpdate'])->name('homepage.update');
        Route::post('homepage/images', [SiteThemeController::class, 'homepageImagesStore'])->name('homepage.images.store');
        Route::delete('homepage/images', [SiteThemeController::class, 'homepageImagesDestroy'])->name('homepage.images.destroy');
        Route::patch('homepage/images/reorder', [SiteThemeController::class, 'homepageImagesReorder'])->name('homepage.images.reorder');
        Route::get('homepage/video/signature', [SiteThemeController::class, 'homepageVideoSignature'])->name('homepage.video.signature');
        Route::post('homepage/video', [SiteThemeController::class, 'homepageVideoStore'])->name('homepage.video.store');
    });

    Route::prefix('home-about')->name('admin.home-about.')->group(function () {
        Route::get('/', [HomeAboutController::class, 'edit'])->name('edit');
        Route::put('/', [HomeAboutController::class, 'update'])->name('update');
        Route::post('stats', [HomeAboutStatController::class, 'store'])->name('stats.store');
        Route::patch('stats/reorder', [HomeAboutStatController::class, 'reorder'])->name('stats.reorder');
        Route::put('stats/{stat}', [HomeAboutStatController::class, 'update'])->whereNumber('stat')->name('stats.update');
        Route::delete('stats/{stat}', [HomeAboutStatController::class, 'destroy'])->whereNumber('stat')->name('stats.destroy');
    });

    Route::prefix('why-choose-us')->name('admin.why-choose-us.')->group(function () {
        Route::get('/', [WhyChooseUsController::class, 'edit'])->name('edit');
        Route::put('/', [WhyChooseUsController::class, 'update'])->name('update');
        Route::post('features', [WhyChooseUsFeatureController::class, 'store'])->name('features.store');
        Route::patch('features/reorder', [WhyChooseUsFeatureController::class, 'reorder'])->name('features.reorder');
        Route::put('features/{feature}', [WhyChooseUsFeatureController::class, 'update'])->whereNumber('feature')->name('features.update');
        Route::delete('features/{feature}', [WhyChooseUsFeatureController::class, 'destroy'])->whereNumber('feature')->name('features.destroy');
        Route::patch('features/{feature}/toggle', [WhyChooseUsFeatureController::class, 'toggle'])->whereNumber('feature')->name('features.toggle');
    });

    Route::prefix('legal')->name('admin.legal.')->group(function () {
        Route::get('/', [AdminLegalPageController::class, 'index'])->name('index');
        Route::get('create', [AdminLegalPageController::class, 'create'])->name('create');
        Route::post('/', [AdminLegalPageController::class, 'store'])->name('store');
        Route::get('{page}/edit', [AdminLegalPageController::class, 'edit'])->whereNumber('page')->name('edit');
        Route::put('{page}', [AdminLegalPageController::class, 'update'])->whereNumber('page')->name('update');
        Route::delete('{page}', [AdminLegalPageController::class, 'destroy'])->whereNumber('page')->name('destroy');
        Route::patch('{page}/publish', [AdminLegalPageController::class, 'publish'])->whereNumber('page')->name('publish');
        Route::patch('{page}/unpublish', [AdminLegalPageController::class, 'unpublish'])->whereNumber('page')->name('unpublish');
    });

    Route::prefix('about')->name('admin.about.')->group(function () {
        Route::get('settings', [AboutPageSettingsController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [AboutPageSettingsController::class, 'update'])->name('settings.update');

        Route::get('company', [CompanyProfileController::class, 'edit'])->name('company.edit');
        Route::put('company', [CompanyProfileController::class, 'update'])->name('company.update');

        Route::get('items', [AboutItemController::class, 'index'])->name('items.index');
        Route::get('items/create', [AboutItemController::class, 'create'])->name('items.create');
        Route::post('items', [AboutItemController::class, 'store'])->name('items.store');
        Route::patch('items/reorder', [AboutItemController::class, 'reorder'])->name('items.reorder');
        Route::get('items/{item}/edit', [AboutItemController::class, 'edit'])->whereNumber('item')->name('items.edit');
        Route::put('items/{item}', [AboutItemController::class, 'update'])->whereNumber('item')->name('items.update');
        Route::delete('items/{item}', [AboutItemController::class, 'destroy'])->whereNumber('item')->name('items.destroy');
        Route::patch('items/{item}/toggle', [AboutItemController::class, 'toggle'])->whereNumber('item')->name('items.toggle');
    });

    Route::prefix('contact')->name('admin.contact.')->group(function () {
        Route::get('settings', [ContactPageSettingsController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [ContactPageSettingsController::class, 'update'])->name('settings.update');

        Route::get('information', [ContactInformationController::class, 'index'])->name('information.index');
        Route::get('information/create', [ContactInformationController::class, 'create'])->name('information.create');
        Route::post('information', [ContactInformationController::class, 'store'])->name('information.store');
        Route::get('information/{information}/edit', [ContactInformationController::class, 'edit'])->whereNumber('information')->name('information.edit');
        Route::put('information/{information}', [ContactInformationController::class, 'update'])->whereNumber('information')->name('information.update');
        Route::delete('information/{information}', [ContactInformationController::class, 'destroy'])->whereNumber('information')->name('information.destroy');
        Route::patch('information/{information}/toggle', [ContactInformationController::class, 'toggle'])->whereNumber('information')->name('information.toggle');
        Route::patch('information/reorder', [ContactInformationController::class, 'reorder'])->name('information.reorder');

        Route::get('form-fields', [ContactFormFieldController::class, 'index'])->name('form-fields.index');
        Route::get('form-fields/create', [ContactFormFieldController::class, 'create'])->name('form-fields.create');
        Route::post('form-fields', [ContactFormFieldController::class, 'store'])->name('form-fields.store');
        Route::get('form-fields/{field}/edit', [ContactFormFieldController::class, 'edit'])->whereNumber('field')->name('form-fields.edit');
        Route::put('form-fields/{field}', [ContactFormFieldController::class, 'update'])->whereNumber('field')->name('form-fields.update');
        Route::delete('form-fields/{field}', [ContactFormFieldController::class, 'destroy'])->whereNumber('field')->name('form-fields.destroy');
        Route::patch('form-fields/{field}/toggle', [ContactFormFieldController::class, 'toggle'])->whereNumber('field')->name('form-fields.toggle');
        Route::patch('form-fields/reorder', [ContactFormFieldController::class, 'reorder'])->name('form-fields.reorder');

        Route::get('submissions', [ContactSubmissionController::class, 'index'])->name('submissions.index');
        Route::get('submissions/{submission}', [ContactSubmissionController::class, 'show'])->whereNumber('submission')->name('submissions.show');
        Route::put('submissions/{submission}', [ContactSubmissionController::class, 'update'])->whereNumber('submission')->name('submissions.update');
        Route::delete('submissions/{submission}', [ContactSubmissionController::class, 'destroy'])->whereNumber('submission')->name('submissions.destroy');
        Route::patch('submissions/bulk-update', [ContactSubmissionController::class, 'bulkUpdate'])->name('submissions.bulk-update');
        Route::patch('submissions/bulk-delete', [ContactSubmissionController::class, 'bulkDelete'])->name('submissions.bulk-delete');
        Route::patch('submissions/{submission}/mark-spam', [ContactSubmissionController::class, 'markSpam'])->whereNumber('submission')->name('submissions.mark-spam');
        Route::patch('submissions/{submission}/restore', [ContactSubmissionController::class, 'restore'])->whereNumber('submission')->name('submissions.restore');
        Route::post('submissions/{submission}/notes', [ContactSubmissionNoteController::class, 'store'])->whereNumber('submission')->name('submissions.notes.store');
        Route::put('submissions/notes/{note}', [ContactSubmissionNoteController::class, 'update'])->whereNumber('note')->name('submissions.notes.update');
        Route::delete('submissions/notes/{note}', [ContactSubmissionNoteController::class, 'destroy'])->whereNumber('note')->name('submissions.notes.destroy');

        Route::get('faqs', [ContactFaqController::class, 'index'])->name('faqs.index');
        Route::get('faqs/create', [ContactFaqController::class, 'create'])->name('faqs.create');
        Route::post('faqs', [ContactFaqController::class, 'store'])->name('faqs.store');
        Route::get('faqs/{faq}/edit', [ContactFaqController::class, 'edit'])->whereNumber('faq')->name('faqs.edit');
        Route::put('faqs/{faq}', [ContactFaqController::class, 'update'])->whereNumber('faq')->name('faqs.update');
        Route::delete('faqs/{faq}', [ContactFaqController::class, 'destroy'])->whereNumber('faq')->name('faqs.destroy');
        Route::patch('faqs/{faq}/toggle', [ContactFaqController::class, 'toggle'])->whereNumber('faq')->name('faqs.toggle');
        Route::patch('faqs/reorder', [ContactFaqController::class, 'reorder'])->name('faqs.reorder');

        Route::get('team', [ContactTeamController::class, 'index'])->name('team.index');
        Route::get('team/create', [ContactTeamController::class, 'create'])->name('team.create');
        Route::post('team', [ContactTeamController::class, 'store'])->name('team.store');
        Route::get('team/{member}/edit', [ContactTeamController::class, 'edit'])->whereNumber('member')->name('team.edit');
        Route::put('team/{member}', [ContactTeamController::class, 'update'])->whereNumber('member')->name('team.update');
        Route::delete('team/{member}', [ContactTeamController::class, 'destroy'])->whereNumber('member')->name('team.destroy');
        Route::patch('team/{member}/toggle', [ContactTeamController::class, 'toggle'])->whereNumber('member')->name('team.toggle');
        Route::patch('team/reorder', [ContactTeamController::class, 'reorder'])->name('team.reorder');

        Route::get('locations', [ContactLocationController::class, 'index'])->name('locations.index');
        Route::get('locations/create', [ContactLocationController::class, 'create'])->name('locations.create');
        Route::post('locations', [ContactLocationController::class, 'store'])->name('locations.store');
        Route::get('locations/{location}/edit', [ContactLocationController::class, 'edit'])->whereNumber('location')->name('locations.edit');
        Route::put('locations/{location}', [ContactLocationController::class, 'update'])->whereNumber('location')->name('locations.update');
        Route::delete('locations/{location}', [ContactLocationController::class, 'destroy'])->whereNumber('location')->name('locations.destroy');
        Route::patch('locations/{location}/toggle', [ContactLocationController::class, 'toggle'])->whereNumber('location')->name('locations.toggle');
        Route::patch('locations/{location}/primary', [ContactLocationController::class, 'setPrimary'])->whereNumber('location')->name('locations.primary');
        Route::patch('locations/reorder', [ContactLocationController::class, 'reorder'])->name('locations.reorder');
        Route::get('locations/lookup', [ContactLocationController::class, 'resolve'])->name('locations.lookup');

        Route::get('social-links', [ContactSocialLinkController::class, 'index'])->name('social-links.index');
        Route::get('social-links/create', [ContactSocialLinkController::class, 'create'])->name('social-links.create');
        Route::post('social-links', [ContactSocialLinkController::class, 'store'])->name('social-links.store');
        Route::get('social-links/{link}/edit', [ContactSocialLinkController::class, 'edit'])->whereNumber('link')->name('social-links.edit');
        Route::put('social-links/{link}', [ContactSocialLinkController::class, 'update'])->whereNumber('link')->name('social-links.update');
        Route::delete('social-links/{link}', [ContactSocialLinkController::class, 'destroy'])->whereNumber('link')->name('social-links.destroy');
        Route::patch('social-links/{link}/toggle', [ContactSocialLinkController::class, 'toggle'])->whereNumber('link')->name('social-links.toggle');
        Route::patch('social-links/reorder', [ContactSocialLinkController::class, 'reorder'])->name('social-links.reorder');

        Route::get('live-chat', [ContactLiveChatController::class, 'edit'])->name('live-chat.edit');
        Route::put('live-chat', [ContactLiveChatController::class, 'update'])->name('live-chat.update');
    });

    Route::prefix('projects')->name('admin.projects.')->group(function () {
        Route::get('/', [ProjectController::class, 'index'])->name('index');
        Route::get('create', [ProjectController::class, 'create'])->name('create');
        Route::post('/', [ProjectController::class, 'store'])->name('store');

        Route::prefix('{project}')->whereNumber('project')->group(function () {
            Route::get('gallery', [ProjectGalleryController::class, 'index'])->name('gallery.index');
            Route::post('gallery', [ProjectGalleryController::class, 'store'])->name('gallery.store');
            Route::patch('gallery/reorder', [ProjectGalleryController::class, 'reorder'])->name('gallery.reorder');
            Route::put('gallery/{gallery}', [ProjectGalleryController::class, 'update'])->whereNumber('gallery')->name('gallery.update');
            Route::delete('gallery/{gallery}', [ProjectGalleryController::class, 'destroy'])->whereNumber('gallery')->name('gallery.destroy');
            Route::patch('gallery/{gallery}/feature', [ProjectGalleryController::class, 'feature'])->whereNumber('gallery')->name('gallery.feature');

            Route::get('pricing', [ProjectPricingPlanController::class, 'index'])->name('pricing.index');
            Route::post('pricing', [ProjectPricingPlanController::class, 'store'])->name('pricing.store');
            Route::patch('pricing/reorder', [ProjectPricingPlanController::class, 'reorder'])->name('pricing.reorder');
            Route::put('pricing/{pricing}', [ProjectPricingPlanController::class, 'update'])->whereNumber('pricing')->name('pricing.update');
            Route::delete('pricing/{pricing}', [ProjectPricingPlanController::class, 'destroy'])->whereNumber('pricing')->name('pricing.destroy');
            Route::post('pricing/{pricing}/duplicate', [ProjectPricingPlanController::class, 'duplicate'])->whereNumber('pricing')->name('pricing.duplicate');

            Route::get('floor-plans', [ProjectFloorPlanController::class, 'index'])->name('floor-plans.index');
            Route::post('floor-plans', [ProjectFloorPlanController::class, 'store'])->name('floor-plans.store');
            Route::patch('floor-plans/reorder', [ProjectFloorPlanController::class, 'reorder'])->name('floor-plans.reorder');
            Route::put('floor-plans/{floorPlan}', [ProjectFloorPlanController::class, 'update'])->whereNumber('floorPlan')->name('floor-plans.update');
            Route::delete('floor-plans/{floorPlan}', [ProjectFloorPlanController::class, 'destroy'])->whereNumber('floorPlan')->name('floor-plans.destroy');

            Route::patch('publish', [ProjectController::class, 'publish'])->name('publish');
            Route::patch('unpublish', [ProjectController::class, 'unpublish'])->name('unpublish');
            Route::patch('feature', [ProjectController::class, 'feature'])->name('feature');
            Route::patch('unfeature', [ProjectController::class, 'unfeature'])->name('unfeature');

            Route::get('/', [ProjectController::class, 'show'])->name('show');
            Route::get('edit', [ProjectController::class, 'edit'])->name('edit');
            Route::put('/', [ProjectController::class, 'update'])->name('update');
            Route::delete('/', [ProjectController::class, 'destroy'])->name('destroy');
        });
    });

    Route::prefix('project-types')->name('admin.project-types.')->group(function () {
        Route::get('/', [ProjectTypeController::class, 'index'])->name('index');
        Route::get('create', [ProjectTypeController::class, 'create'])->name('create');
        Route::post('/', [ProjectTypeController::class, 'store'])->name('store');
        Route::patch('reorder', [ProjectTypeController::class, 'reorder'])->name('reorder');
        Route::get('{projectType}/edit', [ProjectTypeController::class, 'edit'])->whereNumber('projectType')->name('edit');
        Route::put('{projectType}', [ProjectTypeController::class, 'update'])->whereNumber('projectType')->name('update');
        Route::delete('{projectType}', [ProjectTypeController::class, 'destroy'])->whereNumber('projectType')->name('destroy');
        Route::patch('{projectType}/toggle', [ProjectTypeController::class, 'toggle'])->whereNumber('projectType')->name('toggle');
        Route::patch('{projectType}/reassign', [ProjectTypeController::class, 'reassign'])->whereNumber('projectType')->name('reassign');
    });

    Route::prefix('project-statuses')->name('admin.project-statuses.')->group(function () {
        Route::get('/', [ProjectStatusController::class, 'index'])->name('index');
        Route::get('create', [ProjectStatusController::class, 'create'])->name('create');
        Route::post('/', [ProjectStatusController::class, 'store'])->name('store');
        Route::patch('reorder', [ProjectStatusController::class, 'reorder'])->name('reorder');
        Route::get('{projectStatus}/edit', [ProjectStatusController::class, 'edit'])->whereNumber('projectStatus')->name('edit');
        Route::put('{projectStatus}', [ProjectStatusController::class, 'update'])->whereNumber('projectStatus')->name('update');
        Route::delete('{projectStatus}', [ProjectStatusController::class, 'destroy'])->whereNumber('projectStatus')->name('destroy');
        Route::patch('{projectStatus}/toggle', [ProjectStatusController::class, 'toggle'])->whereNumber('projectStatus')->name('toggle');
        Route::patch('{projectStatus}/reassign', [ProjectStatusController::class, 'reassign'])->whereNumber('projectStatus')->name('reassign');
    });
});
