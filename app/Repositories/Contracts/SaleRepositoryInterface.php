<?php

namespace App\Repositories\Contracts;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface SaleRepositoryInterface
{
    public function findByReceiptNumber(string $receiptNumber): ?Sale;

    public function heldTransactions(User $cashier): Collection;

    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator;

    public function export(array $filters = []): Collection;

    public function todaysSummary(): array;
}
