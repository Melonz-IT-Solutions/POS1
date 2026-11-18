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
use App\Mail\SaleReceipt;
use App\Models\Sale;
use App\Models\Setting;
use App\Models\User;
use App\Repositories\Contracts\SaleRepositoryInterface;
use App\Services\SaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function __construct(
        private readonly SaleService $saleService,
        private readonly SaleRepositoryInterface $saleRepository,
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'cashier_id', 'date_from', 'date_to', 'payment_method']);
        $sales   = $this->saleRepository->paginate($filters, 20);

        $cashiers = User::whereHas('sales')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('pos/Sales', [
            'sales'    => $sales,
            'filters'  => $filters,
            'cashiers' => $cashiers,
            'canVoid'  => $request->user()->can('void', Sale::class),
        ]);
    }

    public function export(Request $request): HttpResponse
    {
        $this->authorize('viewAny', Sale::class);

        $filters = $request->only(['search', 'status', 'cashier_id', 'date_from', 'date_to', 'payment_method']);
        $sales   = $this->saleRepository->export($filters);

        $filename = 'sales-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($sales) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Receipt Number', 'Date', 'Time', 'Cashier', 'Customer',
                'Subtotal', 'VAT', 'Discount', 'Total', 'Status', 'Payment Method(s)',
            ]);

            foreach ($sales as $sale) {
                $methods = $sale->payments->pluck('payment_method')->unique()->implode(', ');
                fputcsv($handle, [
                    $sale->receipt_number,
                    $sale->created_at->toDateString(),
                    $sale->created_at->format('H:i:s'),
                    $sale->cashier?->name ?? '',
                    $sale->customer?->name ?? 'Walk-in',
                    number_format($sale->subtotal / 100, 2),
                    number_format($sale->vat_amount / 100, 2),
                    number_format($sale->discount_amount / 100, 2),
                    number_format($sale->total_amount / 100, 2),
                    $sale->status,
                    $methods,
                ]);
            }

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    public function receipt(Sale $sale): Response
    {
        $sale->load(['items', 'payments', 'customer', 'cashier']);

        return Inertia::render('pos/Receipt', [
            'sale'     => $sale,
            'settings' => [
                'business_name'     => Setting::get('business_name', 'My Store'),
                'business_address'  => Setting::get('business_address', ''),
                'business_phone'    => Setting::get('business_phone', ''),
                'business_tin'      => Setting::get('business_tin', ''),
                'receipt_header'    => Setting::get('receipt_header', 'Thank you for shopping!'),
                'receipt_footer'    => Setting::get('receipt_footer', 'Please come again.'),
                'show_vat_breakdown' => Setting::get('show_vat_breakdown', 'true') === 'true',
                'vat_registered'    => Setting::get('vat_registered', 'true') === 'true',
            ],
        ]);
    }

    public function show(Sale $sale): Response
    {
        $sale->load(['items', 'payments', 'customer', 'cashier', 'voidedBy', 'refunds.items', 'refunds.cashier']);

        return Inertia::render('pos/SaleShow', [
            'sale'      => $sale,
            'canVoid'   => auth()->user()->can('void', $sale),
            'canRefund' => auth()->user()->can('refund', $sale),
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
            redeem_points:  (int) ($validated['redeem_points'] ?? 0),
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

    public function emailReceipt(Request $request, Sale $sale): JsonResponse
    {
        $this->authorize('view', $sale);

        $data = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $sale->load(['items', 'payments', 'customer', 'cashier']);
        Mail::to($data['email'])->queue(new SaleReceipt($sale));

        return response()->json(['message' => 'Receipt sent to ' . $data['email']]);
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
