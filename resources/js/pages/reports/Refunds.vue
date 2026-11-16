<script setup lang="ts">
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { AlertCircle, ArrowLeft, Package, RotateCcw, Users } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/composables/useCurrency';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';
import * as SaleController from '@/actions/App/Http/Controllers/POS/SaleController';

interface Summary {
    total_refunds:   number;
    total_amount:    number;
    total_sales:     number;
    refund_rate:     number;
    refund_amt_rate: number;
}

interface CashierRow {
    cashier_id:   number;
    cashier_name: string;
    refund_count: number;
    refund_total: number;
}

interface ProductRow {
    product_name:  string;
    product_sku:   string;
    qty:           number;
    refund_amount: number;
}

interface RefundRecord {
    id:             number;
    receipt_number: string;
    cashier_id:     number;
    total_amount:   number;
    notes:          string | null;
    created_at:     string;
    cashier:        { id: number; name: string } | null;
    originalSale:   { id: number; receipt_number: string } | null;
}

const props = defineProps<{
    summary:     Summary;
    byCashier:   CashierRow[];
    topProducts: ProductRow[];
    list:        RefundRecord[];
    filters:     { preset?: string; date_from?: string; date_to?: string };
    dateFrom:    string;
    dateTo:      string;
}>();

const { format } = useCurrency();

// ── Date range ────────────────────────────────────────────────────────────
const preset   = ref(props.filters.preset ?? 'this_month');
const dateFrom = ref(props.filters.date_from ?? props.dateFrom);
const dateTo   = ref(props.filters.date_to   ?? props.dateTo);

const presets = [
    { value: 'today',      label: 'Today' },
    { value: 'yesterday',  label: 'Yesterday' },
    { value: 'this_week',  label: 'This Week' },
    { value: 'last_week',  label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'custom',     label: 'Custom Range' },
];

function applyFilters() {
    router.get(ReportController.refunds.url(), {
        preset:    preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true, replace: true });
}

watch(preset, (val) => { if (val !== 'custom') applyFilters(); });

// ── Helpers ───────────────────────────────────────────────────────────────
const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function formatDt(s: string): string { return dtf.format(new Date(s)); }

function rateColor(rate: number): string {
    if (rate <= 1) return 'text-green-700 dark:text-green-400';
    if (rate <= 3) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
}

const maxCashierRefunds = Math.max(...props.byCashier.map(r => r.refund_count), 1);
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports' },
        { title: 'Refunds', href: ReportController.refunds.url() },
    ]">
        <div class="p-6 space-y-6 max-w-6xl">

            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Refund Report</h1>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        Refund transactions processed in the selected period
                    </p>
                </div>
            </div>

            <!-- Date range filter -->
            <div class="flex flex-wrap items-center gap-3">
                <Select v-model="preset" @update:model-value="val => { preset = val; }">
                    <SelectTrigger class="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="p in presets" :key="p.value" :value="p.value">
                            {{ p.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <template v-if="preset === 'custom'">
                    <Input type="date" v-model="dateFrom" class="w-40" />
                    <span class="text-muted-foreground text-sm">to</span>
                    <Input type="date" v-model="dateTo" class="w-40" />
                    <Button size="sm" @click="applyFilters">Apply</Button>
                </template>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <RotateCcw class="h-3.5 w-3.5" />Refunds
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.total_refunds }}</p>
                    <p class="text-xs text-muted-foreground">of {{ summary.total_sales.toLocaleString() }} sales</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
                    <div class="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs">
                        <ArrowLeft class="h-3.5 w-3.5" />Amount Refunded
                    </div>
                    <p class="text-xl font-bold tabular-nums text-red-700 dark:text-red-300">{{ format(summary.total_amount) }}</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <AlertCircle class="h-3.5 w-3.5" />Refund Rate
                    </div>
                    <p class="text-2xl font-bold tabular-nums" :class="rateColor(summary.refund_rate)">
                        {{ summary.refund_rate }}%
                    </p>
                    <p class="text-xs text-muted-foreground">by count</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <AlertCircle class="h-3.5 w-3.5" />Revenue Impact
                    </div>
                    <p class="text-2xl font-bold tabular-nums" :class="rateColor(summary.refund_amt_rate)">
                        {{ summary.refund_amt_rate }}%
                    </p>
                    <p class="text-xs text-muted-foreground">of gross revenue</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <RotateCcw class="h-3.5 w-3.5" />Avg Refund
                    </div>
                    <p class="text-xl font-bold tabular-nums">
                        {{ summary.total_refunds > 0 ? format(Math.round(summary.total_amount / summary.total_refunds)) : '—' }}
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Per-cashier breakdown -->
                <div class="rounded-xl border overflow-hidden">
                    <div class="border-b px-4 py-3 flex items-center gap-2">
                        <Users class="h-4 w-4 text-muted-foreground" />
                        <h2 class="font-semibold text-sm">By Cashier</h2>
                    </div>
                    <div class="divide-y">
                        <div
                            v-for="row in byCashier"
                            :key="row.cashier_id"
                            class="flex items-center gap-3 px-4 py-3"
                        >
                            <div class="flex-1 min-w-0">
                                <p class="font-medium text-sm truncate">{{ row.cashier_name }}</p>
                                <div class="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        class="h-full rounded-full bg-red-400"
                                        :style="{ width: `${(row.refund_count / maxCashierRefunds * 100).toFixed(1)}%` }"
                                    />
                                </div>
                            </div>
                            <div class="text-right shrink-0">
                                <p class="text-sm font-semibold tabular-nums">{{ row.refund_count }} refunds</p>
                                <p class="text-xs text-muted-foreground tabular-nums">{{ format(row.refund_total) }}</p>
                            </div>
                        </div>
                        <div v-if="byCashier.length === 0" class="px-4 py-8 text-center text-muted-foreground text-sm">
                            No refunds in this period.
                        </div>
                    </div>
                </div>

                <!-- Top refunded products -->
                <div class="rounded-xl border overflow-hidden">
                    <div class="border-b px-4 py-3 flex items-center gap-2">
                        <Package class="h-4 w-4 text-muted-foreground" />
                        <h2 class="font-semibold text-sm">Top Refunded Products</h2>
                    </div>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-3 py-2 font-medium">Product</th>
                                <th class="px-3 py-2 font-medium text-right">Qty</th>
                                <th class="px-3 py-2 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="p in topProducts" :key="p.product_sku" class="hover:bg-muted/20">
                                <td class="px-3 py-2">
                                    <p class="font-medium leading-snug text-xs">{{ p.product_name }}</p>
                                    <p class="text-[10px] text-muted-foreground font-mono">{{ p.product_sku }}</p>
                                </td>
                                <td class="px-3 py-2 text-right tabular-nums text-xs">{{ p.qty }}</td>
                                <td class="px-3 py-2 text-right tabular-nums text-xs font-semibold text-red-600 dark:text-red-400">
                                    {{ format(p.refund_amount) }}
                                </td>
                            </tr>
                            <tr v-if="topProducts.length === 0">
                                <td colspan="3" class="px-3 py-8 text-center text-muted-foreground text-sm">
                                    No refund items found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Individual refund list -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3 flex items-center gap-2">
                    <RotateCcw class="h-4 w-4 text-muted-foreground" />
                    <h2 class="font-semibold text-sm">Refund Transactions</h2>
                    <span class="text-xs text-muted-foreground ml-auto">most recent 50</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-3 py-2.5 font-medium">Refund #</th>
                                <th class="px-3 py-2.5 font-medium">Original Sale</th>
                                <th class="px-3 py-2.5 font-medium">Cashier</th>
                                <th class="px-3 py-2.5 font-medium">Reason</th>
                                <th class="px-3 py-2.5 font-medium text-right">Amount</th>
                                <th class="px-3 py-2.5 font-medium text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="r in list" :key="r.id" class="hover:bg-muted/20 transition-colors">
                                <td class="px-3 py-2">
                                    <a
                                        :href="SaleController.show.url({ sale: r.id })"
                                        class="font-mono text-xs text-primary hover:underline"
                                    >{{ r.receipt_number }}</a>
                                </td>
                                <td class="px-3 py-2">
                                    <a
                                        v-if="r.originalSale"
                                        :href="SaleController.show.url({ sale: r.originalSale.id })"
                                        class="font-mono text-xs text-muted-foreground hover:underline"
                                    >{{ r.originalSale.receipt_number }}</a>
                                    <span v-else class="text-muted-foreground text-xs">—</span>
                                </td>
                                <td class="px-3 py-2 text-xs text-muted-foreground">
                                    {{ r.cashier?.name ?? '—' }}
                                </td>
                                <td class="px-3 py-2 text-xs text-muted-foreground max-w-xs">
                                    <span class="line-clamp-1">{{ r.notes ?? '—' }}</span>
                                </td>
                                <td class="px-3 py-2 text-right tabular-nums font-semibold text-red-600 dark:text-red-400">
                                    {{ format(r.total_amount) }}
                                </td>
                                <td class="px-3 py-2 text-right text-xs text-muted-foreground whitespace-nowrap">
                                    {{ formatDt(r.created_at) }}
                                </td>
                            </tr>
                            <tr v-if="list.length === 0">
                                <td colspan="6" class="px-3 py-12 text-center text-muted-foreground">
                                    No refunds in this period.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
