<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\Admin\GiftCardController;
use App\Http\Controllers\Admin\LayawayController;
use App\Http\Controllers\Admin\SearchController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\PriceHistoryController;
use App\Http\Controllers\Admin\ShiftController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CustomerImportController;
use App\Http\Controllers\Admin\DiscountController;
use App\Http\Controllers\Admin\InventoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImportController;
use App\Http\Controllers\Admin\PurchaseOrderController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\SystemSettingsController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {

    // ── Categories ──────────────────────────────────────────────────────────
    Route::resource('categories', CategoryController::class);
    Route::post('categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');

    // ── Products ─────────────────────────────────────────────────────────────
    Route::get('products/import',      [ProductImportController::class, 'create'])->name('products.import');
    Route::post('products/import',     [ProductImportController::class, 'store'])->name('products.import.store');
    Route::get('products/labels',      [ProductController::class, 'labels'])->name('products.labels');
    Route::get('products/bulk-price',  [ProductController::class, 'bulkPriceIndex'])->name('products.bulk-price');
    Route::post('products/bulk-price', [ProductController::class, 'bulkPriceUpdate'])->name('products.bulk-price.update');
    Route::resource('products', ProductController::class);
    Route::post('products/{id}/restore', [ProductController::class, 'restore'])->name('products.restore');

    // ── Customers ─────────────────────────────────────────────────────────────
    Route::get('customers/import',  [CustomerImportController::class, 'create'])->name('customers.import');
    Route::post('customers/import', [CustomerImportController::class, 'store'])->name('customers.import.store');
    Route::resource('customers', CustomerController::class);
    Route::post('customers/{id}/restore', [CustomerController::class, 'restore'])->name('customers.restore');
    Route::post('customers/{customer}/points', [CustomerController::class, 'adjustPoints'])->name('customers.adjust-points');

    // ── Users ─────────────────────────────────────────────────────────────────
    Route::resource('users', UserController::class);
    Route::post('users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::post('users/{user}/set-pin', [UserController::class, 'setPin'])->name('users.set-pin');

    // ── Suppliers ─────────────────────────────────────────────────────────────
    Route::resource('suppliers', SupplierController::class);
    Route::post('suppliers/{id}/restore', [SupplierController::class, 'restore'])->name('suppliers.restore');

    // ── Discounts ─────────────────────────────────────────────────────────────
    Route::resource('discounts', DiscountController::class);
    Route::post('discounts/{id}/restore', [DiscountController::class, 'restore'])->name('discounts.restore');

    // ── Purchase Orders ───────────────────────────────────────────────────────
    Route::resource('purchases', PurchaseOrderController::class)->except(['show']);
    Route::get('purchases/{purchase}/print', [PurchaseOrderController::class, 'print'])->name('purchases.print');
    Route::get('purchases/{purchase}', [PurchaseOrderController::class, 'show'])->name('purchases.show');
    Route::post('purchases/{purchase}/mark-ordered', [PurchaseOrderController::class, 'markOrdered'])->name('purchases.mark-ordered');
    Route::post('purchases/{purchase}/cancel', [PurchaseOrderController::class, 'cancel'])->name('purchases.cancel');
    Route::get('purchases/{purchase}/receive', [PurchaseOrderController::class, 'receive'])->name('purchases.receive');
    Route::post('purchases/{purchase}/receive', [PurchaseOrderController::class, 'storeReceipt'])->name('purchases.store-receipt');

    // ── Expenses ──────────────────────────────────────────────────────────────
    Route::resource('expenses', ExpenseController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

    // ── Reports ───────────────────────────────────────────────────────────────
    Route::get('reports/sales',     [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('reports/products',  [ReportController::class, 'products'])->name('reports.products');
    Route::get('reports/cashiers',  [ReportController::class, 'cashiers'])->name('reports.cashiers');
    Route::get('reports/customers', [ReportController::class, 'customers'])->name('reports.customers');
    Route::get('reports/tax',       [ReportController::class, 'tax'])->name('reports.tax');
    Route::get('reports/hourly',     [ReportController::class, 'hourly'])->name('reports.hourly');
    Route::get('reports/suppliers',  [ReportController::class, 'suppliers'])->name('reports.suppliers');
    Route::get('reports/refunds',      [ReportController::class, 'refunds'])->name('reports.refunds');
    Route::get('reports/profit-loss',  [ReportController::class, 'profitLoss'])->name('reports.profit-loss');
    Route::get('reports/voids',        [ReportController::class, 'voids'])->name('reports.voids');
    Route::get('reports/bir-export',   [ReportController::class, 'birExport'])->name('reports.bir-export');

    // ── Layaway ───────────────────────────────────────────────────────────────
    Route::resource('layaway', LayawayController::class)->only(['index', 'create', 'store', 'show']);
    Route::post('layaway/{layaway}/payment', [LayawayController::class, 'addPayment'])->name('layaway.payment');
    Route::post('layaway/{layaway}/cancel',  [LayawayController::class, 'cancel'])->name('layaway.cancel');

    // ── Gift Cards ────────────────────────────────────────────────────────────
    Route::get('gift-cards/check-balance', [GiftCardController::class, 'checkBalance'])->name('gift-cards.check-balance');
    Route::resource('gift-cards', GiftCardController::class)->only(['index', 'create', 'store', 'show']);
    Route::post('gift-cards/{giftCard}/redeem', [GiftCardController::class, 'redeem'])->name('gift-cards.redeem');
    Route::post('gift-cards/{giftCard}/cancel', [GiftCardController::class, 'cancel'])->name('gift-cards.cancel');

    // ── Shifts ────────────────────────────────────────────────────────────────
    Route::get('shifts', [ShiftController::class, 'index'])->name('shifts.index');
    Route::get('shifts/{shift}/report', [ShiftController::class, 'report'])->name('shifts.report');
    Route::get('shifts/{shift}', [ShiftController::class, 'show'])->name('shifts.show');

    // ── Audit Log ─────────────────────────────────────────────────────────────
    Route::get('audit', [AuditLogController::class, 'index'])->name('audit.index');
    Route::get('audit/{auditLog}', [AuditLogController::class, 'show'])->name('audit.show');

    // ── Price History ─────────────────────────────────────────────────────────
    Route::get('price-history', [PriceHistoryController::class, 'index'])->name('price-history.index');

    // ── Payment Methods ───────────────────────────────────────────────────────
    Route::get('payment-methods', [PaymentMethodController::class, 'index'])->name('payment-methods.index');
    Route::post('payment-methods', [PaymentMethodController::class, 'store'])->name('payment-methods.store');
    Route::put('payment-methods/{paymentMethod}', [PaymentMethodController::class, 'update'])->name('payment-methods.update');
    Route::post('payment-methods/{paymentMethod}/toggle', [PaymentMethodController::class, 'toggle'])->name('payment-methods.toggle');
    Route::post('payment-methods/reorder', [PaymentMethodController::class, 'reorder'])->name('payment-methods.reorder');

    // ── Global Search ─────────────────────────────────────────────────────────
    Route::get('search', SearchController::class)->name('search');

    // ── Settings ──────────────────────────────────────────────────────────────
    Route::get('settings', [SystemSettingsController::class, 'index'])->name('settings.index');
    Route::post('settings', [SystemSettingsController::class, 'update'])->name('settings.update');

    // ── Inventory ─────────────────────────────────────────────────────────────
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::get('inventory/reorder', [InventoryController::class, 'reorder'])->name('inventory.reorder');
    Route::get('inventory/valuation', [InventoryController::class, 'valuation'])->name('inventory.valuation');
    Route::get('inventory/movements/all', [InventoryController::class, 'allMovements'])->name('inventory.movements.all');
    Route::get('inventory/export', [InventoryController::class, 'export'])->name('inventory.export');
    Route::get('inventory/physical-count', [InventoryController::class, 'physicalCount'])->name('inventory.physical-count');
    Route::post('inventory/physical-count', [InventoryController::class, 'applyPhysicalCount'])->name('inventory.physical-count.apply');
    Route::post('inventory/{product}/adjust', [InventoryController::class, 'adjust'])->name('inventory.adjust');
    Route::get('inventory/{product}/movements', [InventoryController::class, 'movements'])->name('inventory.movements');
});
