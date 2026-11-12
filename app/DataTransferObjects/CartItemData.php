<?php

namespace App\DataTransferObjects;

use App\Enums\VatType;

readonly class CartItemData
{
    public function __construct(
        public int $product_id,
        public string $product_name,
        public string $product_sku,
        public ?string $product_barcode,
        public int $unit_price,       // centavos
        public int $cost_price,       // centavos
        public VatType $vat_type,
        public int $quantity,
        public ?string $discount_type = null,  // percentage|fixed
        public int $discount_value = 0,
    ) {}

    public function discountAmount(): int
    {
        if ($this->discount_type === null || $this->discount_value === 0) {
            return 0;
        }

        $gross = $this->unit_price * $this->quantity;

        return match ($this->discount_type) {
            'percentage' => (int) round($gross * $this->discount_value / 10000), // value in basis points
            'fixed'      => min($this->discount_value, $gross),
            default      => 0,
        };
    }

    public function lineTotal(): int
    {
        $gross = $this->unit_price * $this->quantity;

        return $gross - $this->discountAmount();
    }
}
