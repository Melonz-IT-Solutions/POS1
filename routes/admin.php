<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DiscountController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PurchaseOrderController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\SystemSettingsController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {

    // ── Categories ──────────────────────────────────────────────────────────
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::post('categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');

    // ── Products ─────────────────────────────────────────────────────────────
    Route::resource('products', ProductController::class);
    Route::post('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');

    // ── Customers ─────────────────────────────────────────────────────────────
    Route::resource('customers', CustomerController::class);
    Route::post('customers/{id}/restore', [CustomerController::class, 'restore'])->name('customers.restore');
    Route::post('customers/{customer}/points', [CustomerController::class, 'adjustPoints'])->name('customers.adjust-points');

    // ── Users ─────────────────────────────────────────────────────────────────
    Route::resource('users', UserController::class)->except(['show']);
    Route::post('users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::post('users/{user}/set-pin', [UserController::class, 'setPin'])->name('users.set-pin');

    // ── Suppliers ─────────────────────────────────────────────────────────────
    Route::resource('suppliers', SupplierController::class)->except(['show']);
    Route::post('suppliers/{id}/restore', [SupplierController::class, 'restore'])->name('suppliers.restore');

    // ── Discounts ─────────────────────────────────────────────────────────────
    Route::resource('discounts', DiscountController::class)->except(['show']);
    Route::post('discounts/{id}/restore', [DiscountController::class, 'restore'])->name('discounts.restore');

    // ── Purchase Orders ───────────────────────────────────────────────────────
    Route::resource('purchases', PurchaseOrderController::class)->except(['show']);
    Route::get('purchases/{purchase}', [PurchaseOrderController::class, 'show'])->name('purchases.show');
    Route::post('purchases/{purchase}/mark-ordered', [PurchaseOrderController::class, 'markOrdered'])->name('purchases.mark-ordered');
    Route::post('purchases/{purchase}/cancel', [PurchaseOrderController::class, 'cancel'])->name('purchases.cancel');
    Route::get('purchases/{purchase}/receive', [PurchaseOrderController::class, 'receive'])->name('purchases.receive');
    Route::post('purchases/{purchase}/receive', [PurchaseOrderController::class, 'storeReceipt'])->name('purchases.store-receipt');

    // ── Reports ───────────────────────────────────────────────────────────────
    Route::get('reports/sales',    [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('reports/products', [ReportController::class, 'products'])->name('reports.products');
    Route::get('reports/cashiers', [ReportController::class, 'cashiers'])->name('reports.cashiers');

    // ── Settings ──────────────────────────────────────────────────────────────
    Route::get('settings', [SystemSettingsController::class, 'index'])->name('settings.index');
    Route::post('settings', [SystemSettingsController::class, 'update'])->name('settings.update');

    // ── Inventory ─────────────────────────────────────────────────────────────
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::get('inventory/movements/all', [InventoryController::class, 'allMovements'])->name('inventory.movements.all');
    Route::post('inventory/{product}/adjust', [InventoryController::class, 'adjust'])->name('inventory.adjust');
    Route::get('inventory/{product}/movements', [InventoryController::class, 'movements'])->name('inventory.movements');
});
