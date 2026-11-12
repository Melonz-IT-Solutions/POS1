<?php

namespace App\Models;

use App\Enums\PaymentMethodType;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'name', 'code', 'type', 'requires_reference', 'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'type'               => PaymentMethodType::class,
            'requires_reference' => 'boolean',
            'is_active'          => 'boolean',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
