<script setup lang="ts">
import { ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { TrendingUp } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';

interface Summary {
    gross_sales:    number;
    discounts:      number;
    refunds:        number;
    net_revenue:    number;
    cogs:           number;
    gross_profit:   number;
    gross_margin:   number;
    total_expenses: number;
    net_income:     number;
    net_margin:     number;
}

interface DayRow {
    date:         string;
    revenue:      number;
    refunds:      number;
    net_revenue:  number;
    cogs:         number;
    gross_profit: number;
    expenses:     number;
    net_income:   number;
}

const props = defineProps<{
    summary:            Summary;
    expenseByCategory:  Record<string, number>;
    expenseCategories:  Record<string, string>;
    days:               DayRow[];
    filters:            { preset?: string; date_from?: string; date_to?: string };
    dateFrom:           string;
    dateTo:             string;
}>();

// ── Date range ────────────────────────────────────────────────────────────
const presets = [
    { value: 'today',      label: 'Today' },
    { value: 'yesterday',  label: 'Yesterday' },
    { value: 'this_week',  label: 'This Week' },
    { value: 'last_week',  label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'custom',     label: 'Custom…' },
];

const preset   = ref(props.filters.preset ?? 'this_month');
const dateFrom = ref(props.filters.date_from ?? props.dateFrom);
const dateTo   = ref(props.filters.date_to   ?? props.dateTo);

watch(preset, (p) => {
    if (p !== 'custom') apply();
});

function apply() {
    router.get(ReportController.profitLoss.url(), {
        preset:    preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true, replace: true });
}

// ── Helpers ───────────────────────────────────────────────────────────────
function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}
function pct(n: number): string { return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`; }

const df = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function fmt(s: string): string { return df.format(new Date(s + 'T00:00:00')); }

function marginClass(m: number): string {
    if (m >= 30) return 'text-green-600';
    if (m >= 10) return 'text-amber-600';
    return 'text-red-600';
}

function incomeClass(v: number): string {
    return v >= 0 ? 'text-green-600' : 'text-red-600';
}

// ── CSV Export ────────────────────────────────────────────────────────────
function exportCsv() {
    const rows = [
        ['Date', 'Revenue', 'Refunds', 'Net Revenue', 'COGS', 'Gross Profit', 'Expenses', 'Net Income'],
        ...props.days.map(d => [
            d.date,
            (d.revenue      / 100).toFixed(2),
            (d.refunds      / 100).toFixed(2),
            (d.net_revenue  / 100).toFixed(2),
            (d.cogs         / 100).toFixed(2),
            (d.gross_profit / 100).toFixed(2),
            (d.expenses     / 100).toFixed(2),
            (d.net_income   / 100).toFixed(2),
        ]),
        ['TOTAL',
            (props.summary.gross_sales    / 100).toFixed(2),
            (props.summary.refunds        / 100).toFixed(2),
            (props.summary.net_revenue    / 100).toFixed(2),
            (props.summary.cogs           / 100).toFixed(2),
            (props.summary.gross_profit   / 100).toFixed(2),
            (props.summary.total_expenses / 100).toFixed(2),
            (props.summary.net_income     / 100).toFixed(2),
        ],
    ];
    const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `profit-loss-${props.dateFrom}-to-${props.dateTo}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports', href: ReportController.sales.url() },
        { title: 'Profit & Loss', href: ReportController.profitLoss.url() },
    ]">
        <div class="max-w-5xl p-6 space-y-6">

            <!-- Header -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                        <TrendingUp class="h-5 w-5" />
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">Profit & Loss</h1>
                        <p class="text-muted-foreground text-sm">{{ fmt(dateFrom) }} – {{ fmt(dateTo) }}</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" @click="exportCsv">Export CSV</Button>
            </div>

            <!-- Date filter -->
            <div class="flex flex-wrap gap-2 items-end">
                <div class="flex flex-wrap gap-1">
                    <button
                        v-for="p in presets"
                        :key="p.value"
                        class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                        :class="preset === p.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'hover:bg-muted'"
                        @click="preset = p.value"
                    >{{ p.label }}</button>
                </div>
                <template v-if="preset === 'custom'">
                    <input type="date" v-model="dateFrom" class="rounded-lg border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/30" />
                    <input type="date" v-model="dateTo"   class="rounded-lg border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary/30" />
                    <Button size="sm" @click="apply">Apply</Button>
                </template>
            </div>

            <!-- P&L Statement -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-5 py-3 bg-muted/30">
                    <h2 class="font-semibold">Income Statement</h2>
                </div>
                <div class="divide-y text-sm">

                    <!-- Revenue section -->
                    <div class="px-5 py-2 flex justify-between text-muted-foreground">
                        <span>Gross Sales</span>
                        <span class="tabular-nums">{{ peso(summary.gross_sales) }}</span>
                    </div>
                    <div class="px-5 py-2 flex justify-between text-muted-foreground">
                        <span class="pl-4">Less: Discounts</span>
                        <span class="tabular-nums text-red-500">({{ peso(summary.discounts) }})</span>
                    </div>
                    <div class="px-5 py-2 flex justify-between text-muted-foreground">
                        <span class="pl-4">Less: Refunds</span>
                        <span class="tabular-nums text-red-500">({{ peso(summary.refunds) }})</span>
                    </div>
                    <div class="px-5 py-3 flex justify-between font-semibold bg-muted/20">
                        <span>Net Revenue</span>
                        <span class="tabular-nums">{{ peso(summary.net_revenue) }}</span>
                    </div>

                    <!-- COGS -->
                    <div class="px-5 py-2 flex justify-between text-muted-foreground">
                        <span class="pl-4">Less: Cost of Goods Sold</span>
                        <span class="tabular-nums text-red-500">({{ peso(summary.cogs) }})</span>
                    </div>

                    <!-- Gross profit -->
                    <div class="px-5 py-3 flex justify-between font-semibold bg-muted/20">
                        <span>Gross Profit</span>
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-normal" :class="marginClass(summary.gross_margin)">
                                {{ pct(summary.gross_margin) }} margin
                            </span>
                            <span class="tabular-nums" :class="incomeClass(summary.gross_profit)">
                                {{ peso(summary.gross_profit) }}
                            </span>
                        </div>
                    </div>

                    <!-- Expenses section header -->
                    <div class="px-5 py-2 bg-muted/10">
                        <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Operating Expenses</span>
                    </div>
                    <div
                        v-for="(amount, cat) in expenseByCategory"
                        :key="cat"
                        class="px-5 py-2 flex justify-between text-muted-foreground"
                    >
                        <span class="pl-4">{{ expenseCategories[cat] ?? cat }}</span>
                        <span class="tabular-nums text-red-500">({{ peso(amount) }})</span>
                    </div>
                    <div v-if="Object.keys(expenseByCategory).length === 0" class="px-5 py-2 text-muted-foreground pl-9 text-xs italic">
                        No expenses recorded in this period.
                    </div>
                    <div class="px-5 py-2 flex justify-between text-muted-foreground">
                        <span class="pl-4">Total Operating Expenses</span>
                        <span class="tabular-nums text-red-500">({{ peso(summary.total_expenses) }})</span>
                    </div>

                    <!-- Net income -->
                    <div class="px-5 py-4 flex justify-between font-bold text-base bg-muted/30 border-t-2">
                        <span>Net Operating Income</span>
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-normal" :class="marginClass(summary.net_margin)">
                                {{ pct(summary.net_margin) }} margin
                            </span>
                            <span class="tabular-nums" :class="incomeClass(summary.net_income)">
                                {{ peso(summary.net_income) }}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Visual margin bars -->
            <div class="grid grid-cols-3 gap-4">
                <div class="rounded-xl border p-4 space-y-2">
                    <p class="text-xs text-muted-foreground">Gross Margin</p>
                    <p class="text-2xl font-bold" :class="marginClass(summary.gross_margin)">
                        {{ summary.gross_margin.toFixed(1) }}%
                    </p>
                    <div class="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div class="h-full rounded-full bg-green-500/60 transition-all"
                            :style="{ width: `${Math.min(summary.gross_margin, 100)}%` }" />
                    </div>
                    <p class="text-xs text-muted-foreground">{{ peso(summary.gross_profit) }} gross profit</p>
                </div>
                <div class="rounded-xl border p-4 space-y-2">
                    <p class="text-xs text-muted-foreground">Net Margin</p>
                    <p class="text-2xl font-bold" :class="incomeClass(summary.net_income)">
                        {{ summary.net_margin.toFixed(1) }}%
                    </p>
                    <div class="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div class="h-full rounded-full transition-all"
                            :class="summary.net_income >= 0 ? 'bg-blue-500/60' : 'bg-red-500/60'"
                            :style="{ width: `${Math.min(Math.abs(summary.net_margin), 100)}%` }" />
                    </div>
                    <p class="text-xs text-muted-foreground">{{ peso(summary.net_income) }} net income</p>
                </div>
                <div class="rounded-xl border p-4 space-y-2">
                    <p class="text-xs text-muted-foreground">Expenses / Revenue</p>
                    <p class="text-2xl font-bold text-amber-600">
                        {{ summary.net_revenue > 0 ? (summary.total_expenses / summary.net_revenue * 100).toFixed(1) : '0.0' }}%
                    </p>
                    <div class="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div class="h-full rounded-full bg-amber-500/60 transition-all"
                            :style="{ width: `${Math.min(summary.net_revenue > 0 ? summary.total_expenses / summary.net_revenue * 100 : 0, 100)}%` }" />
                    </div>
                    <p class="text-xs text-muted-foreground">{{ peso(summary.total_expenses) }} in expenses</p>
                </div>
            </div>

            <!-- Daily breakdown -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3 flex items-center justify-between">
                    <h2 class="font-semibold">Daily Breakdown</h2>
                    <span class="text-xs text-muted-foreground">{{ days.length }} day{{ days.length !== 1 ? 's' : '' }}</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-4 py-2.5 font-medium">Date</th>
                                <th class="px-4 py-2.5 font-medium text-right">Net Revenue</th>
                                <th class="px-4 py-2.5 font-medium text-right">COGS</th>
                                <th class="px-4 py-2.5 font-medium text-right">Gross Profit</th>
                                <th class="px-4 py-2.5 font-medium text-right">Expenses</th>
                                <th class="px-4 py-2.5 font-medium text-right">Net Income</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr
                                v-for="d in days"
                                :key="d.date"
                                class="hover:bg-muted/20"
                                :class="d.net_revenue === 0 && d.expenses === 0 ? 'opacity-40' : ''"
                            >
                                <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ fmt(d.date) }}</td>
                                <td class="px-4 py-2.5 text-right tabular-nums">{{ peso(d.net_revenue) }}</td>
                                <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">({{ peso(d.cogs) }})</td>
                                <td class="px-4 py-2.5 text-right tabular-nums" :class="marginClass(d.net_revenue > 0 ? d.gross_profit / d.net_revenue * 100 : 0)">
                                    {{ peso(d.gross_profit) }}
                                </td>
                                <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                                    {{ d.expenses > 0 ? `(${peso(d.expenses)})` : '—' }}
                                </td>
                                <td class="px-4 py-2.5 text-right tabular-nums font-semibold" :class="incomeClass(d.net_income)">
                                    {{ peso(d.net_income) }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="border-t-2 bg-muted/30 font-semibold">
                                <td class="px-4 py-3">Total</td>
                                <td class="px-4 py-3 text-right tabular-nums">{{ peso(summary.net_revenue) }}</td>
                                <td class="px-4 py-3 text-right tabular-nums text-muted-foreground">({{ peso(summary.cogs) }})</td>
                                <td class="px-4 py-3 text-right tabular-nums" :class="incomeClass(summary.gross_profit)">{{ peso(summary.gross_profit) }}</td>
                                <td class="px-4 py-3 text-right tabular-nums text-muted-foreground">({{ peso(summary.total_expenses) }})</td>
                                <td class="px-4 py-3 text-right tabular-nums font-bold" :class="incomeClass(summary.net_income)">{{ peso(summary.net_income) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
