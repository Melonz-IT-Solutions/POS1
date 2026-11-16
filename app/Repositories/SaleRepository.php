<?php

namespace App\Repositories;

use App\Models\Sale;
use App\Models\User;
use App\Repositories\Contracts\SaleRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class SaleRepository implements SaleRepositoryInterface
{
    public function findByReceiptNumber(string $receiptNumber): ?Sale
    {
        return Sale::with(['items.product', 'payments', 'customer', 'cashier'])
            ->where('receipt_number', $receiptNumber)
            ->first();
    }

    public function heldTransactions(User $cashier): Collection
    {
        return Sale::with(['items', 'customer'])
            ->where('cashier_id', $cashier->id)
            ->where('status', 'held')
            ->orderByDesc('parked_at')
            ->get();
    }

    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = Sale::with(['customer', 'cashier'])
            ->whereNotIn('status', ['held']);

        if (! empty($filters['search'])) {
            $query->where('receipt_number', 'like', "%{$filters['search']}%");
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['cashier_id'])) {
            $query->where('cashier_id', $filters['cashier_id']);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (! empty($filters['payment_method'])) {
            $query->whereHas('payments', fn ($q) => $q->where('payment_method', $filters['payment_method']));
        }

        return $query->orderByDesc('created_at')->paginate($perPage);
    }

    public function export(array $filters = []): Collection
    {
        $query = Sale::with(['customer:id,name', 'cashier:id,name', 'payments'])
            ->whereNotIn('status', ['held']);

        if (! empty($filters['search'])) {
            $query->where('receipt_number', 'like', "%{$filters['search']}%");
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (! empty($filters['cashier_id'])) {
            $query->where('cashier_id', $filters['cashier_id']);
        }

        if (! empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (! empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        if (! empty($filters['payment_method'])) {
            $query->whereHas('payments', fn ($q) => $q->where('payment_method', $filters['payment_method']));
        }

        return $query->orderByDesc('created_at')->get();
    }

    public function todaysSummary(): array
    {
        $today = now()->toDateString();

        $sales = Sale::where('status', 'completed')
            ->whereDate('created_at', $today);

        return [
            'total_revenue'    => (int) $sales->sum('total_amount'),
            'transaction_count'=> (int) $sales->count(),
            'average_sale'     => $sales->count() > 0
                ? (int) round($sales->sum('total_amount') / $sales->count())
                : 0,
        ];
    }
}
