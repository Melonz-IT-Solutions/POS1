<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\GiftCard;
use App\Models\GiftCardTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class GiftCardController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', GiftCard::class);

        $query = GiftCard::with(['issuer:id,name', 'customer:id,name'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $like = '%' . $request->search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('code', 'like', $like)
                  ->orWhere('issued_to', 'like', $like);
            });
        }

        return Inertia::render('gift-cards/Index', [
            'giftCards' => $query->paginate(25)->withQueryString(),
            'filters'   => $request->only(['status', 'search']),
            'summary'   => [
                'active_count'    => GiftCard::where('status', 'active')->count(),
                'total_liability' => (int) GiftCard::where('status', 'active')->sum('current_balance'),
                'total_issued'    => (int) GiftCard::sum('initial_value'),
                'total_redeemed'  => (int) GiftCard::selectRaw('SUM(initial_value - current_balance)')->value('SUM(initial_value - current_balance)'),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', GiftCard::class);

        return Inertia::render('gift-cards/Create', [
            'customers'    => Customer::active()->orderBy('name')->get(['id', 'name', 'phone']),
            'suggestedCode' => GiftCard::generateCode(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', GiftCard::class);

        $data = $request->validate([
            'code'        => ['required', 'string', 'unique:gift_cards,code'],
            'value'       => ['required', 'numeric', 'min:1'],
            'issued_to'   => ['nullable', 'string', 'max:255'],
            'customer_id' => ['nullable', 'integer', 'exists:customers,id'],
            'expires_at'  => ['nullable', 'date', 'after:today'],
            'notes'       => ['nullable', 'string', 'max:1000'],
        ]);

        $valueCents = (int) round((float) $data['value'] * 100);

        $card = DB::transaction(function () use ($data, $valueCents) {
            $card = GiftCard::create([
                'code'            => strtoupper($data['code']),
                'initial_value'   => $valueCents,
                'current_balance' => $valueCents,
                'issued_to'       => $data['issued_to'] ?? null,
                'customer_id'     => $data['customer_id'] ?? null,
                'status'          => 'active',
                'expires_at'      => $data['expires_at'] ?? null,
                'issued_by'       => auth()->id(),
                'notes'           => $data['notes'] ?? null,
            ]);

            GiftCardTransaction::create([
                'gift_card_id'  => $card->id,
                'type'          => 'issue',
                'amount'        => $valueCents,
                'balance_before'=> 0,
                'balance_after' => $valueCents,
                'processed_by'  => auth()->id(),
                'notes'         => 'Gift card issued',
            ]);

            AuditLog::record('gift_card.create', $card, [], $card->toArray());

            return $card;
        });

        return redirect()->route('admin.gift-cards.show', $card)
            ->with('success', "Gift card {$card->code} issued.");
    }

    public function show(GiftCard $giftCard): Response
    {
        $this->authorize('view', $giftCard);

        $giftCard->load([
            'issuer:id,name',
            'customer:id,name,phone',
            'transactions.processor:id,name',
        ]);

        return Inertia::render('gift-cards/Show', [
            'giftCard' => $giftCard,
        ]);
    }

    public function redeem(Request $request, GiftCard $giftCard): RedirectResponse
    {
        $this->authorize('redeem', $giftCard);

        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'notes'  => ['nullable', 'string', 'max:500'],
        ]);

        $amountCents = (int) round((float) $data['amount'] * 100);

        abort_if($amountCents > $giftCard->current_balance, 422, 'Insufficient gift card balance.');

        DB::transaction(function () use ($giftCard, $amountCents, $data) {
            $before = $giftCard->current_balance;
            $after  = $before - $amountCents;

            $giftCard->update([
                'current_balance' => $after,
                'status'          => $after === 0 ? 'depleted' : 'active',
            ]);

            GiftCardTransaction::create([
                'gift_card_id'   => $giftCard->id,
                'type'           => 'redeem',
                'amount'         => -$amountCents,
                'balance_before' => $before,
                'balance_after'  => $after,
                'processed_by'   => auth()->id(),
                'notes'          => $data['notes'] ?? null,
            ]);

            AuditLog::record('gift_card.redeem', $giftCard, [], ['amount' => $amountCents]);
        });

        return back()->with('success', 'Redemption recorded.');
    }

    public function cancel(GiftCard $giftCard): RedirectResponse
    {
        $this->authorize('cancel', $giftCard);

        DB::transaction(function () use ($giftCard) {
            $before = $giftCard->current_balance;
            $giftCard->update(['status' => 'cancelled', 'current_balance' => 0]);

            GiftCardTransaction::create([
                'gift_card_id'   => $giftCard->id,
                'type'           => 'cancel',
                'amount'         => -$before,
                'balance_before' => $before,
                'balance_after'  => 0,
                'processed_by'   => auth()->id(),
                'notes'          => 'Card cancelled by admin',
            ]);

            AuditLog::record('gift_card.cancel', $giftCard, [], []);
        });

        return redirect()->route('admin.gift-cards.index')
            ->with('success', "Gift card {$giftCard->code} cancelled.");
    }

    public function checkBalance(Request $request): JsonResponse
    {
        $code = strtoupper(trim($request->input('code', '')));
        $card = GiftCard::where('code', $code)->first();

        if (! $card) {
            return response()->json(['error' => 'Gift card not found.'], 404);
        }

        return response()->json([
            'code'            => $card->code,
            'current_balance' => $card->current_balance,
            'status'          => $card->status,
            'expires_at'      => $card->expires_at?->toDateString(),
        ]);
    }
}
