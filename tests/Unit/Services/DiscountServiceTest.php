<?php

use App\Services\DiscountService;

describe('DiscountService - Transaction Discount', function () {

    test('calculates percentage discount correctly', function () {
        $service = new DiscountService();

        // 10% (1000 basis points) on ₱1,000 subtotal (100000 centavos)
        $amount = $service->calculateTransactionDiscount('percentage', 1000, 100000);

        expect($amount)->toBe(10000); // ₱100
    });

    test('calculates fixed discount correctly', function () {
        $service = new DiscountService();

        $amount = $service->calculateTransactionDiscount('fixed', 5000, 100000);

        expect($amount)->toBe(5000); // ₱50
    });

    test('fixed discount cannot exceed subtotal', function () {
        $service = new DiscountService();

        $amount = $service->calculateTransactionDiscount('fixed', 200000, 100000);

        expect($amount)->toBe(100000); // capped at subtotal
    });

    test('zero discount value returns zero', function () {
        $service = new DiscountService();

        $amount = $service->calculateTransactionDiscount('percentage', 0, 100000);

        expect($amount)->toBe(0);
    });

    test('20% senior discount (2000 basis points)', function () {
        $service = new DiscountService();

        // 2000 basis points = 20% of ₱1,000
        $amount = $service->calculateTransactionDiscount('percentage', 2000, 100000);

        expect($amount)->toBe(20000); // ₱200
    });
});
