<?php

namespace App\Jobs;

use App\Models\Sale;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotifyTelegramSale implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public readonly Sale $sale)
    {
    }

    public function handle(): void
    {
        $token  = config('services.telegram.bot_token');
        $chatId = config('services.telegram.chat_id');

        if (! $token || ! $chatId) {
            return;
        }

        $sale = $this->sale->loadMissing(['items', 'payments', 'customer', 'cashier']);

        $total    = number_format($sale->total_amount / 100, 2);
        $cashier  = $sale->cashier?->name ?? 'Unknown';
        $customer = $sale->customer?->name ?? 'Walk-in';
        $items   = $sale->items->map(fn ($item) => $item->product_name . ' x' . $item->quantity)->implode(', ');
        $quantity    = $sale->items->count();
        $methods  = $sale->payments->pluck('payment_method')->unique()->implode(', ');
        $receipt  = $sale->receipt_number;

        $message = implode("\n", [
            '🛒 *New Sale — ' . config('app.name') . '*',
            '',
            '📄 Receipt: `' . $receipt . '`',
            '💰 Total: *₱' . $total . '*',
            '🧾 Items: ' . $items,
            '🔢 Quantity: ' . $quantity,
            '💳 Payment: ' . $methods,
            '👤 Customer: ' . $customer,
            '🏷 Cashier: ' . $cashier,
            '🕐 ' . $sale->created_at->setTimezone('Asia/Manila')->format('M d, Y g:i A'),
        ]);

        $response = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id'    => $chatId,
            'text'       => $message,
            'parse_mode' => 'Markdown',
        ]);

        if (! $response->successful()) {
            Log::warning('Telegram sale notification failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
        }
    }
}
