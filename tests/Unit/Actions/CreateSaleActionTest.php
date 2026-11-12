<?php

use App\DataTransferObjects\CartItemData;
use App\DataTransferObjects\CreateSaleData;
use App\DataTransferObjects\PaymentData;
use App\Enums\VatType;
use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Setting;
use App\Models\User;
use App\Services\DiscountService;
use App\Services\InventoryService;
use App\Services\SaleService;
use App\Services\TaxService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Setting::set('vat_inclusive', true, 'tax');
    Setting::set('vat_rate', 12, 'tax');
    Setting::set('receipt_prefix', 'OR', 'receipt');
    Setting::set('loyalty_enabled', false, 'loyalty');

    // Create roles/permissions for the test user
    $this->cashier = User::factory()->create(['status' => 'active', 'email_verified_at' => now()]);
});

function makeSaleService(): SaleService
{
    return new SaleService(new TaxService(), new DiscountService(), new InventoryService());
}

function makeProduct(array $attrs = []): Product
{
    $cat = Category::firstOrCreate(['slug' => 'test-cat'], ['name' => 'Test', 'is_active' => true]);

    return Product::create(array_merge([
        'category_id'    => $cat->id,
        'name'           => 'Test Product',
        'sku'            => 'TEST-' . uniqid(),
        'barcode'        => (string) random_int(1000000000000, 9999999999999),
        'unit_of_measure'=> 'piece',
        'cost_price'     => 5000,
        'selling_price'  => 10000,
        'vat_type'       => 'vatable',
        'stock_quantity' => 100,
        'minimum_stock'  => 5,
        'is_active'      => true,
    ], $attrs));
}

test('creates a completed sale with correct totals', function () {
    $product = makeProduct(['selling_price' => 11200, 'vat_type' => 'vatable']);

    $data = new CreateSaleData(
        items: [
            new CartItemData(
                product_id:      $product->id,
                product_name:    $product->name,
                product_sku:     $product->sku,
                product_barcode: $product->barcode,
                unit_price:      11200,
                cost_price:      5000,
                vat_type:        VatType::Vatable,
                quantity:        1,
            ),
        ],
        payments: [
            new PaymentData(payment_method: 'cash', amount: 11200),
        ],
    );

    $service = makeSaleService();
    $sale    = $service->createFromCart($data, $this->cashier);

    expect($sale)->toBeInstanceOf(Sale::class)
        ->and($sale->status->value)->toBe('completed')
        ->and($sale->subtotal)->toBe(11200)
        ->and($sale->vat_amount)->toBe(1200)
        ->and($sale->vatable_sales)->toBe(10000) // net
        ->and($sale->total_amount)->toBe(11200)
        ->and($sale->change_amount)->toBe(0)
        ->and($sale->items)->toHaveCount(1);
});

test('deducts stock on sale', function () {
    $product = makeProduct(['stock_quantity' => 10]);

    $data = new CreateSaleData(
        items: [
            new CartItemData(
                product_id:      $product->id,
                product_name:    $product->name,
                product_sku:     $product->sku,
                product_barcode: $product->barcode,
                unit_price:      $product->selling_price,
                cost_price:      $product->cost_price,
                vat_type:        VatType::Vatable,
                quantity:        3,
            ),
        ],
        payments: [new PaymentData(payment_method: 'cash', amount: $product->selling_price * 3)],
    );

    makeSaleService()->createFromCart($data, $this->cashier);

    expect($product->fresh()->stock_quantity)->toBe(7);
});

test('calculates change correctly', function () {
    $product = makeProduct(['selling_price' => 10000]);

    $data = new CreateSaleData(
        items: [
            new CartItemData(
                product_id:      $product->id,
                product_name:    $product->name,
                product_sku:     $product->sku,
                product_barcode: $product->barcode,
                unit_price:      10000,
                cost_price:      5000,
                vat_type:        VatType::Vatable,
                quantity:        1,
            ),
        ],
        payments: [new PaymentData(payment_method: 'cash', amount: 20000)],
    );

    $sale = makeSaleService()->createFromCart($data, $this->cashier);

    expect($sale->amount_tendered)->toBe(20000)
        ->and($sale->change_amount)->toBe(10000);
});

test('throws exception when payment is insufficient', function () {
    $product = makeProduct(['selling_price' => 10000]);

    $data = new CreateSaleData(
        items: [
            new CartItemData(
                product_id:      $product->id,
                product_name:    $product->name,
                product_sku:     $product->sku,
                product_barcode: $product->barcode,
                unit_price:      10000,
                cost_price:      5000,
                vat_type:        VatType::Vatable,
                quantity:        1,
            ),
        ],
        payments: [new PaymentData(payment_method: 'cash', amount: 5000)],
    );

    expect(fn () => makeSaleService()->createFromCart($data, $this->cashier))
        ->toThrow(\Illuminate\Validation\ValidationException::class);
});

test('applies transaction discount correctly', function () {
    $product = makeProduct(['selling_price' => 10000]);

    // 10% discount (1000 basis points)
    $data = new CreateSaleData(
        items: [
            new CartItemData(
                product_id:      $product->id,
                product_name:    $product->name,
                product_sku:     $product->sku,
                product_barcode: $product->barcode,
                unit_price:      10000,
                cost_price:      5000,
                vat_type:        VatType::Vatable,
                quantity:        1,
            ),
        ],
        payments:       [new PaymentData(payment_method: 'cash', amount: 9000)],
        discount_type:  'percentage',
        discount_value: 1000,
    );

    $sale = makeSaleService()->createFromCart($data, $this->cashier);

    expect($sale->discount_amount)->toBe(1000) // ₱10
        ->and($sale->total_amount)->toBe(9000); // ₱90
});

test('handles VAT-exempt items correctly', function () {
    $product = makeProduct(['selling_price' => 5000, 'vat_type' => 'vat_exempt']);

    $data = new CreateSaleData(
        items: [
            new CartItemData(
                product_id:      $product->id,
                product_name:    $product->name,
                product_sku:     $product->sku,
                product_barcode: $product->barcode,
                unit_price:      5000,
                cost_price:      3000,
                vat_type:        VatType::VatExempt,
                quantity:        1,
            ),
        ],
        payments: [new PaymentData(payment_method: 'cash', amount: 5000)],
    );

    $sale = makeSaleService()->createFromCart($data, $this->cashier);

    expect($sale->vat_amount)->toBe(0)
        ->and($sale->vat_exempt_sales)->toBe(5000)
        ->and($sale->vatable_sales)->toBe(0);
});
