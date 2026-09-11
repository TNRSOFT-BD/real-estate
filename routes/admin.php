<?php

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
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->middleware(['auth'])->group(function () {
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
});
