<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ProductRepositoryInterface
{
    public function findById(int $id): ?Product;

    public function findByBarcode(string $barcode): ?Product;

    public function findBySku(string $sku): ?Product;

    public function search(string $term, int $limit = 10): Collection;

    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function lowStock(): Collection;
}
