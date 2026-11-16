<script setup lang="ts">
import { onMounted } from 'vue';
import { ArrowLeft, Printer } from '@lucide/vue';
import * as SaleController from '@/actions/App/Http/Controllers/POS/SaleController';
import type { Sale, SaleItem } from '@/types/models';

interface Payment {
    id: number;
    payment_method: string;
    amount: number;
    reference_number: string | null;
}

interface ReceiptSale extends Sale {
    items: SaleItem[];
    payments: Payment[];
    customer?: { id: number; name: string } | null;
    cashier?: { id: number; name: string } | null;
}

interface ReceiptSettings {
    business_name: string;
    business_address: string;
    business_phone: string;
    business_tin: string;
    receipt_header: string;
    receipt_footer: string;
    show_vat_breakdown: boolean;
    vat_registered: boolean;
}

const props = defineProps<{
    sale: ReceiptSale;
    settings: ReceiptSettings;
}>();

function peso(centavos: number): string {
    return `₱${(centavos / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const dtf = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
});
function fmt(s: string): string { return dtf.format(new Date(s)); }

function paymentLabel(method: string): string {
    const map: Record<string, string> = {
        cash: 'Cash', card: 'Card', gcash: 'GCash', maya: 'Maya',
    };
    return map[method] ?? method;
}

// Auto-print on page load
onMounted(() => window.print());
</script>

<template>
    <!-- Print controls — hidden when printing -->
    <div class="no-print fixed top-0 left-0 right-0 z-10 flex items-center justify-between gap-3 border-b bg-white px-6 py-3 shadow-sm print:hidden">
        <a
            :href="SaleController.show.url({ sale: sale.id })"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <ArrowLeft class="h-4 w-4" />
            Back to sale
        </a>
        <button
            class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            @click="() => window.print()"
        >
            <Printer class="h-4 w-4" />
            Print Receipt
        </button>
    </div>

    <!-- Receipt content — this is what prints -->
    <div class="receipt-wrapper pt-16 print:pt-0">
        <div class="receipt mx-auto w-[58mm] min-h-screen bg-white px-3 py-6 font-mono text-[13px] leading-snug print:mx-0 print:w-full print:min-h-0 print:px-0 print:py-0">

            <!-- Store header -->
            <div class="text-center space-y-0.5 border-b border-dashed pb-3 mb-3">
                <p class="text-base font-bold uppercase tracking-wide">{{ settings.business_name }}</p>
                <p v-if="settings.business_address" class="leading-snug whitespace-pre-line" style="font-size: 10px">{{ settings.business_address }}</p>
                <p v-if="settings.business_phone"  style="font-size: 10px">Tel: {{ settings.business_phone }}</p>
                <p v-if="settings.business_tin && settings.vat_registered"  style="font-size: 10px">TIN: {{ settings.business_tin }}</p>
                <!-- <p v-if="settings.receipt_header" class="mt-1 italic"  style="font-size: 10px">{{ settings.receipt_header }}</p> -->
            </div>

            <!-- Receipt meta -->
            <div class="border-b border-dashed pb-3 mb-3 space-y-0.5" style="font-size: 10px">
                <div class="flex justify-between">
                    <span class="">Receipt # </span>
                    <span class="font-semibold">{{ sale.receipt_number }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Date </span>
                    <span class="font-semibold">{{ fmt(sale.created_at) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="">Cashier </span>
                    <span class="font-semibold">{{ sale.cashier?.name ?? '—' }}</span>
                </div>
                <div v-if="sale.customer" class="flex justify-between">
                    <span class="text-muted-foreground">Customer </span>
                    <span class="font-semibold">{{ sale.customer.name }}</span>
                </div>
            </div>

            <!-- Items -->
            <div class="border-b border-dashed pb-3 mb-3">
                <div class="flex font-semibold mb-1">
                    <span class="flex-1">Item</span>
                    <span class="w-8 text-center">Qty</span>
                    <span class="w-20 text-right">Amount</span>
                </div>
                <div
                    v-for="item in sale.items"
                    :key="item.id"
                    class="mb-1.5"
                    style="font-size: 10px"
                >
                    <div class="flex">
                        <span class="flex-1 leading-snug pr-1">{{ item.product_name }}</span>
                        <span class="w-8 text-center shrink-0">{{ item.quantity }}</span>
                        <span class="w-20 text-right shrink-0">{{ peso(item.line_total) }}</span>
                    </div>
                    <div v-if="item.quantity > 1" class="pl-1">
                        {{ peso(item.unit_price) }} × {{ item.quantity }}
                    </div>
                    <div v-if="item.discount_amount > 0" class="text-muted-foreground pl-1">
                        Discount: -{{ peso(item.discount_amount) }}
                    </div>
                </div>
            </div>

            <!-- Totals -->
            <div class="border-b border-dashed pb-3 mb-3 space-y-0.5">
                <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span style="font-size: 10px">{{ peso(sale.subtotal) }}</span>
                </div>
                <div v-if="sale.discount_amount > 0" class="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span style="font-size: 10px">-{{ peso(sale.discount_amount) }}</span>
                </div>
                <template v-if="settings.show_vat_breakdown && settings.vat_registered">
                    <div class="flex justify-between text-muted-foreground">
                        <span>VATable Sales</span>
                        <span style="font-size: 10px">{{ peso(sale.vatable_sales ?? 0) }}</span>
                    </div>
                    <div class="flex justify-between text-muted-foreground">
                        <span>VAT (12%)</span>
                        <span style="font-size: 10px">{{ peso(sale.vat_amount) }}</span>
                    </div>
                </template>
                <div class="flex justify-between font-bold text-base border-t border-dashed pt-1 mt-1">
                    <span>TOTAL</span>
                    <span style="font-size: 10px">{{ peso(sale.total_amount) }}</span>
                </div>
            </div>

            <!-- Payments -->
            <div class="border-b border-dashed pb-3 mb-3 space-y-0.5">
                <div
                    v-for="payment in sale.payments"
                    :key="payment.id"
                    class="flex justify-between"
                >
                    <span>{{ paymentLabel(payment.payment_method) }}</span>
                    <span>{{ peso(payment.amount) }}</span>
                </div>
                <div v-if="sale.change_amount > 0" class="flex justify-between">
                    <span>Change</span>
                    <span>{{ peso(sale.change_amount) }}</span>
                </div>
            </div>

            <!-- Footer -->
            <div class="text-center space-y-0.5">
                <!-- <p v-if="settings.receipt_footer" class="font-semibold">{{ settings.receipt_footer }}</p> -->
                <p v-if="settings.receipt_footer" class="font-semibold"  style="font-size: 10px">Thank you for your purchase.</p>
                <p class="font-semibold"  style="font-size: 10px">Powered by Melonz IT Solutions</p>
                <p class="font-semibold"  style="font-size: 10px">https://melonz.io</p>
                <p v-if="settings.vat_registered" class="text-[10px] text-muted-foreground">
                    VAT Reg. TIN: {{ settings.business_tin }}
                </p>
                <!-- <p class="text-[10px] text-muted-foreground">{{ sale.receipt_number }}</p> -->
            </div>
        </div>
    </div>
</template>

<style>
@page {
    size: 58mm auto;
    margin: 2mm 3mm;
}

@media print {
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

    .no-print { display: none !important; }

    html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 42mm !important;
    }

    .receipt-wrapper {
        padding-top: 0 !important;
    }

    .receipt {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 12px !important;
        line-height: 1 !important;
        min-height: 0 !important;
    }
}
</style>
