<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Printer } from '@lucide/vue';
import * as ShiftController from '@/actions/App/Http/Controllers/Admin/ShiftController';
import * as SaleController from '@/actions/App/Http/Controllers/POS/SaleController';
import type { Shift } from '@/types/models';

type ShiftDetail = Shift & {
    sales_count: number;
    total_sales: number | null;
    total_vat: number | null;
    total_discounts: number | null;
    void_count: number;
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

const props = defineProps<{
    shift: ShiftDetail;
    paymentBreakdown: PaymentBreakdown[];
}>();

function peso(c: number | null): string {
    if (!c) return '₱0.00';
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'long', timeStyle: 'short' });
const dtfShort = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function formatDt(s: string | null): string { return s ? dtf.format(new Date(s)) : '—'; }
function formatDtShort(s: string): string { return dtfShort.format(new Date(s)); }

function durationLabel(): string {
    if (!props.shift.opened_at) return '—';
    const end   = props.shift.closed_at ? new Date(props.shift.closed_at) : new Date();
    const start = new Date(props.shift.opened_at);
    const mins  = Math.round((end.getTime() - start.getTime()) / 60000);
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const totalCashIn = () =>
    (props.shift.cash_movements ?? [])
        .filter(m => m.type === 'cash_in')
        .reduce((s, m) => s + m.amount, 0);

const totalCashOut = () =>
    (props.shift.cash_movements ?? [])
        .filter(m => m.type === 'cash_out')
        .reduce((s, m) => s + m.amount, 0);

const paymentLabels: Record<string, string> = {
    cash:  'Cash',
    card:  'Card',
    gcash: 'GCash',
    maya:  'Maya',
};

const overShortClass = () => {
    const v = props.shift.over_short ?? 0;
    if (v > 0) return 'text-green-600';
    if (v < 0) return 'text-red-600';
    return '';
};

function overShortLabel(): string {
    const v = props.shift.over_short ?? 0;
    if (!props.shift.closed_at) return '—';
    return (v > 0 ? '+' : '') + peso(v);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Shifts', href: ShiftController.index.url() },
        { title: `Shift #${shift.id}`, href: ShiftController.show.url(shift.id) },
    ]">
        <div class="p-6 space-y-6 max-w-4xl">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-bold">Shift #{{ shift.id }}</h1>
                        <span
                            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                            :class="shift.status === 'open'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-muted text-muted-foreground'"
                        >{{ shift.status === 'open' ? 'Open' : 'Closed' }}</span>
                    </div>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        {{ shift.cashier?.name ?? '—' }} · {{ durationLabel() }}
                    </p>
                </div>
                <a
                    v-if="shift.closed_at"
                    :href="ShiftController.report.url({ shift: shift.id })"
                    target="_blank"
                    class="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                >
                    <Printer class="h-4 w-4" />
                    Print Z-Report
                </a>
            </div>

            <!-- KPI cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Total Revenue</p>
                    <p class="text-xl font-bold tabular-nums">{{ peso(shift.total_sales) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Transactions</p>
                    <p class="text-xl font-bold tabular-nums">{{ shift.sales_count }}</p>
                    <p class="text-muted-foreground text-xs">{{ shift.void_count }} voided</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">VAT Collected</p>
                    <p class="text-xl font-bold tabular-nums">{{ peso(shift.total_vat) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Discounts Given</p>
                    <p class="text-xl font-bold tabular-nums">{{ peso(shift.total_discounts) }}</p>
                </div>
            </div>

            <!-- Shift details + Cash reconciliation -->
            <div class="grid gap-4 sm:grid-cols-2">
                <!-- Shift timeline -->
                <div class="rounded-xl border p-4 space-y-3 text-sm">
                    <h2 class="font-semibold">Shift Details</h2>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Cashier</span>
                            <span class="font-medium">{{ shift.cashier?.name ?? '—' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Opened</span>
                            <span>{{ formatDt(shift.opened_at) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Closed</span>
                            <span>{{ formatDt(shift.closed_at) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Duration</span>
                            <span>{{ durationLabel() }}</span>
                        </div>
                    </div>
                </div>

                <!-- Cash reconciliation -->
                <div class="rounded-xl border p-4 space-y-2 text-sm">
                    <h2 class="font-semibold mb-3">Cash Reconciliation</h2>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Opening Float</span>
                        <span class="tabular-nums">{{ peso(shift.opening_float) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Cash Sales</span>
                        <span class="tabular-nums">
                            {{ peso(paymentBreakdown.find(p => p.payment_method === 'cash')?.total ?? 0) }}
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Cash In</span>
                        <span class="tabular-nums">{{ peso(totalCashIn()) }}</span>
                    </div>
                    <div class="flex justify-between text-red-600">
                        <span>Cash Out</span>
                        <span class="tabular-nums">({{ peso(totalCashOut()) }})</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between">
                        <span class="text-muted-foreground">Expected Cash</span>
                        <span class="tabular-nums font-medium">{{ peso(shift.expected_cash) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Actual Closing</span>
                        <span class="tabular-nums font-medium">{{ shift.closing_cash !== null ? peso(shift.closing_cash) : '—' }}</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between font-semibold" :class="overShortClass()">
                        <span>Over / Short</span>
                        <span class="tabular-nums">{{ overShortLabel() }}</span>
                    </div>
                </div>
            </div>

            <!-- Payment method breakdown -->
            <div class="rounded-xl border p-4">
                <h2 class="font-semibold text-sm mb-4">Payment Method Breakdown</h2>
                <div v-if="paymentBreakdown.length" class="space-y-2">
                    <div
                        v-for="pm in paymentBreakdown"
                        :key="pm.payment_method"
                        class="flex items-center gap-3 text-sm"
                    >
                        <span class="w-20 font-medium">{{ paymentLabels[pm.payment_method] ?? pm.payment_method }}</span>
                        <div class="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                class="h-full bg-primary/60 rounded-full"
                                :style="{
                                    width: `${(pm.total / (shift.total_sales || 1) * 100).toFixed(1)}%`,
                                }"
                            />
                        </div>
                        <span class="w-28 text-right tabular-nums">{{ peso(pm.total) }}</span>
                        <span class="w-16 text-right text-muted-foreground tabular-nums">{{ pm.cnt }} txn</span>
                    </div>
                </div>
                <p v-else class="text-muted-foreground text-sm">No completed sales in this shift.</p>
            </div>

            <!-- Cash movements -->
            <div v-if="shift.cash_movements?.length" class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold text-sm">Cash Movements</h2>
                </div>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2 font-medium">Type</th>
                            <th class="px-4 py-2 font-medium">Reason</th>
                            <th class="px-4 py-2 font-medium">By</th>
                            <th class="px-4 py-2 font-medium">Time</th>
                            <th class="px-4 py-2 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="mv in shift.cash_movements" :key="mv.id" class="hover:bg-muted/20">
                            <td class="px-4 py-2.5">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="mv.type === 'cash_in'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'"
                                >{{ mv.type === 'cash_in' ? 'Cash In' : 'Cash Out' }}</span>
                            </td>
                            <td class="px-4 py-2.5 text-muted-foreground">{{ mv.reason ?? '—' }}</td>
                            <td class="px-4 py-2.5">{{ mv.user?.name ?? '—' }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ formatDtShort(mv.created_at) }}</td>
                            <td
                                class="px-4 py-2.5 text-right tabular-nums font-medium"
                                :class="mv.type === 'cash_in' ? 'text-green-600' : 'text-red-600'"
                            >{{ (mv.type === 'cash_in' ? '+' : '-') + peso(mv.amount) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Shift notes -->
            <div v-if="shift.notes" class="rounded-xl border p-4 text-sm">
                <p class="text-muted-foreground text-xs mb-1">Notes</p>
                <p>{{ shift.notes }}</p>
            </div>

            <!-- Link to sales filtered by shift would need a sales page filter — provide quick link -->
            <div class="flex gap-2">
                <Link
                    :href="SaleController.index.url()"
                    class="text-primary hover:underline text-sm"
                >View all sales →</Link>
            </div>
        </div>
    </AppLayout>
</template>
