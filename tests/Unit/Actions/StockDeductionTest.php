<?php

use App\Enums\StockMovementType;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use App\Services\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create(['email_verified_at' => now()]);
    $cat = Category::firstOrCreate(['slug' => 'inv-test'], ['name' => 'Test', 'is_active' => true]);

    $this->product = Product::create([
        'category_id'    => $cat->id,
        'name'           => 'Inventory Test Product',
        'sku'            => 'INV-' . uniqid(),
        'barcode'        => (string) random_int(1000000000000, 9999999999999),
        'unit_of_measure'=> 'piece',
        'cost_price'     => 5000,
        'selling_price'  => 10000,
        'vat_type'       => 'vatable',
        'stock_quantity' => 50,
        'minimum_stock'  => 5,
        'is_active'      => true,
    ]);
});

test('deducts stock and records movement', function () {
    $service  = new InventoryService();
    $movement = $service->deduct($this->product, 5, StockMovementType::Sale, $this->user);

    expect($this->product->fresh()->stock_quantity)->toBe(45)
        ->and($movement->quantity)->toBe(-5)
        ->and($movement->quantity_before)->toBe(50)
        ->and($movement->quantity_after)->toBe(45)
        ->and($movement->type)->toBe(StockMovementType::Sale);
});

test('restores stock and records movement', function () {
    $service  = new InventoryService();
    $movement = $service->restore($this->product, 10, StockMovementType::Refund, $this->user);

    expect($this->product->fresh()->stock_quantity)->toBe(60)
        ->and($movement->quantity)->toBe(10)
        ->and($movement->quantity_before)->toBe(50)
        ->and($movement->quantity_after)->toBe(60);
});

test('manual adjustment to a specific quantity', function () {
    $service = new InventoryService();
    $service->adjust($this->product, 100, 'Physical count correction', $this->user);

    expect($this->product->fresh()->stock_quantity)->toBe(100);
    $movement = StockMovement::where('product_id', $this->product->id)->latest()->first();
    expect($movement->quantity)->toBe(50)  // +50 to reach 100
        ->and($movement->type)->toBe(StockMovementType::ManualAdjustment);
});

test('records correct before/after balances through multiple operations', function () {
    $service = new InventoryService();
    $service->deduct($this->product, 10, StockMovementType::Sale, $this->user);
    $service->deduct($this->product, 5, StockMovementType::Sale, $this->user);
    $service->restore($this->product, 3, StockMovementType::Refund, $this->user);

    expect($this->product->fresh()->stock_quantity)->toBe(38);

    $movements = StockMovement::where('product_id', $this->product->id)->orderBy('id')->get();
    expect($movements)->toHaveCount(3)
        ->and($movements[0]->quantity_before)->toBe(50)
        ->and($movements[1]->quantity_before)->toBe(40)
        ->and($movements[2]->quantity_before)->toBe(35)
        ->and($movements[2]->quantity_after)->toBe(38);
});
