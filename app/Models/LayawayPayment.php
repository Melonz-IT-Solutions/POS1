<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LayawayPayment extends Model
{
    protected $fillable = [
        'layaway_id', 'amount', 'payment_method', 'reference', 'received_by', 'notes',
    ];

    protected function casts(): array
    {
        return ['amount' => 'integer'];
    }

    public function layaway(): BelongsTo
    {
        return $this->belongsTo(Layaway::class);
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }
}
