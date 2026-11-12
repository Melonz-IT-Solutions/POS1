<?php

namespace App\Models;

use App\Enums\ShiftStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    protected $fillable = [
        'cashier_id', 'opened_at', 'closed_at', 'opening_float',
        'closing_cash', 'expected_cash', 'over_short', 'status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'status'        => ShiftStatus::class,
            'opened_at'     => 'datetime',
            'closed_at'     => 'datetime',
            'opening_float' => 'integer',
            'closing_cash'  => 'integer',
            'expected_cash' => 'integer',
            'over_short'    => 'integer',
        ];
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function cashMovements(): HasMany
    {
        return $this->hasMany(ShiftCashMovement::class);
    }

    public function isOpen(): bool
    {
        return $this->status === ShiftStatus::Open;
    }

    public function totalSales(): int
    {
        return $this->sales()
            ->where('status', 'completed')
            ->sum('total_amount');
    }

    public function totalCashIn(): int
    {
        return $this->cashMovements()->where('type', 'cash_in')->sum('amount');
    }

    public function totalCashOut(): int
    {
        return $this->cashMovements()->where('type', 'cash_out')->sum('amount');
    }
}
