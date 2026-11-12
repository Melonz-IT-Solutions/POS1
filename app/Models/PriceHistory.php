<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceHistory extends Model
{
    protected $fillable = [
        'product_id', 'old_cost_price', 'new_cost_price',
        'old_selling_price', 'new_selling_price', 'changed_by', 'reason',
    ];

    protected function casts(): array
    {
        return [
            'old_cost_price'     => 'integer',
            'new_cost_price'     => 'integer',
            'old_selling_price'  => 'integer',
            'new_selling_price'  => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
