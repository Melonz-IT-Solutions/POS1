<?php

namespace App\Models;

use App\Enums\VatType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id', 'name', 'description', 'sku', 'barcode',
        'unit_of_measure', 'cost_price', 'selling_price', 'vat_type',
        'stock_quantity', 'minimum_stock', 'is_active', 'is_bundle', 'image_path',
    ];

    protected function casts(): array
    {
        return [
            'vat_type'       => VatType::class,
            'is_active'      => 'boolean',
            'is_bundle'      => 'boolean',
            'cost_price'     => 'integer',
            'selling_price'  => 'integer',
            'stock_quantity' => 'integer',
            'minimum_stock'  => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->sku)) {
                $product->sku = strtoupper(Str::random(8));
            }
            if (empty($product->barcode)) {
                $product->barcode = static::generateBarcode();
            }
        });
    }

    public static function generateBarcode(): string
    {
        do {
            $barcode = (string) random_int(1000000000000, 9999999999999);
        } while (static::withTrashed()->where('barcode', $barcode)->exists());

        return $barcode;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function suppliers(): BelongsToMany
    {
        return $this->belongsToMany(Supplier::class, 'product_suppliers');
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function priceHistory(): HasMany
    {
        return $this->hasMany(PriceHistory::class)->latest();
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function bundleItems(): HasMany
    {
        return $this->hasMany(ProductBundleItem::class, 'bundle_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->whereRaw('stock_quantity <= minimum_stock AND minimum_stock > 0');
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'like', "%{$term}%")
              ->orWhere('sku', $term)
              ->orWhere('barcode', $term);
        });
    }

    public function isLowStock(): bool
    {
        return $this->minimum_stock > 0 && $this->stock_quantity <= $this->minimum_stock;
    }

    public function sellingPriceInPesos(): float
    {
        return $this->selling_price / 100;
    }

    public function costPriceInPesos(): float
    {
        return $this->cost_price / 100;
    }
}
