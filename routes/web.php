<?php

use App\Http\Controllers\Frontend\AboutController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\LegalPageController;
use App\Repositories\Contracts\Contact\ContactSubmissionRepositoryInterface;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function (ContactSubmissionRepositoryInterface $submissions) {
        return Inertia::render('dashboard', [
            'overview' => (object) $submissions->countsOverview(),
        ]);
    })->name('dashboard');
});

Route::get('about', [AboutController::class, 'show'])->name('about.show');
Route::get('contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:contact-submit')->name('contact.store');

Route::get('privacy-policy', [LegalPageController::class, 'show'])->defaults('type', 'privacy_policy')->name('privacy-policy');
Route::get('terms-and-conditions', [LegalPageController::class, 'show'])->defaults('type', 'terms_conditions')->name('terms-conditions');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
