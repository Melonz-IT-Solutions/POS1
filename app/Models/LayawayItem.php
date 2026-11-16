<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LayawayItem extends Model
{
    protected $fillable = [
        'layaway_id', 'product_id', 'product_name', 'product_sku',
        'quantity', 'unit_price', 'total',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'integer',
            'total'      => 'integer',
            'quantity'   => 'integer',
        ];
    }

    public function layaway(): BelongsTo
    {
        return $this->belongsTo(Layaway::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
