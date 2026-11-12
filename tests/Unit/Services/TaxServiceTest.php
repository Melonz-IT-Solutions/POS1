<?php

use App\Enums\VatType;
use App\Models\Setting;
use App\Services\TaxService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Default: VAT-inclusive at 12%
    Setting::set('vat_inclusive', true, 'tax');
    Setting::set('vat_rate', 12, 'tax');
});

describe('TaxService - VAT Inclusive', function () {

    test('calculates VAT for a VATable amount correctly', function () {
        $service = new TaxService();

        // ₱112.00 (11200 centavos) inclusive → VAT = 12.00, net = 100.00
        $result = $service->calculate(11200, VatType::Vatable, true);

        expect($result['vat_amount'])->toBe(1200)
            ->and($result['vat_base'])->toBe(10000)
            ->and($result['gross'])->toBe(11200);
    });

    test('calculates VAT for ₱65 (Coca-Cola)', function () {
        $service = new TaxService();

        // 6500 centavos VAT-inclusive
        $result = $service->calculate(6500, VatType::Vatable, true);

        // VAT = round(6500 * 12/112) = round(696.43) = 696
        expect($result['vat_amount'])->toBe(696)
            ->and($result['vat_base'])->toBe(5804);
    });

    test('no VAT for VAT-exempt items', function () {
        $service = new TaxService();
        $result  = $service->calculate(5000, VatType::VatExempt, true);

        expect($result['vat_amount'])->toBe(0)
            ->and($result['vat_base'])->toBe(5000);
    });

    test('no VAT for zero-rated items', function () {
        $service = new TaxService();
        $result  = $service->calculate(5000, VatType::ZeroRated, true);

        expect($result['vat_amount'])->toBe(0)
            ->and($result['vat_base'])->toBe(5000);
    });

    test('net + VAT equals gross for VATable amount', function () {
        $service = new TaxService();

        foreach ([1000, 5000, 11200, 25000, 100000] as $amount) {
            $result = $service->calculate($amount, VatType::Vatable, true);
            expect($result['vat_base'] + $result['vat_amount'])->toBe($amount);
        }
    });
});

describe('TaxService - VAT Exclusive', function () {

    test('calculates VAT-exclusive correctly', function () {
        $service = new TaxService();

        // ₱100 exclusive → VAT = ₱12
        $result = $service->calculate(10000, VatType::Vatable, false);

        expect($result['vat_amount'])->toBe(1200)
            ->and($result['vat_base'])->toBe(10000)
            ->and($result['gross'])->toBe(11200);
    });
});

describe('TaxService - Senior/PWD Discount', function () {

    test('applies 20% discount on VAT-exclusive base', function () {
        $service = new TaxService();

        // ₱112 VATable inclusive
        // Net base = ₱100; 20% off = ₱80
        $result = $service->applySeniorPwdDiscount(11200, VatType::Vatable);

        expect($result['final_price'])->toBe(8000)      // ₱80
            ->and($result['discount_amount'])->toBe(2000); // ₱20
    });
});
