<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\Layaway;
use App\Models\LayawayItem;
use App\Models\LayawayPayment;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LayawayController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Layaway::class);

        $query = Layaway::with('customer:id,name,phone')
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $like = '%' . $request->search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('layaway_number', 'like', $like)
                  ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', $like));
            });
        }

        return Inertia::render('layaway/Index', [
            'layaways' => $query->paginate(20)->withQueryString(),
            'filters'  => $request->only(['status', 'search']),
            'summary'  => [
                'active'    => Layaway::where('status', 'active')->count(),
                'overdue'   => Layaway::where('status', 'active')
                    ->whereNotNull('due_date')
                    ->whereDate('due_date', '<', now())
                    ->count(),
                'total_outstanding' => (int) Layaway::where('status', 'active')->sum('balance'),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Layaway::class);

        return Inertia::render('layaway/Create', [
            'customers' => Customer::active()->orderBy('name')
                ->get(['id', 'name', 'phone']),
            'products'  => Product::active()->orderBy('name')
                ->get(['id', 'name', 'sku', 'selling_price']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Layaway::class);

        $data = $request->validate([
            'customer_id'  => ['required', 'integer', 'exists:customers,id'],
            'deposit'      => ['required', 'numeric', 'min:0'],
            'due_date'     => ['nullable', 'date', 'after:today'],
            'notes'        => ['nullable', 'string', 'max:1000'],
            'items'        => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $layaway = null;

        DB::transaction(function () use ($data, &$layaway) {
            $total = 0;
            $itemData = [];
            foreach ($data['items'] as $item) {
                $product = Product::find($item['product_id']);
                $lineTotal = $product->selling_price * $item['quantity'];
                $total += $lineTotal;
                $itemData[] = [
                    'product_id'   => $product->id,
                    'product_name' => $product->name,
                    'product_sku'  => $product->sku,
                    'quantity'     => $item['quantity'],
                    'unit_price'   => $product->selling_price,
                    'total'        => $lineTotal,
                ];
            }

            $depositCents = (int) round((float) $data['deposit'] * 100);

            $layaway = Layaway::create([
                'layaway_number' => $this->generateNumber(),
                'customer_id'    => $data['customer_id'],
                'total_amount'   => $total,
                'deposit_paid'   => $depositCents,
                'balance'        => $total - $depositCents,
                'due_date'       => $data['due_date'] ?? null,
                'status'         => 'active',
                'notes'          => $data['notes'] ?? null,
                'created_by'     => auth()->id(),
            ]);

            foreach ($itemData as $i) {
                LayawayItem::create(['layaway_id' => $layaway->id] + $i);
            }

            if ($depositCents > 0) {
                LayawayPayment::create([
                    'layaway_id'     => $layaway->id,
                    'amount'         => $depositCents,
                    'payment_method' => 'cash',
                    'received_by'    => auth()->id(),
                    'notes'          => 'Initial deposit',
                ]);
            }

            AuditLog::record('layaway.create', $layaway, [], $layaway->toArray());
        });

        return redirect()->route('admin.layaway.show', $layaway)
            ->with('success', "Layaway {$layaway->layaway_number} created.");
    }

    public function show(Layaway $layaway): Response
    {
        $this->authorize('view', $layaway);

        $layaway->load([
            'customer:id,name,phone,email',
            'creator:id,name',
            'items.product:id,name,sku',
            'payments.receiver:id,name',
        ]);

        return Inertia::render('layaway/Show', [
            'layaway'          => $layaway,
            'payment_methods'  => ['cash', 'card', 'gcash', 'maya'],
        ]);
    }

    public function addPayment(Request $request, Layaway $layaway): RedirectResponse
    {
        $this->authorize('update', $layaway);

        $data = $request->validate([
            'amount'         => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string'],
            'reference'      => ['nullable', 'string', 'max:100'],
            'notes'          => ['nullable', 'string', 'max:500'],
        ]);

        $amountCents = (int) round((float) $data['amount'] * 100);

        DB::transaction(function () use ($layaway, $data, $amountCents) {
            LayawayPayment::create([
                'layaway_id'     => $layaway->id,
                'amount'         => $amountCents,
                'payment_method' => $data['payment_method'],
                'reference'      => $data['reference'] ?? null,
                'received_by'    => auth()->id(),
                'notes'          => $data['notes'] ?? null,
            ]);

            $newDeposit = $layaway->deposit_paid + $amountCents;
            $newBalance = max(0, $layaway->total_amount - $newDeposit);

            $layaway->update([
                'deposit_paid' => $newDeposit,
                'balance'      => $newBalance,
                'status'       => $newBalance === 0 ? 'completed' : 'active',
                'completed_at' => $newBalance === 0 ? now() : null,
            ]);

            AuditLog::record('layaway.payment', $layaway, [], ['amount' => $amountCents]);
        });

        return back()->with('success', 'Payment recorded.');
    }

    public function cancel(Layaway $layaway): RedirectResponse
    {
        $this->authorize('cancel', $layaway);

        $layaway->update([
            'status'       => 'cancelled',
            'cancelled_at' => now(),
        ]);

        AuditLog::record('layaway.cancel', $layaway, [], []);

        return redirect()->route('admin.layaway.index')
            ->with('success', "Layaway {$layaway->layaway_number} cancelled.");
    }

    private function generateNumber(): string
    {
        $prefix = 'LAY';
        $date   = now()->format('Ymd');
        $latest = Layaway::where('layaway_number', 'like', "{$prefix}-{$date}-%")
            ->orderByDesc('layaway_number')
            ->value('layaway_number');
        $seq = $latest ? ((int) substr($latest, -4)) + 1 : 1;
        return "{$prefix}-{$date}-" . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
