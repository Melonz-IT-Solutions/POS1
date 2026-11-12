<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseOrderItem extends Model
{
    protected $fillable = [
        'purchase_order_id', 'product_id', 'quantity_ordered',
        'quantity_received', 'unit_cost', 'total_cost',
    ];

    protected function casts(): array
    {
        return [
            'quantity_ordered'  => 'integer',
            'quantity_received' => 'integer',
            'unit_cost'         => 'integer',
            'total_cost'        => 'integer',
        ];
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function remainingQuantity(): int
    {
        return $this->quantity_ordered - $this->quantity_received;
    }
}
