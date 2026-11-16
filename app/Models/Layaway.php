<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Layaway extends Model
{
    protected $fillable = [
        'layaway_number', 'customer_id', 'total_amount', 'deposit_paid',
        'balance', 'due_date', 'status', 'notes', 'created_by',
        'completed_at', 'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'total_amount'  => 'integer',
            'deposit_paid'  => 'integer',
            'balance'       => 'integer',
            'due_date'      => 'date',
            'completed_at'  => 'datetime',
            'cancelled_at'  => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(LayawayItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(LayawayPayment::class);
    }

    public function isActive(): bool    { return $this->status === 'active'; }
    public function isCompleted(): bool { return $this->status === 'completed'; }
    public function isCancelled(): bool { return $this->status === 'cancelled'; }
}
