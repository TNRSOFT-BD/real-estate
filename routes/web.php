<?php

use App\Http\Controllers\Frontend\ContactController;
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

Route::get('contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:contact-submit')->name('contact.store');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
