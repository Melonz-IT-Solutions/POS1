<?php

namespace App\Jobs;

use App\Models\Shift;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotifyTelegramShiftOpened implements ShouldQueue
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

        $shift   = $this->shift->loadMissing('cashier');
        $cashier = $shift->cashier?->name ?? 'Unknown';
        $float   = number_format($shift->opening_float / 100, 2);
        $time    = $shift->opened_at->setTimezone('Asia/Manila')->format('M d, Y g:i A');

        $message = implode("\n", [
            '🟢 *Shift Opened — ' . config('app.name') . '*',
            '',
            '🏷 Cashier: ' . $cashier,
            '💵 Opening Float: ₱' . $float,
            '🕐 Opened At: ' . $time,
        ]);

        $response = Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
            'chat_id'    => $chatId,
            'text'       => $message,
            'parse_mode' => 'Markdown',
        ]);

        if (! $response->successful()) {
            Log::warning('Telegram shift-opened notification failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
        }
    }
}
