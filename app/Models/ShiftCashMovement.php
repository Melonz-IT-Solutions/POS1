<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftCashMovement extends Model
{
    protected $fillable = ['shift_id', 'type', 'amount', 'reason', 'user_id'];

    protected function casts(): array
    {
        return ['amount' => 'integer'];
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
