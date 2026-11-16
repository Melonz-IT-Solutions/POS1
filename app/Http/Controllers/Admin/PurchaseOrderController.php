<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PurchaseOrderStatus;
use App\Enums\StockMovementType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePurchaseOrderRequest;
use App\Http\Requests\Admin\UpdatePurchaseOrderRequest;
use App\Models\AuditLog;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\PurchaseReceipt;
use App\Models\PurchaseReceiptItem;
use App\Models\StockMovement;
use App\Models\Setting;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', PurchaseOrder::class);

        $query = PurchaseOrder::with(['supplier:id,company_name', 'orderedBy:id,name'])
            ->withCount('items');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('po_number', 'like', "%{$search}%")
                  ->orWhereHas('supplier', fn ($sq) => $sq->where('company_name', 'like', "%{$search}%"));
            });
        }

        return Inertia::render('purchases/Index', [
            'orders'   => $query->latest()->paginate(20)->withQueryString(),
            'statuses' => array_map(
                fn ($case) => ['value' => $case->value, 'label' => $case->label()],
                PurchaseOrderStatus::cases()
            ),
            'filters'  => $request->only('search', 'status'),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', PurchaseOrder::class);

        return Inertia::render('purchases/Create', [
            'suppliers' => Supplier::where('is_active', true)
                ->with('products:id,name,sku,cost_price')
                ->select('id', 'company_name')
                ->orderBy('company_name')
                ->get(),
            'products'  => Product::where('is_active', true)
                ->select('id', 'name', 'sku', 'cost_price')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StorePurchaseOrderRequest $request): RedirectResponse
    {
        $order = null;

        DB::transaction(function () use ($request, &$order) {
            $order = PurchaseOrder::create([
                'po_number'     => $this->generatePoNumber(),
                'supplier_id'   => $request->input('supplier_id'),
                'status'        => $request->boolean('mark_ordered')
                    ? PurchaseOrderStatus::Ordered
                    : PurchaseOrderStatus::Draft,
                'ordered_by'    => auth()->id(),
                'expected_date' => $request->input('expected_date') ?: null,
                'notes'         => $request->input('notes'),
                'subtotal'      => 0,
            ]);

            $subtotal = 0;
            foreach ($request->input('items') as $item) {
                $unitCost  = (int) round((float) $item['unit_cost'] * 100);
                $totalCost = $unitCost * (int) $item['quantity'];
                $subtotal += $totalCost;

                PurchaseOrderItem::create([
                    'purchase_order_id' => $order->id,
                    'product_id'        => $item['product_id'],
                    'quantity_ordered'  => (int) $item['quantity'],
                    'quantity_received' => 0,
                    'unit_cost'         => $unitCost,
                    'total_cost'        => $totalCost,
                ]);
            }

            $order->update(['subtotal' => $subtotal]);

            AuditLog::record('purchase_order.create', $order, [], $order->toArray());
        });

        return redirect()->route('admin.purchases.show', $order)
            ->with('success', "Purchase order {$order->po_number} created.");
    }

    public function print(PurchaseOrder $purchase): Response
    {
        $this->authorize('view', $purchase);

        $purchase->load([
            'supplier:id,company_name,contact_person,phone,email,address',
            'orderedBy:id,name',
            'items.product:id,name,sku',
        ]);

        return Inertia::render('purchases/Print', [
            'order'           => $purchase,
            'business_name'   => Setting::get('business_name',    'My Store'),
            'business_address'=> Setting::get('business_address', ''),
            'business_phone'  => Setting::get('business_phone',   ''),
            'business_tin'    => Setting::get('business_tin',     ''),
            'business_email'  => Setting::get('business_email',   ''),
        ]);
    }

    public function show(PurchaseOrder $purchase): Response
    {
        $this->authorize('view', $purchase);

        $purchase->load([
            'supplier:id,company_name,contact_person,phone,email',
            'orderedBy:id,name',
            'items.product:id,name,sku',
            'receipts.receivedBy:id,name',
            'receipts.items.product:id,name,sku',
        ]);

        return Inertia::render('purchases/Show', [
            'order' => $purchase,
        ]);
    }

    public function edit(PurchaseOrder $purchase): Response
    {
        $this->authorize('update', $purchase);

        abort_if($purchase->status !== PurchaseOrderStatus::Draft, 403, 'Only draft purchase orders can be edited.');

        $purchase->load('items.product:id,name,sku,cost_price');

        return Inertia::render('purchases/Edit', [
            'order'     => $purchase,
            'suppliers' => Supplier::where('is_active', true)
                ->select('id', 'company_name')
                ->orderBy('company_name')
                ->get(),
            'products'  => Product::where('is_active', true)
                ->select('id', 'name', 'sku', 'cost_price')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(UpdatePurchaseOrderRequest $request, PurchaseOrder $purchase): RedirectResponse
    {
        abort_if($purchase->status !== PurchaseOrderStatus::Draft, 403, 'Only draft purchase orders can be edited.');

        DB::transaction(function () use ($request, $purchase) {
            $purchase->update([
                'supplier_id'   => $request->input('supplier_id'),
                'expected_date' => $request->input('expected_date') ?: null,
                'notes'         => $request->input('notes'),
            ]);

            $purchase->items()->delete();

            $subtotal = 0;
            foreach ($request->input('items') as $item) {
                $unitCost  = (int) round((float) $item['unit_cost'] * 100);
                $totalCost = $unitCost * (int) $item['quantity'];
                $subtotal += $totalCost;

                PurchaseOrderItem::create([
                    'purchase_order_id' => $purchase->id,
                    'product_id'        => $item['product_id'],
                    'quantity_ordered'  => (int) $item['quantity'],
                    'quantity_received' => 0,
                    'unit_cost'         => $unitCost,
                    'total_cost'        => $totalCost,
                ]);
            }

            $purchase->update(['subtotal' => $subtotal]);

            if ($request->boolean('mark_ordered')) {
                $purchase->update(['status' => PurchaseOrderStatus::Ordered]);
            }

            AuditLog::record('purchase_order.update', $purchase, [], $purchase->toArray());
        });

        return redirect()->route('admin.purchases.show', $purchase)
            ->with('success', "Purchase order {$purchase->po_number} updated.");
    }

    public function destroy(PurchaseOrder $purchase): RedirectResponse
    {
        $this->authorize('delete', $purchase);

        $poNumber = $purchase->po_number;
        AuditLog::record('purchase_order.delete', $purchase, $purchase->toArray(), []);
        $purchase->delete();

        return redirect()->route('admin.purchases.index')
            ->with('success', "Purchase order {$poNumber} deleted.");
    }

    public function markOrdered(PurchaseOrder $purchase): RedirectResponse
    {
        $this->authorize('update', $purchase);
        abort_if($purchase->status !== PurchaseOrderStatus::Draft, 422, 'PO is not in draft status.');

        $purchase->update(['status' => PurchaseOrderStatus::Ordered]);
        AuditLog::record('purchase_order.ordered', $purchase, [], []);

        return back()->with('success', "Purchase order {$purchase->po_number} marked as ordered.");
    }

    public function cancel(PurchaseOrder $purchase): RedirectResponse
    {
        $this->authorize('update', $purchase);
        abort_if(
            in_array($purchase->status, [PurchaseOrderStatus::Received, PurchaseOrderStatus::Cancelled]),
            422,
            'Cannot cancel a completed or already cancelled PO.'
        );

        $purchase->update(['status' => PurchaseOrderStatus::Cancelled]);
        AuditLog::record('purchase_order.cancelled', $purchase, [], []);

        return back()->with('success', "Purchase order {$purchase->po_number} cancelled.");
    }

    public function receive(PurchaseOrder $purchase): Response
    {
        $this->authorize('receive', $purchase);
        abort_if(
            ! in_array($purchase->status, [PurchaseOrderStatus::Ordered, PurchaseOrderStatus::PartiallyReceived]),
            403,
            'PO cannot be received in its current status.'
        );

        $purchase->load('items.product:id,name,sku');

        return Inertia::render('purchases/Receive', [
            'order' => $purchase,
        ]);
    }

    public function storeReceipt(Request $request, PurchaseOrder $purchase): RedirectResponse
    {
        $this->authorize('receive', $purchase);
        abort_if(
            ! in_array($purchase->status, [PurchaseOrderStatus::Ordered, PurchaseOrderStatus::PartiallyReceived]),
            403,
            'PO cannot be received in its current status.'
        );

        $request->validate([
            'notes'                               => ['nullable', 'string', 'max:1000'],
            'items'                               => ['required', 'array'],
            'items.*.purchase_order_item_id'      => ['required', 'integer', 'exists:purchase_order_items,id'],
            'items.*.quantity_received'           => ['required', 'integer', 'min:0'],
        ]);

        $receivedItems = collect($request->input('items'))
            ->filter(fn ($i) => (int) $i['quantity_received'] > 0);

        if ($receivedItems->isEmpty()) {
            return back()->withErrors(['items' => 'Please enter at least one received quantity.']);
        }

        DB::transaction(function () use ($request, $purchase, $receivedItems) {
            $receipt = PurchaseReceipt::create([
                'purchase_order_id' => $purchase->id,
                'received_by'       => auth()->id(),
                'received_at'       => now(),
                'notes'             => $request->input('notes'),
            ]);

            foreach ($receivedItems as $itemData) {
                $poItem = PurchaseOrderItem::findOrFail($itemData['purchase_order_item_id']);
                $qtyIn  = min((int) $itemData['quantity_received'], $poItem->remainingQuantity());

                if ($qtyIn <= 0) {
                    continue;
                }

                PurchaseReceiptItem::create([
                    'purchase_receipt_id'    => $receipt->id,
                    'purchase_order_item_id' => $poItem->id,
                    'product_id'             => $poItem->product_id,
                    'quantity_received'      => $qtyIn,
                    'unit_cost'              => $poItem->unit_cost,
                ]);

                $poItem->increment('quantity_received', $qtyIn);

                $product = Product::lockForUpdate()->find($poItem->product_id);
                $before  = $product->stock_quantity;
                $product->increment('stock_quantity', $qtyIn);
                $product->update(['cost_price' => $poItem->unit_cost]);

                StockMovement::create([
                    'product_id'      => $product->id,
                    'type'            => StockMovementType::PurchaseReceipt,
                    'quantity'        => $qtyIn,
                    'quantity_before' => $before,
                    'quantity_after'  => $before + $qtyIn,
                    'unit_cost'       => $poItem->unit_cost,
                    'reference_type'  => PurchaseReceipt::class,
                    'reference_id'    => $receipt->id,
                    'reason'          => "Received via {$purchase->po_number}",
                    'user_id'         => auth()->id(),
                ]);
            }

            // Recalculate PO status
            $purchase->refresh()->load('items');
            $allReceived = $purchase->items->every(fn ($i) => $i->quantity_received >= $i->quantity_ordered);
            $anyReceived = $purchase->items->some(fn ($i) => $i->quantity_received > 0);

            $purchase->update([
                'status' => $allReceived
                    ? PurchaseOrderStatus::Received
                    : ($anyReceived ? PurchaseOrderStatus::PartiallyReceived : $purchase->status),
            ]);

            AuditLog::record('purchase_order.received', $purchase, [], ['receipt_id' => $receipt->id]);
        });

        return redirect()->route('admin.purchases.show', $purchase)
            ->with('success', 'Goods received and stock updated.');
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private function generatePoNumber(): string
    {
        $prefix = 'PO';
        $date   = now()->format('Ymd');

        $latest = PurchaseOrder::withTrashed()
            ->where('po_number', 'like', "{$prefix}-{$date}-%")
            ->orderByDesc('po_number')
            ->value('po_number');

        $seq = $latest ? ((int) substr($latest, -4)) + 1 : 1;

        return "{$prefix}-{$date}-" . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
