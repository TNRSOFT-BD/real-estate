<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Frontend\AboutController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\LegalPageController;
use App\Http\Controllers\Frontend\ProjectController;
use App\Http\Controllers\Frontend\ProjectEnquiryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::get('about', [AboutController::class, 'show'])->name('about.show');
Route::get('contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:contact-submit')->name('contact.store');

Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');

Route::get('projects/{slug}', [ProjectController::class, 'show'])
    ->where('slug', '[a-z0-9]+(?:-[a-z0-9]+)*')
    ->name('projects.show');

Route::post('projects/{slug}/enquiry', [ProjectEnquiryController::class, 'store'])
    ->where('slug', '[a-z0-9]+(?:-[a-z0-9]+)*')
    ->middleware('throttle:contact-submit')
    ->name('projects.enquiry');

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';

Route::get('{slug}', [LegalPageController::class, 'show'])
    ->where('slug', '[a-z0-9]+(?:-[a-z0-9]+)*')
    ->name('legal.show');
