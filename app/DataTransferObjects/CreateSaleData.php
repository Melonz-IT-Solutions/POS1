<?php

namespace App\DataTransferObjects;

readonly class CreateSaleData
{
    /**
     * @param  CartItemData[]  $items
     * @param  PaymentData[]   $payments
     */
    public function __construct(
        public array $items,
        public array $payments,
        public ?int $customer_id = null,
        public ?string $discount_type = null,
        public int $discount_value = 0,
        public ?string $notes = null,
        // Senior Citizen / PWD
        public ?string $sc_name = null,
        public ?string $sc_id_no = null,
        public ?string $pwd_name = null,
        public ?string $pwd_id_no = null,
    ) {}
}
