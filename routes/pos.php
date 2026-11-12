<?php

use App\Http\Controllers\POS\CustomerLookupController;
use App\Http\Controllers\POS\POSScreenController;
use App\Http\Controllers\POS\ProductLookupController;
use App\Http\Controllers\POS\SaleController;
use App\Http\Controllers\POS\ShiftController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| POS Routes
|--------------------------------------------------------------------------
| All routes require authentication. Cashier screen routes also require
| an active shift (enforced in the frontend; server-side shift check
| is done in the SaleService).
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix('pos')->name('pos.')->group(function () {

    // ── Cashier Screen ───────────────────────────────────────────────
    Route::get('/', [POSScreenController::class, 'index'])->name('index');

    // ── Product Lookup (AJAX) ────────────────────────────────────────
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('search', [ProductLookupController::class, 'search'])->name('search');
        Route::get('barcode', [ProductLookupController::class, 'barcode'])->name('barcode');
    });

    // ── Customer Lookup (AJAX) ───────────────────────────────────────
    Route::get('customers/search', [CustomerLookupController::class, 'search'])->name('customers.search');

    // ── Shift Management ─────────────────────────────────────────────
    Route::prefix('shifts')->name('shifts.')->group(function () {
        Route::get('current', [ShiftController::class, 'current'])->name('current');
        Route::post('open', [ShiftController::class, 'open'])->name('open');
        Route::post('close', [ShiftController::class, 'close'])->name('close');
        Route::post('cash-in', [ShiftController::class, 'cashIn'])->name('cash-in');
        Route::post('cash-out', [ShiftController::class, 'cashOut'])->name('cash-out');
    });

    // ── Sales ────────────────────────────────────────────────────────
    Route::prefix('sales')->name('sales.')->group(function () {
        Route::get('/', [SaleController::class, 'index'])->name('index');
        Route::get('held', [SaleController::class, 'heldList'])->name('held');
        Route::get('{sale}', [SaleController::class, 'show'])->name('show');
        Route::post('/', [SaleController::class, 'store'])->name('store');
        Route::post('hold', [SaleController::class, 'hold'])->name('hold');
        Route::post('{sale}/resume', [SaleController::class, 'resume'])->name('resume');
        Route::delete('{sale}/held', [SaleController::class, 'cancelHeld'])->name('cancel-held');
        Route::post('{sale}/void', [SaleController::class, 'void'])->name('void');
        Route::post('{sale}/refund', [SaleController::class, 'refund'])->name('refund');
    });
});
