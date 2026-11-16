<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GiftCardTransaction extends Model
{
    protected $fillable = [
        'gift_card_id', 'type', 'amount', 'balance_before', 'balance_after',
        'sale_id', 'processed_by', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount'         => 'integer',
            'balance_before' => 'integer',
            'balance_after'  => 'integer',
        ];
    }

    public function giftCard(): BelongsTo
    {
        return $this->belongsTo(GiftCard::class);
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }
}
