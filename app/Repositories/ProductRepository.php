<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository implements ProductRepositoryInterface
{
    public function findById(int $id): ?Product
    {
        return Product::with('category')->find($id);
    }

    public function findByBarcode(string $barcode): ?Product
    {
        return Product::with('category')
            ->where('barcode', $barcode)
            ->where('is_active', true)
            ->first();
    }

    public function findBySku(string $sku): ?Product
    {
        return Product::with('category')
            ->where('sku', $sku)
            ->where('is_active', true)
            ->first();
    }

    public function search(string $term, int $limit = 10): Collection
    {
        return Product::with('category')
            ->active()
            ->search($term)
            ->limit($limit)
            ->get();
    }

    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Product::with('category');

        if (! empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['low_stock']) && $filters['low_stock']) {
            $query->lowStock();
        }

        $sortField = $filters['sort'] ?? 'name';
        $sortDir   = $filters['direction'] ?? 'asc';

        return $query->orderBy($sortField, $sortDir)->paginate($perPage);
    }

    public function lowStock(): Collection
    {
        return Product::with('category')
            ->active()
            ->lowStock()
            ->orderBy('stock_quantity')
            ->get();
    }
}
