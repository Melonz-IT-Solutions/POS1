<?php

namespace App\DataTransferObjects;

readonly class PaymentData
{
    public function __construct(
        public string $payment_method,
        public int $amount,          // centavos
        public ?string $reference_number = null,
    ) {}
}
