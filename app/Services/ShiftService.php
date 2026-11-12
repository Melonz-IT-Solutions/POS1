<?php

namespace App\Services;

use App\Enums\ShiftStatus;
use App\Models\AuditLog;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ShiftService
{
    public function open(User $cashier, int $openingFloat): Shift
    {
        if ($cashier->currentShift()) {
            throw ValidationException::withMessages([
                'shift' => 'You already have an open shift.',
            ]);
        }

        $shift = Shift::create([
            'cashier_id'    => $cashier->id,
            'opened_at'     => now(),
            'opening_float' => $openingFloat,
            'status'        => ShiftStatus::Open,
        ]);

        AuditLog::record('shift.opened', $shift, [], ['opening_float' => $openingFloat]);

        return $shift;
    }

    public function close(Shift $shift, int $closingCash, ?string $notes = null): Shift
    {
        if (! $shift->isOpen()) {
            throw ValidationException::withMessages([
                'shift' => 'This shift is already closed.',
            ]);
        }

        $cashSales    = $shift->sales()
            ->where('status', 'completed')
            ->join('sale_payments', 'sales.id', '=', 'sale_payments.sale_id')
            ->where('sale_payments.payment_method', 'cash')
            ->sum('sale_payments.amount');

        $cashIn       = $shift->totalCashIn();
        $cashOut      = $shift->totalCashOut();
        $expectedCash = $shift->opening_float + $cashSales + $cashIn - $cashOut;
        $overShort    = $closingCash - $expectedCash;

        $shift->update([
            'status'        => ShiftStatus::Closed,
            'closed_at'     => now(),
            'closing_cash'  => $closingCash,
            'expected_cash' => $expectedCash,
            'over_short'    => $overShort,
            'notes'         => $notes,
        ]);

        AuditLog::record('shift.closed', $shift, [], [
            'closing_cash'  => $closingCash,
            'expected_cash' => $expectedCash,
            'over_short'    => $overShort,
        ]);

        return $shift->fresh(['cashier', 'sales']);
    }

    public function cashMovement(Shift $shift, string $type, int $amount, string $reason, User $user): void
    {
        $shift->cashMovements()->create([
            'type'    => $type,
            'amount'  => $amount,
            'reason'  => $reason,
            'user_id' => $user->id,
        ]);

        AuditLog::record("shift.{$type}", $shift, [], ['amount' => $amount, 'reason' => $reason]);
    }
}
