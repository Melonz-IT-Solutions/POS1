<?php

namespace App\Http\Controllers\POS;

use App\DataTransferObjects\CartItemData;
use App\DataTransferObjects\CreateSaleData;
use App\DataTransferObjects\PaymentData;
use App\Enums\VatType;
use App\Http\Controllers\Controller;
use App\Http\Requests\POS\StoreSaleRequest;
use App\Http\Requests\POS\VoidSaleRequest;
use App\Http\Requests\POS\RefundSaleRequest;
use App\Models\Sale;
use App\Repositories\Contracts\SaleRepositoryInterface;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function __construct(
        private readonly SaleService $saleService,
        private readonly SaleRepositoryInterface $saleRepository,
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'cashier_id', 'date_from', 'date_to', 'payment_method']);
        $sales   = $this->saleRepository->paginate($filters, 20);

        return Inertia::render('pos/Sales', [
            'sales'   => $sales,
            'filters' => $filters,
        ]);
    }

    public function show(Sale $sale): Response
    {
        $sale->load(['items.product', 'payments', 'customer', 'cashier', 'refunds']);

        return Inertia::render('pos/SaleShow', [
            'sale' => $sale,
        ]);
    }

    public function store(StoreSaleRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $items = array_map(fn ($item) => new CartItemData(
            product_id:      $item['product_id'],
            product_name:    $item['product_name'],
            product_sku:     $item['product_sku'],
            product_barcode: $item['product_barcode'] ?? null,
            unit_price:      $item['unit_price'],
            cost_price:      $item['cost_price'],
            vat_type:        VatType::from($item['vat_type']),
            quantity:        $item['quantity'],
            discount_type:   $item['discount_type'] ?? null,
            discount_value:  $item['discount_value'] ?? 0,
        ), $validated['items']);

        $payments = array_map(fn ($p) => new PaymentData(
            payment_method:   $p['payment_method'],
            amount:           $p['amount'],
            reference_number: $p['reference_number'] ?? null,
        ), $validated['payments']);

        $data = new CreateSaleData(
            items:          $items,
            payments:       $payments,
            customer_id:    $validated['customer_id'] ?? null,
            discount_type:  $validated['discount_type'] ?? null,
            discount_value: $validated['discount_value'] ?? 0,
            notes:          $validated['notes'] ?? null,
            sc_name:        $validated['sc_name'] ?? null,
            sc_id_no:       $validated['sc_id_no'] ?? null,
            pwd_name:       $validated['pwd_name'] ?? null,
            pwd_id_no:      $validated['pwd_id_no'] ?? null,
        );

        $sale = $this->saleService->createFromCart($data, $request->user());

        return response()->json([
            'message' => 'Sale completed successfully.',
            'sale'    => $sale->load(['items', 'payments', 'customer']),
        ], 201);
    }

    public function hold(StoreSaleRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $items = array_map(fn ($item) => new CartItemData(
            product_id:      $item['product_id'],
            product_name:    $item['product_name'],
            product_sku:     $item['product_sku'],
            product_barcode: $item['product_barcode'] ?? null,
            unit_price:      $item['unit_price'],
            cost_price:      $item['cost_price'],
            vat_type:        VatType::from($item['vat_type']),
            quantity:        $item['quantity'],
        ), $validated['items']);

        $data = new CreateSaleData(
            items:       $items,
            payments:    [],
            customer_id: $validated['customer_id'] ?? null,
        );

        $sale = $this->saleService->hold($data, $request->user());

        return response()->json([
            'message' => 'Transaction held.',
            'sale'    => $sale,
        ], 201);
    }

    public function resume(Sale $sale, Request $request): JsonResponse
    {
        if ($sale->status->value !== 'held') {
            return response()->json(['message' => 'This transaction is not on hold.'], 422);
        }

        if ($sale->cashier_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json([
            'sale' => $sale->load(['items.product', 'customer']),
        ]);
    }

    public function cancelHeld(Sale $sale, Request $request): JsonResponse
    {
        if ($sale->status->value !== 'held' || $sale->cashier_id !== $request->user()->id) {
            return response()->json(['message' => 'Cannot cancel this transaction.'], 422);
        }

        $sale->delete();

        return response()->json(['message' => 'Held transaction cancelled.']);
    }

    public function void(VoidSaleRequest $request, Sale $sale): JsonResponse
    {
        $this->authorize('void', $sale);

        $sale = $this->saleService->void(
            sale:     $sale,
            voidedBy: $request->user(),
            reason:   $request->validated('reason'),
        );

        return response()->json([
            'message' => 'Sale voided successfully.',
            'sale'    => $sale,
        ]);
    }

    public function refund(RefundSaleRequest $request, Sale $sale): JsonResponse
    {
        $this->authorize('refund', $sale);

        $refundSale = $this->saleService->refund(
            sale:        $sale,
            itemRefunds: $request->validated('items'),
            cashier:     $request->user(),
            reason:      $request->validated('reason'),
        );

        return response()->json([
            'message'      => 'Refund processed successfully.',
            'refund_sale'  => $refundSale,
        ], 201);
    }

    public function heldList(Request $request): JsonResponse
    {
        $held = Sale::with(['items', 'customer'])
            ->where('cashier_id', $request->user()->id)
            ->where('status', 'held')
            ->orderByDesc('parked_at')
            ->get();

        return response()->json(['held_sales' => $held]);
    }
}
