<?php

namespace App\Models;

use App\Enums\DiscountType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Discount extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'code', 'type', 'value', 'min_purchase',
        'start_at', 'end_at', 'is_active', 'scope',
    ];

    protected function casts(): array
    {
        return [
            'type'         => DiscountType::class,
            'value'        => 'integer',
            'min_purchase' => 'integer',
            'is_active'    => 'boolean',
            'start_at'     => 'datetime',
            'end_at'       => 'datetime',
        ];
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'discount_products');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'discount_categories');
    }

    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'discount_customers');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_at')->orWhere('start_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_at')->orWhere('end_at', '>=', now());
            });
    }

    public function isCurrentlyActive(): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($this->start_at && $this->start_at->isFuture()) {
            return false;
        }
        if ($this->end_at && $this->end_at->isPast()) {
            return false;
        }

        return true;
    }
}
