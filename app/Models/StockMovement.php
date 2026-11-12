<?php

namespace App\Models;

use App\Enums\StockMovementType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id', 'type', 'quantity', 'quantity_before', 'quantity_after',
        'unit_cost', 'reference_type', 'reference_id', 'reason', 'user_id',
    ];

    protected function casts(): array
    {
        return [
            'type'            => StockMovementType::class,
            'quantity'        => 'integer',
            'quantity_before' => 'integer',
            'quantity_after'  => 'integer',
            'unit_cost'       => 'integer',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo('reference');
    }
}
