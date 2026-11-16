<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { Download, FileText, Receipt, TrendingUp } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/composables/useCurrency';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';

interface DailyRow {
    date:         string;
    transactions: number;
    gross_sales:  number;
    discounts:    number;
    vatable_net:  number;
    output_vat:   number;
    vat_exempt:   number;
    zero_rated:   number;
    net_sales:    number;
}

interface Summary {
    transaction_count: number;
    gross_sales:       number;
    total_discounts:   number;
    vatable_net:       number;
    output_vat:        number;
    vat_exempt:        number;
    zero_rated:        number;
    net_sales:         number;
}

const props = defineProps<{
    summary:  Summary;
    daily:    DailyRow[];
    filters:  { preset?: string; date_from?: string; date_to?: string };
    dateFrom: string;
    dateTo:   string;
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
    router.get(ReportController.tax.url(), {
        preset:    preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true, replace: true });
}

watch(preset, (val) => { if (val !== 'custom') applyFilters(); });

// ── Helpers ───────────────────────────────────────────────────────────────
const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function formatDate(s: string): string { return dtf.format(new Date(s + 'T00:00:00')); }

// ── Percentage of gross for the summary visual ─────────────────────────────
function pctOfGross(val: number): string {
    if (!props.summary.gross_sales) return '0%';
    return (val / props.summary.gross_sales * 100).toFixed(1) + '%';
}

// ── Computed vatable gross (net + VAT) ─────────────────────────────────────
const vatableGross = computed(() => props.summary.vatable_net + props.summary.output_vat);

// ── CSV Export ────────────────────────────────────────────────────────────
function exportCsv() {
    const headers = [
        'Date', 'Transactions',
        'Gross Sales (₱)', 'Discounts (₱)',
        'VATable Sales / Net (₱)', 'Output VAT 12% (₱)',
        'VAT-Exempt Sales (₱)', 'Zero-Rated Sales (₱)',
        'Net Sales (₱)',
    ];
    const rows = [headers, ...props.daily.map(r => [
        r.date,
        r.transactions,
        (r.gross_sales / 100).toFixed(2),
        (r.discounts / 100).toFixed(2),
        (r.vatable_net / 100).toFixed(2),
        (r.output_vat / 100).toFixed(2),
        (r.vat_exempt / 100).toFixed(2),
        (r.zero_rated / 100).toFixed(2),
        (r.net_sales / 100).toFixed(2),
    ]), [
        // Totals row
        'TOTAL', props.summary.transaction_count,
        (props.summary.gross_sales / 100).toFixed(2),
        (props.summary.total_discounts / 100).toFixed(2),
        (props.summary.vatable_net / 100).toFixed(2),
        (props.summary.output_vat / 100).toFixed(2),
        (props.summary.vat_exempt / 100).toFixed(2),
        (props.summary.zero_rated / 100).toFixed(2),
        (props.summary.net_sales / 100).toFixed(2),
    ]].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `vat-summary-${props.dateFrom}-to-${props.dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports' },
        { title: 'VAT Summary', href: ReportController.tax.url() },
    ]">
        <div class="p-6 space-y-6 max-w-6xl">

            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">VAT / Tax Summary</h1>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        {{ formatDate(dateFrom) }} — {{ formatDate(dateTo) }}
                        · {{ summary.transaction_count.toLocaleString() }} transactions
                    </p>
                </div>
                <Button variant="outline" class="gap-2" @click="exportCsv">
                    <Download class="h-4 w-4" />
                    Export CSV
                </Button>
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

            <!-- BIR-style summary panel -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-5 py-3 flex items-center gap-2 bg-muted/30">
                    <FileText class="h-4 w-4 text-muted-foreground" />
                    <h2 class="font-semibold text-sm">Summary of Sales</h2>
                    <span class="text-xs text-muted-foreground ml-auto">BIR-style breakdown</span>
                </div>
                <div class="divide-y">

                    <!-- Gross Sales -->
                    <div class="flex items-center justify-between px-5 py-3">
                        <div>
                            <p class="font-semibold text-sm">Gross Sales</p>
                            <p class="text-xs text-muted-foreground">Total revenue before any deductions</p>
                        </div>
                        <p class="text-xl font-bold tabular-nums">{{ format(summary.gross_sales) }}</p>
                    </div>

                    <!-- Less: Discounts -->
                    <div class="flex items-center justify-between px-5 py-3 bg-muted/10">
                        <div class="pl-4">
                            <p class="text-sm text-muted-foreground">Less: Discounts</p>
                        </div>
                        <p class="tabular-nums text-muted-foreground">( {{ format(summary.total_discounts) }} )</p>
                    </div>

                    <!-- Net Sales after discount -->
                    <div class="flex items-center justify-between px-5 py-3 font-semibold">
                        <p class="text-sm">Net Sales</p>
                        <p class="tabular-nums">{{ format(summary.net_sales) }}</p>
                    </div>
                </div>

                <!-- VAT type split -->
                <div class="border-t grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">

                    <!-- VATable -->
                    <div class="p-5 space-y-3">
                        <div class="flex items-center justify-between">
                            <p class="font-semibold text-sm text-blue-700 dark:text-blue-300">VATable Sales</p>
                            <span class="text-xs text-muted-foreground">{{ pctOfGross(vatableGross) }} of gross</span>
                        </div>
                        <div class="space-y-1.5 text-sm">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Gross VATable</span>
                                <span class="tabular-nums font-medium">{{ format(vatableGross) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Net of VAT (÷ 1.12)</span>
                                <span class="tabular-nums">{{ format(summary.vatable_net) }}</span>
                            </div>
                            <div class="flex justify-between border-t pt-1.5">
                                <span class="font-semibold text-blue-700 dark:text-blue-300">Output VAT (12%)</span>
                                <span class="tabular-nums font-bold text-blue-700 dark:text-blue-300">{{ format(summary.output_vat) }}</span>
                            </div>
                        </div>
                        <!-- Mini progress bar -->
                        <div class="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                                class="h-full rounded-full bg-blue-500"
                                :style="{ width: pctOfGross(vatableGross) }"
                            />
                        </div>
                    </div>

                    <!-- VAT-Exempt -->
                    <div class="p-5 space-y-3">
                        <div class="flex items-center justify-between">
                            <p class="font-semibold text-sm text-amber-700 dark:text-amber-300">VAT-Exempt Sales</p>
                            <span class="text-xs text-muted-foreground">{{ pctOfGross(summary.vat_exempt) }} of gross</span>
                        </div>
                        <div class="space-y-1.5 text-sm">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Exempt amount</span>
                                <span class="tabular-nums font-medium">{{ format(summary.vat_exempt) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">VAT due</span>
                                <span class="tabular-nums text-muted-foreground">₱0.00</span>
                            </div>
                            <div class="flex justify-between border-t pt-1.5">
                                <span class="text-xs text-muted-foreground">Includes SC/PWD exemptions</span>
                            </div>
                        </div>
                        <div class="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                                class="h-full rounded-full bg-amber-500"
                                :style="{ width: pctOfGross(summary.vat_exempt) }"
                            />
                        </div>
                    </div>

                    <!-- Zero-Rated -->
                    <div class="p-5 space-y-3">
                        <div class="flex items-center justify-between">
                            <p class="font-semibold text-sm text-green-700 dark:text-green-300">Zero-Rated Sales</p>
                            <span class="text-xs text-muted-foreground">{{ pctOfGross(summary.zero_rated) }} of gross</span>
                        </div>
                        <div class="space-y-1.5 text-sm">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Zero-rated amount</span>
                                <span class="tabular-nums font-medium">{{ format(summary.zero_rated) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">VAT due</span>
                                <span class="tabular-nums text-muted-foreground">₱0.00</span>
                            </div>
                            <div class="flex justify-between border-t pt-1.5">
                                <span class="text-xs text-muted-foreground">Exports, special economic zones</span>
                            </div>
                        </div>
                        <div class="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                                class="h-full rounded-full bg-green-500"
                                :style="{ width: pctOfGross(summary.zero_rated) }"
                            />
                        </div>
                    </div>
                </div>

                <!-- Output VAT highlight -->
                <div class="border-t flex items-center justify-between px-5 py-4 bg-blue-50 dark:bg-blue-950/30">
                    <div class="flex items-center gap-2">
                        <Receipt class="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <div>
                            <p class="font-bold text-sm text-blue-700 dark:text-blue-300">Total Output VAT Remittable</p>
                            <p class="text-xs text-blue-600 dark:text-blue-400">VAT payable to BIR</p>
                        </div>
                    </div>
                    <p class="text-2xl font-bold tabular-nums text-blue-700 dark:text-blue-300">
                        {{ format(summary.output_vat) }}
                    </p>
                </div>
            </div>

            <!-- Daily breakdown table -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3 flex items-center gap-2">
                    <TrendingUp class="h-4 w-4 text-muted-foreground" />
                    <h2 class="font-semibold text-sm">Daily Breakdown</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-3 py-2.5 font-medium">Date</th>
                                <th class="px-3 py-2.5 font-medium text-right">Txns</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap">Gross Sales</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap">Discounts</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap text-blue-700 dark:text-blue-300">VATable Net</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap text-blue-700 dark:text-blue-300">Output VAT</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap text-amber-600 dark:text-amber-400">VAT-Exempt</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap text-green-700 dark:text-green-400">Zero-Rated</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap">Net Sales</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="row in daily" :key="row.date" class="hover:bg-muted/20">
                                <td class="px-3 py-2 whitespace-nowrap">{{ formatDate(row.date) }}</td>
                                <td class="px-3 py-2 text-right tabular-nums text-muted-foreground">{{ row.transactions }}</td>
                                <td class="px-3 py-2 text-right tabular-nums">{{ format(row.gross_sales) }}</td>
                                <td class="px-3 py-2 text-right tabular-nums text-muted-foreground">{{ row.discounts > 0 ? `(${format(row.discounts)})` : '—' }}</td>
                                <td class="px-3 py-2 text-right tabular-nums">{{ format(row.vatable_net) }}</td>
                                <td class="px-3 py-2 text-right tabular-nums font-medium text-blue-700 dark:text-blue-300">{{ format(row.output_vat) }}</td>
                                <td class="px-3 py-2 text-right tabular-nums text-amber-600 dark:text-amber-400">{{ row.vat_exempt > 0 ? format(row.vat_exempt) : '—' }}</td>
                                <td class="px-3 py-2 text-right tabular-nums text-green-700 dark:text-green-400">{{ row.zero_rated > 0 ? format(row.zero_rated) : '—' }}</td>
                                <td class="px-3 py-2 text-right tabular-nums font-semibold">{{ format(row.net_sales) }}</td>
                            </tr>
                            <tr v-if="!daily.length">
                                <td colspan="9" class="px-3 py-10 text-center text-muted-foreground">
                                    No sales in this period.
                                </td>
                            </tr>
                        </tbody>
                        <tfoot v-if="daily.length > 1">
                            <tr class="border-t-2 bg-muted/30 font-semibold">
                                <td class="px-3 py-2.5" colspan="2">Totals</td>
                                <td class="px-3 py-2.5 text-right tabular-nums">{{ format(summary.gross_sales) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{{ summary.total_discounts > 0 ? `(${format(summary.total_discounts)})` : '—' }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums">{{ format(summary.vatable_net) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums text-blue-700 dark:text-blue-300">{{ format(summary.output_vat) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums text-amber-600 dark:text-amber-400">{{ format(summary.vat_exempt) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums text-green-700 dark:text-green-400">{{ format(summary.zero_rated) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums">{{ format(summary.net_sales) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
