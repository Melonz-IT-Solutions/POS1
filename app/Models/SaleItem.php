<?php

namespace App\Models;

use App\Enums\VatType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id', 'product_id', 'product_name', 'product_sku',
        'product_barcode', 'vat_type', 'unit_price', 'cost_price',
        'quantity', 'discount_type', 'discount_value', 'discount_amount',
        'line_total', 'vat_amount',
    ];

    protected function casts(): array
    {
        return [
            'vat_type'       => VatType::class,
            'unit_price'     => 'integer',
            'cost_price'     => 'integer',
            'quantity'       => 'integer',
            'discount_value' => 'integer',
            'discount_amount'=> 'integer',
            'line_total'     => 'integer',
            'vat_amount'     => 'integer',
        ];
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function netAmount(): int
    {
        return $this->line_total - $this->vat_amount;
    }
}
