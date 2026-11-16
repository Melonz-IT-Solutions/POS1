<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    protected $fillable = [
        'category',
        'description',
        'amount',
        'expense_date',
        'reference',
        'shift_id',
        'recorded_by',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'amount'       => 'integer',
            'expense_date' => 'date',
        ];
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public static function categories(): array
    {
        return [
            'supplies'    => 'Supplies & Materials',
            'utilities'   => 'Utilities',
            'rent'        => 'Rent & Lease',
            'payroll'     => 'Payroll & Benefits',
            'maintenance' => 'Maintenance & Repairs',
            'marketing'   => 'Marketing & Advertising',
            'transport'   => 'Transportation & Delivery',
            'other'       => 'Other',
        ];
    }
}
