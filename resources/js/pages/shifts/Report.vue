<script setup lang="ts">
import { onMounted } from 'vue';
import { ArrowLeft, Printer } from '@lucide/vue';
import * as ShiftController from '@/actions/App/Http/Controllers/Admin/ShiftController';
import type { Shift } from '@/types/models';

// ── Types ─────────────────────────────────────────────────────────────────
type ShiftDetail = Shift & {
    sales_count:      number;
    completed_count:  number;
    void_count:       number;
    total_sales:      number | null;
    total_vat:        number | null;
    total_discounts:  number | null;
    cashier?: { id: number; name: string } | null;
    cash_movements?: {
        id: number;
        type: 'cash_in' | 'cash_out';
        amount: number;
        reason: string | null;
        created_at: string;
        user?: { id: number; name: string };
    }[];
};

type PaymentBreakdown = {
    payment_method: string;
    total: number;
    cnt: number;
};

type TopProduct = {
    product_name: string;
    product_sku:  string;
    qty:          number;
    revenue:      number;
};

type ReportSettings = {
    business_name:    string;
    business_address: string;
    business_phone:   string;
    business_tin:     string;
    vat_registered:   boolean;
};

const props = defineProps<{
    shift:            ShiftDetail;
    paymentBreakdown: PaymentBreakdown[];
    cashSales:        number;
    topProducts:      TopProduct[];
    settings:         ReportSettings;
}>();

// ── Helpers ───────────────────────────────────────────────────────────────
function peso(c: number | null): string {
    if (!c) return '₱0.00';
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function fmt(s: string | null | undefined): string {
    return s ? dtf.format(new Date(s)) : '—';
}

function duration(): string {
    if (!props.shift.opened_at) return '—';
    const end   = props.shift.closed_at ? new Date(props.shift.closed_at) : new Date();
    const start = new Date(props.shift.opened_at);
    const mins  = Math.round((end.getTime() - start.getTime()) / 60000);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function paymentLabel(method: string): string {
    const map: Record<string, string> = {
        cash: 'Cash', card: 'Card', gcash: 'GCash', maya: 'Maya',
    };
    return map[method] ?? method;
}

const totalCashIn = props.shift.cash_movements
    ?.filter(m => m.type === 'cash_in')
    .reduce((s, m) => s + m.amount, 0) ?? 0;

const totalCashOut = props.shift.cash_movements
    ?.filter(m => m.type === 'cash_out')
    .reduce((s, m) => s + m.amount, 0) ?? 0;

const expectedCash = (props.shift.opening_float ?? 0) + props.cashSales + totalCashIn - totalCashOut;
const variance     = (props.shift.closing_cash ?? 0) - expectedCash;

// ── Auto-print ────────────────────────────────────────────────────────────
onMounted(() => window.print());
</script>

<template>
    <!-- Print controls — hidden when printing -->
    <div class="no-print fixed top-0 left-0 right-0 z-10 flex items-center justify-between gap-3 border-b bg-white px-6 py-3 shadow-sm print:hidden">
        <a
            :href="ShiftController.show.url({ shift: shift.id })"
            class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <ArrowLeft class="h-4 w-4" />
            Back to shift
        </a>
        <button
            class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            @click="() => window.print()"
        >
            <Printer class="h-4 w-4" />
            Print Z-Report
        </button>
    </div>

    <!-- Report content -->
    <div class="report-wrapper pt-16 print:pt-0">
        <div class="report mx-auto w-[320px] min-h-screen bg-white px-4 py-6 font-mono text-xs print:mx-0 print:w-full print:min-h-0 print:px-2">

            <!-- Store header -->
            <div class="text-center space-y-0.5 border-b border-dashed pb-3 mb-3">
                <p class="text-sm font-bold uppercase tracking-wide">{{ settings.business_name }}</p>
                <p v-if="settings.business_address" class="text-[10px] leading-snug whitespace-pre-line">{{ settings.business_address }}</p>
                <p v-if="settings.business_phone">Tel: {{ settings.business_phone }}</p>
                <p v-if="settings.business_tin && settings.vat_registered">TIN: {{ settings.business_tin }}</p>
                <p class="mt-1 font-bold uppercase tracking-widest text-[11px]">*** Z - REPORT ***</p>
            </div>

            <!-- Shift info -->
            <div class="border-b border-dashed pb-3 mb-3 space-y-0.5">
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Shift #</span>
                    <span class="font-semibold">{{ shift.id }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Cashier</span>
                    <span>{{ shift.cashier?.name ?? '—' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Opened</span>
                    <span>{{ fmt(shift.opened_at) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Closed</span>
                    <span>{{ fmt(shift.closed_at) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Duration</span>
                    <span>{{ duration() }}</span>
                </div>
            </div>

            <!-- Sales summary -->
            <div class="border-b border-dashed pb-3 mb-3 space-y-0.5">
                <p class="font-bold mb-1">SALES SUMMARY</p>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Transactions</span>
                    <span class="font-semibold">{{ shift.completed_count }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Voided</span>
                    <span>{{ shift.void_count }}</span>
                </div>
                <div v-if="(shift.total_discounts ?? 0) > 0" class="flex justify-between">
                    <span class="text-muted-foreground">Discounts</span>
                    <span>-{{ peso(shift.total_discounts) }}</span>
                </div>
                <div v-if="settings.vat_registered && (shift.total_vat ?? 0) > 0" class="flex justify-between">
                    <span class="text-muted-foreground">VAT (12%)</span>
                    <span>{{ peso(shift.total_vat) }}</span>
                </div>
                <div class="flex justify-between font-bold border-t border-dashed pt-1 mt-1">
                    <span>GROSS SALES</span>
                    <span>{{ peso(shift.total_sales) }}</span>
                </div>
            </div>

            <!-- Payment breakdown -->
            <div class="border-b border-dashed pb-3 mb-3">
                <p class="font-bold mb-1">PAYMENT BREAKDOWN</p>
                <div
                    v-for="row in paymentBreakdown"
                    :key="row.payment_method"
                    class="flex justify-between space-y-0.5"
                >
                    <span class="text-muted-foreground">{{ paymentLabel(row.payment_method) }} (×{{ row.cnt }})</span>
                    <span>{{ peso(row.total) }}</span>
                </div>
                <div v-if="paymentBreakdown.length === 0" class="text-muted-foreground">No payments recorded.</div>
            </div>

            <!-- Cash reconciliation -->
            <div class="border-b border-dashed pb-3 mb-3 space-y-0.5">
                <p class="font-bold mb-1">CASH RECONCILIATION</p>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">Opening float</span>
                    <span>{{ peso(shift.opening_float) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-muted-foreground">+ Cash sales</span>
                    <span>{{ peso(cashSales) }}</span>
                </div>
                <div v-if="totalCashIn > 0" class="flex justify-between">
                    <span class="text-muted-foreground">+ Cash in</span>
                    <span>{{ peso(totalCashIn) }}</span>
                </div>
                <div v-if="totalCashOut > 0" class="flex justify-between">
                    <span class="text-muted-foreground">− Cash out</span>
                    <span>{{ peso(totalCashOut) }}</span>
                </div>
                <div class="flex justify-between border-t border-dashed pt-0.5">
                    <span class="text-muted-foreground">Expected cash</span>
                    <span>{{ peso(expectedCash) }}</span>
                </div>
                <div v-if="shift.closing_cash !== null" class="flex justify-between">
                    <span class="text-muted-foreground">Actual (counted)</span>
                    <span>{{ peso(shift.closing_cash) }}</span>
                </div>
                <div v-if="shift.closing_cash !== null" class="flex justify-between font-bold border-t border-dashed pt-0.5 mt-0.5">
                    <span>{{ variance >= 0 ? 'OVER' : 'SHORT' }}</span>
                    <span>{{ variance >= 0 ? '+' : '' }}{{ peso(variance) }}</span>
                </div>
            </div>

            <!-- Cash movements -->
            <div v-if="(shift.cash_movements ?? []).length > 0" class="border-b border-dashed pb-3 mb-3">
                <p class="font-bold mb-1">CASH MOVEMENTS</p>
                <div
                    v-for="m in shift.cash_movements"
                    :key="m.id"
                    class="mb-1"
                >
                    <div class="flex justify-between">
                        <span class="text-muted-foreground uppercase text-[9px]">{{ m.type === 'cash_in' ? 'IN' : 'OUT' }}</span>
                        <span :class="m.type === 'cash_in' ? '' : 'text-muted-foreground'">
                            {{ m.type === 'cash_in' ? '+' : '-' }}{{ peso(m.amount) }}
                        </span>
                    </div>
                    <div v-if="m.reason" class="text-muted-foreground pl-1 text-[9px] leading-snug">{{ m.reason }}</div>
                </div>
            </div>

            <!-- Top products -->
            <div v-if="topProducts.length > 0" class="border-b border-dashed pb-3 mb-3">
                <p class="font-bold mb-1">TOP PRODUCTS</p>
                <div
                    v-for="(p, i) in topProducts"
                    :key="p.product_sku"
                    class="flex justify-between mb-0.5"
                >
                    <span class="flex-1 truncate pr-1 text-muted-foreground">{{ i + 1 }}. {{ p.product_name }}</span>
                    <span class="shrink-0">×{{ p.qty }}</span>
                </div>
            </div>

            <!-- Notes -->
            <div v-if="shift.notes" class="border-b border-dashed pb-3 mb-3">
                <p class="font-bold mb-1">NOTES</p>
                <p class="text-muted-foreground leading-snug">{{ shift.notes }}</p>
            </div>

            <!-- Footer -->
            <div class="text-center space-y-0.5 mt-2">
                <p class="text-[10px] text-muted-foreground">Printed: {{ fmt(new Date().toISOString()) }}</p>
                <p class="text-[10px] text-muted-foreground">Shift #{{ shift.id }} — {{ shift.cashier?.name }}</p>
            </div>
        </div>
    </div>
</template>

<style>
@media print {
    .print\:hidden { display: none !important; }

    body { margin: 0; }

    .report {
        width: 80mm !important;
        margin: 0 !important;
        padding: 4px 6px !important;
        font-size: 10px !important;
        line-height: 1.3 !important;
    }
}
</style>
