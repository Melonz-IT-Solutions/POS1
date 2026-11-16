<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class GiftCard extends Model
{
    protected $fillable = [
        'code', 'initial_value', 'current_balance', 'issued_to',
        'customer_id', 'status', 'expires_at', 'issued_by', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'initial_value'   => 'integer',
            'current_balance' => 'integer',
            'expires_at'      => 'date',
        ];
    }

    public function issuer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(GiftCardTransaction::class);
    }

    public function isActive(): bool   { return $this->status === 'active' && $this->current_balance > 0; }
    public function isExpired(): bool  { return $this->expires_at && $this->expires_at->isPast(); }

    public static function generateCode(): string
    {
        do {
            $code = strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4));
        } while (static::where('code', $code)->exists());

        return $code;
    }
}
