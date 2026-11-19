<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemoProduct extends Model
{
    protected $fillable = [
        'store_type',
        'name',
        'sku',
        'category',
        'price_cents',
        'stock',
        'barcode',
        'image_path',
    ];

    protected $casts = [
        'price_cents' => 'integer',
        'stock'       => 'integer',
    ];
}
