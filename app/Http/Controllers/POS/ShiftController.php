<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Services\ShiftService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ShiftController extends Controller
{
    public function __construct(private readonly ShiftService $shiftService) {}

    public function current(Request $request): JsonResponse
    {
        $shift = $request->user()->currentShift();

        return response()->json([
            'shift' => $shift?->load('cashier'),
        ]);
    }

    public function open(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'opening_float' => ['required', 'integer', 'min:0'],
        ]);

        $shift = $this->shiftService->open($request->user(), $validated['opening_float']);

        return response()->json([
            'message' => 'Shift opened.',
            'shift'   => $shift,
        ], 201);
    }

    public function close(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'closing_cash' => ['required', 'integer', 'min:0'],
            'notes'        => ['nullable', 'string', 'max:500'],
        ]);

        $shift = $request->user()->currentShift();

        if (! $shift) {
            throw ValidationException::withMessages(['shift' => 'No open shift found.']);
        }

        $shift = $this->shiftService->close(
            shift:        $shift,
            closingCash:  $validated['closing_cash'],
            notes:        $validated['notes'] ?? null,
        );

        return response()->json([
            'message' => 'Shift closed.',
            'shift'   => $shift,
        ]);
    }

    public function cashIn(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $shift = $request->user()->currentShift();
        if (! $shift) {
            throw ValidationException::withMessages(['shift' => 'No open shift.']);
        }

        $this->shiftService->cashMovement($shift, 'cash_in', $validated['amount'], $validated['reason'], $request->user());

        return response()->json(['message' => 'Cash in recorded.']);
    }

    public function cashOut(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $shift = $request->user()->currentShift();
        if (! $shift) {
            throw ValidationException::withMessages(['shift' => 'No open shift.']);
        }

        $this->shiftService->cashMovement($shift, 'cash_out', $validated['amount'], $validated['reason'], $request->user());

        return response()->json(['message' => 'Cash out recorded.']);
    }
}
