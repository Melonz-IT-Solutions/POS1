<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\TrialBookingController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::get('/demo', [DemoController::class, 'show'])->name('demo');

Route::post('/trial-booking', [TrialBookingController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('trial-booking.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

require __DIR__.'/settings.php';

require __DIR__.'/pos.php';

require __DIR__.'/admin.php';
