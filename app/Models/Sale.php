<?php

namespace App\Models;

use App\Enums\SaleStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'receipt_number', 'customer_id', 'cashier_id', 'shift_id', 'status',
        'subtotal', 'discount_type', 'discount_value', 'discount_amount',
        'vatable_sales', 'vat_exempt_sales', 'zero_rated_sales', 'vat_amount',
        'total_amount', 'amount_tendered', 'change_amount', 'notes',
        'sc_name', 'sc_id_no', 'pwd_name', 'pwd_id_no',
        'voided_by', 'voided_at', 'void_reason',
        'original_sale_id', 'parked_at',
    ];

    protected function casts(): array
    {
        return [
            'status'          => SaleStatus::class,
            'subtotal'        => 'integer',
            'discount_value'  => 'integer',
            'discount_amount' => 'integer',
            'vatable_sales'   => 'integer',
            'vat_exempt_sales'=> 'integer',
            'zero_rated_sales'=> 'integer',
            'vat_amount'      => 'integer',
            'total_amount'    => 'integer',
            'amount_tendered' => 'integer',
            'change_amount'   => 'integer',
            'voided_at'       => 'datetime',
            'parked_at'       => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(SalePayment::class);
    }

    public function voidedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'voided_by');
    }

    public function originalSale(): BelongsTo
    {
        return $this->belongsTo(Sale::class, 'original_sale_id');
    }

    public function refunds(): HasMany
    {
        return $this->hasMany(Sale::class, 'original_sale_id');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', SaleStatus::Completed);
    }

    public function scopeHeld($query)
    {
        return $query->where('status', SaleStatus::Held);
    }

    public function isSeniorOrPwd(): bool
    {
        return $this->sc_id_no !== null || $this->pwd_id_no !== null;
    }
}
