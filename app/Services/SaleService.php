<?php

namespace App\Services;

use App\DataTransferObjects\CartItemData;
use App\DataTransferObjects\CreateSaleData;
use App\Enums\SaleStatus;
use App\Enums\StockMovementType;
use App\Enums\VatType;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleService
{
    public function __construct(
        private readonly TaxService $taxService,
        private readonly DiscountService $discountService,
        private readonly InventoryService $inventoryService,
    ) {}

    public function createFromCart(CreateSaleData $data, User $cashier): Sale
    {
        return DB::transaction(function () use ($data, $cashier) {
            $customer = $data->customer_id
                ? Customer::find($data->customer_id)
                : null;

            $shift = $cashier->currentShift();

            $receiptNumber = $this->generateReceiptNumber();

            // ─── Build line-level data ───────────────────────────────────
            $lineData = $this->buildLineData($data, $cashier);

            $subtotal       = $lineData['subtotal'];
            $vatableSales   = $lineData['vatable_sales'];
            $vatExemptSales = $lineData['vat_exempt_sales'];
            $zeroRatedSales = $lineData['zero_rated_sales'];
            $vatAmount      = $lineData['vat_amount'];

            // ─── Transaction-level discount ──────────────────────────────
            $discountAmount = 0;
            if ($data->discount_type && $data->discount_value > 0) {
                $discountAmount = $this->discountService->calculateTransactionDiscount(
                    $data->discount_type,
                    $data->discount_value,
                    $subtotal,
                );
            }

            // Also check customer-level discount
            if ($customer && $customer->discount_rate > 0 && $discountAmount === 0) {
                $discountAmount = (int) round($subtotal * $customer->discount_rate / 10000);
                $data = new CreateSaleData(
                    items: $data->items,
                    payments: $data->payments,
                    customer_id: $data->customer_id,
                    discount_type: 'percentage',
                    discount_value: $customer->discount_rate,
                    notes: $data->notes,
                    sc_name: $data->sc_name,
                    sc_id_no: $data->sc_id_no,
                    pwd_name: $data->pwd_name,
                    pwd_id_no: $data->pwd_id_no,
                );
            }

            $totalAmount    = $subtotal - $discountAmount;

            // ─── Validate payment ────────────────────────────────────────
            $totalPaid = array_sum(array_map(fn ($p) => $p->amount, $data->payments));
            if ($totalPaid < $totalAmount) {
                throw ValidationException::withMessages([
                    'payment' => 'Insufficient payment. Amount tendered is less than total due.',
                ]);
            }

            $changeAmount = max(0, $totalPaid - $totalAmount);

            // ─── Create sale record ──────────────────────────────────────
            $sale = Sale::create([
                'receipt_number'   => $receiptNumber,
                'customer_id'      => $data->customer_id,
                'cashier_id'       => $cashier->id,
                'shift_id'         => $shift?->id,
                'status'           => SaleStatus::Completed,
                'subtotal'         => $subtotal,
                'discount_type'    => $data->discount_type,
                'discount_value'   => $data->discount_value,
                'discount_amount'  => $discountAmount,
                'vatable_sales'    => $vatableSales,
                'vat_exempt_sales' => $vatExemptSales,
                'zero_rated_sales' => $zeroRatedSales,
                'vat_amount'       => $vatAmount,
                'total_amount'     => $totalAmount,
                'amount_tendered'  => $totalPaid,
                'change_amount'    => $changeAmount,
                'notes'            => $data->notes,
                'sc_name'          => $data->sc_name,
                'sc_id_no'         => $data->sc_id_no,
                'pwd_name'         => $data->pwd_name,
                'pwd_id_no'        => $data->pwd_id_no,
            ]);

            // ─── Create sale items + deduct stock ────────────────────────
            foreach ($data->items as $item) {
                $discountAmount_item = $item->discountAmount();
                $lineTotal           = $item->lineTotal();
                $vatCalc             = $this->taxService->calculate($lineTotal, $item->vat_type);

                $sale->items()->create([
                    'product_id'      => $item->product_id,
                    'product_name'    => $item->product_name,
                    'product_sku'     => $item->product_sku,
                    'product_barcode' => $item->product_barcode,
                    'vat_type'        => $item->vat_type,
                    'unit_price'      => $item->unit_price,
                    'cost_price'      => $item->cost_price,
                    'quantity'        => $item->quantity,
                    'discount_type'   => $item->discount_type,
                    'discount_value'  => $item->discount_value,
                    'discount_amount' => $discountAmount_item,
                    'line_total'      => $lineTotal,
                    'vat_amount'      => $vatCalc['vat_amount'],
                ]);

                // Deduct from inventory
                $product = Product::lockForUpdate()->find($item->product_id);
                if ($product) {
                    $this->inventoryService->deduct(
                        product: $product,
                        quantity: $item->quantity,
                        type: StockMovementType::Sale,
                        user: $cashier,
                        referenceType: Sale::class,
                        referenceId: $sale->id,
                    );
                }
            }

            // ─── Record payments ─────────────────────────────────────────
            foreach ($data->payments as $payment) {
                $sale->payments()->create([
                    'payment_method'   => $payment->payment_method,
                    'amount'           => $payment->amount,
                    'reference_number' => $payment->reference_number,
                ]);
            }

            // ─── Loyalty points ───────────────────────────────────────────
            if ($customer) {
                $this->awardLoyaltyPoints($customer, $sale);
            }

            // ─── Audit ────────────────────────────────────────────────────
            AuditLog::record('sale.created', $sale, [], [
                'receipt_number' => $receiptNumber,
                'total_amount'   => $totalAmount,
            ]);

            return $sale->load(['items', 'payments', 'customer', 'cashier']);
        });
    }

    public function hold(CreateSaleData $data, User $cashier): Sale
    {
        return DB::transaction(function () use ($data, $cashier) {
            $receiptNumber = $this->generateReceiptNumber('HOLD');
            $lineData      = $this->buildLineData($data, $cashier);

            $sale = Sale::create([
                'receipt_number' => $receiptNumber,
                'customer_id'    => $data->customer_id,
                'cashier_id'     => $cashier->id,
                'shift_id'       => $cashier->currentShift()?->id,
                'status'         => SaleStatus::Held,
                'subtotal'       => $lineData['subtotal'],
                'discount_type'  => $data->discount_type,
                'discount_value' => $data->discount_value,
                'total_amount'   => $lineData['subtotal'],
                'parked_at'      => now(),
                'notes'          => $data->notes,
            ]);

            foreach ($data->items as $item) {
                $sale->items()->create([
                    'product_id'      => $item->product_id,
                    'product_name'    => $item->product_name,
                    'product_sku'     => $item->product_sku,
                    'product_barcode' => $item->product_barcode,
                    'vat_type'        => $item->vat_type,
                    'unit_price'      => $item->unit_price,
                    'cost_price'      => $item->cost_price,
                    'quantity'        => $item->quantity,
                    'line_total'      => $item->lineTotal(),
                ]);
            }

            AuditLog::record('sale.held', $sale);

            return $sale->load(['items', 'customer']);
        });
    }

    public function void(Sale $sale, User $voidedBy, string $reason): Sale
    {
        return DB::transaction(function () use ($sale, $voidedBy, $reason) {
            if ($sale->status !== SaleStatus::Completed) {
                throw ValidationException::withMessages([
                    'sale' => 'Only completed sales can be voided.',
                ]);
            }

            $sale->update([
                'status'      => SaleStatus::Void,
                'voided_by'   => $voidedBy->id,
                'voided_at'   => now(),
                'void_reason' => $reason,
            ]);

            // Restore stock
            foreach ($sale->items as $item) {
                if ($item->product_id) {
                    $product = Product::lockForUpdate()->find($item->product_id);
                    if ($product) {
                        $this->inventoryService->restore(
                            product: $product,
                            quantity: $item->quantity,
                            type: StockMovementType::Void,
                            user: $voidedBy,
                            referenceType: Sale::class,
                            referenceId: $sale->id,
                        );
                    }
                }
            }

            AuditLog::record('sale.voided', $sale, ['status' => 'completed'], [
                'status'      => 'void',
                'voided_by'   => $voidedBy->id,
                'void_reason' => $reason,
            ]);

            return $sale->fresh();
        });
    }

    public function refund(Sale $sale, array $itemRefunds, User $cashier, string $reason): Sale
    {
        return DB::transaction(function () use ($sale, $itemRefunds, $cashier, $reason) {
            if (! in_array($sale->status->value, ['completed', 'partially_refunded'])) {
                throw ValidationException::withMessages([
                    'sale' => 'This sale cannot be refunded.',
                ]);
            }

            $refundItems    = [];
            $refundSubtotal = 0;
            $refundVat      = 0;

            foreach ($itemRefunds as $refundItem) {
                $saleItem = $sale->items->find($refundItem['sale_item_id']);
                if (! $saleItem) {
                    continue;
                }

                $qty         = min($refundItem['quantity'], $saleItem->quantity);
                $unitPrice   = (int) round($saleItem->line_total / $saleItem->quantity);
                $lineRefund  = $unitPrice * $qty;
                $vatCalc     = $this->taxService->calculate($lineRefund, $saleItem->vat_type);

                $refundItems[]   = ['item' => $saleItem, 'qty' => $qty, 'amount' => $lineRefund, 'vat' => $vatCalc['vat_amount']];
                $refundSubtotal += $lineRefund;
                $refundVat      += $vatCalc['vat_amount'];
            }

            // Create refund sale record (linked to original)
            $refundSale = Sale::create([
                'receipt_number'  => $this->generateReceiptNumber('RF'),
                'customer_id'     => $sale->customer_id,
                'cashier_id'      => $cashier->id,
                'shift_id'        => $cashier->currentShift()?->id,
                'status'          => SaleStatus::Refunded,
                'subtotal'        => $refundSubtotal,
                'vatable_sales'   => $refundSubtotal - $refundVat,
                'vat_amount'      => $refundVat,
                'total_amount'    => $refundSubtotal,
                'notes'           => $reason,
                'original_sale_id'=> $sale->id,
            ]);

            foreach ($refundItems as $ri) {
                $refundSale->items()->create([
                    'product_id'      => $ri['item']->product_id,
                    'product_name'    => $ri['item']->product_name,
                    'product_sku'     => $ri['item']->product_sku,
                    'product_barcode' => $ri['item']->product_barcode,
                    'vat_type'        => $ri['item']->vat_type,
                    'unit_price'      => $ri['item']->unit_price,
                    'cost_price'      => $ri['item']->cost_price,
                    'quantity'        => $ri['qty'],
                    'line_total'      => $ri['amount'],
                    'vat_amount'      => $ri['vat'],
                ]);

                // Restore stock
                if ($ri['item']->product_id) {
                    $product = Product::lockForUpdate()->find($ri['item']->product_id);
                    if ($product) {
                        $this->inventoryService->restore(
                            product: $product,
                            quantity: $ri['qty'],
                            type: StockMovementType::Refund,
                            user: $cashier,
                            referenceType: Sale::class,
                            referenceId: $refundSale->id,
                        );
                    }
                }
            }

            // Update original sale status
            $allRefunded = $sale->items->every(function ($item) use ($sale) {
                $totalRefunded = $sale->refunds()
                    ->join('sale_items', 'sales.id', '=', 'sale_items.sale_id')
                    ->where('sale_items.product_id', $item->product_id)
                    ->sum('sale_items.quantity');

                return $totalRefunded >= $item->quantity;
            });

            $sale->update([
                'status' => $allRefunded ? SaleStatus::Refunded : SaleStatus::PartiallyRefunded,
            ]);

            AuditLog::record('sale.refunded', $sale, [], [
                'refund_sale_id' => $refundSale->id,
                'amount'         => $refundSubtotal,
            ]);

            return $refundSale->load(['items', 'payments']);
        });
    }

    private function buildLineData(CreateSaleData $data, User $cashier): array
    {
        $subtotal       = 0;
        $vatableSales   = 0;
        $vatExemptSales = 0;
        $zeroRatedSales = 0;
        $vatAmount      = 0;

        foreach ($data->items as $item) {
            $lineTotal = $item->lineTotal();
            $subtotal += $lineTotal;

            $vatCalc = $this->taxService->calculate($lineTotal, $item->vat_type);

            match ($item->vat_type) {
                VatType::Vatable   => $vatableSales += $vatCalc['vat_base'],
                VatType::VatExempt => $vatExemptSales += $lineTotal,
                VatType::ZeroRated => $zeroRatedSales += $lineTotal,
            };

            $vatAmount += $vatCalc['vat_amount'];
        }

        return compact('subtotal', 'vatableSales', 'vatExemptSales', 'zeroRatedSales', 'vatAmount');
    }

    private function generateReceiptNumber(string $prefix = ''): string
    {
        $configPrefix = Setting::get('receipt_prefix', 'OR');
        $finalPrefix  = $prefix ? "{$configPrefix}-{$prefix}" : $configPrefix;
        $date         = now()->format('Ymd');
        $key          = "receipt_counter_{$date}";

        return DB::transaction(function () use ($finalPrefix, $date, $key) {
            $setting = Setting::lockForUpdate()->firstOrCreate(
                ['key' => $key],
                ['value' => '0', 'group' => 'system', 'label' => null]
            );
            $next = (int) $setting->value + 1;
            $setting->update(['value' => (string) $next]);

            return sprintf('%s-%s-%05d', $finalPrefix, $date, $next);
        });
    }

    private function awardLoyaltyPoints(Customer $customer, Sale $sale): void
    {
        $loyaltyEnabled = (bool) Setting::get('loyalty_enabled', false);
        if (! $loyaltyEnabled) {
            return;
        }

        $earnRate  = (int) Setting::get('loyalty_earn_rate', 100); // centavos per point
        $points    = (int) floor($sale->total_amount / $earnRate);

        if ($points <= 0) {
            return;
        }

        $newBalance = $customer->loyalty_points + $points;
        $customer->update(['loyalty_points' => $newBalance]);

        $customer->loyaltyTransactions()->create([
            'sale_id'         => $sale->id,
            'type'            => 'earned',
            'points'          => $points,
            'running_balance' => $newBalance,
            'description'     => "Earned from OR# {$sale->receipt_number}",
        ]);
    }
}
