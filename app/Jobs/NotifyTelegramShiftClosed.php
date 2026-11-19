<?php

namespace App\Jobs;

use App\Models\Shift;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotifyTelegramShiftClosed implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public readonly Shift $shift) {}

    public function handle(): void
    {
        $token  = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if (! $token || ! $chatId) {
            return;
        }

        $shift = $this->shift->loadMissing(['cashier', 'sales.items']);

        $cashier      = $shift->cashier?->name ?? 'Unknown';
        $completedSales = $shift->sales->where('status', 'completed');
        $totalSales   = number_format($completedSales->sum('total_amount') / 100, 2);
        $totalTxns    = $completedSales->count();
        $totalItems   = $completedSales->sum(fn ($sale) => $sale->items->sum('quantity'));

        // Duration
        $openedAt  = $shift->opened_at->setTimezone('Asia/Manila');
        $closedAt  = $shift->closed_at->setTimezone('Asia/Manila');
        $minutes   = $openedAt->diffInMinutes($closedAt);
        $hours     = intdiv($minutes, 60);
        $mins      = $minutes % 60;
        $duration  = $hours > 0 ? "{$hours}h {$mins}m" : "{$mins}m";

        // Cash variance
        $overShort = $shift->over_short;
        $variance  = ($overShort >= 0 ? '+' : '') . '₱' . number_format(abs($overShort) / 100, 2);
        $varianceLabel = $overShort >= 0 ? '✅ Over' : '⚠️ Short';

        $message = implode("\n", [
            '🔴 *Shift Closed — ' . config('app.name') . '*',
            '',
            '🏷 Cashier: ' . $cashier,
            '⏱ Duration: ' . $duration,
            '🕐 ' . $openedAt->format('g:i A') . ' → ' . $closedAt->format('g:i A'),
            '',
            '💰 Total Sales: *₱' . $totalSales . '*',
            '🧾 Transactions: ' . $totalTxns,
            '📦 Items Sold: ' . $totalItems,
            '',
            $varianceLabel . ' Cash Variance: ' . $variance,
        ]);

        $response = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id'    => $chatId,
            'text'       => $message,
            'parse_mode' => 'Markdown',
        ]);

        if (! $response->successful()) {
            Log::warning('Telegram shift-closed notification failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
        }
    }
}
