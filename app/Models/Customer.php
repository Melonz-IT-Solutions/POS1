<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'phone', 'email', 'address', 'notes',
        'discount_rate', 'loyalty_points', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active'      => 'boolean',
            'discount_rate'  => 'integer',
            'loyalty_points' => 'integer',
        ];
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function loyaltyTransactions(): HasMany
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('phone', 'like', "%{$term}%")
              ->orWhere('email', 'like', "%{$term}%");
        });
    }

    public function discountRatePercent(): float
    {
        return $this->discount_rate / 100;
    }

    public function totalSpent(): int
    {
        return $this->sales()
            ->where('status', 'completed')
            ->sum('total_amount');
    }
}
