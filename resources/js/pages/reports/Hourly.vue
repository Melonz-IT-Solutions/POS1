<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { Clock, Flame, TrendingUp } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/composables/useCurrency';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';

interface HourRow {
    hour:         number;
    label:        string;
    transactions: number;
    revenue:      number;
}

interface DayRow {
    dow:          number;
    label:        string;
    transactions: number;
    revenue:      number;
}

interface PeakHour {
    hour:         number;
    label:        string;
    transactions: number;
    revenue:      number;
}

interface Summary {
    total_revenue: number;
    total_tx:      number;
}

const props = defineProps<{
    byHour:    HourRow[];
    byDay:     DayRow[];
    peakHours: PeakHour[];
    summary:   Summary;
    filters:   { preset?: string; date_from?: string; date_to?: string };
    dateFrom:  string;
    dateTo:    string;
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
    router.get(ReportController.hourly.url(), {
        preset:    preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true, replace: true });
}

watch(preset, (val) => { if (val !== 'custom') applyFilters(); });

// ── Chart helpers ─────────────────────────────────────────────────────────
const maxHourTx  = computed(() => Math.max(...props.byHour.map(h => h.transactions), 1));
const maxDayTx   = computed(() => Math.max(...props.byDay.map(d => d.transactions), 1));

function barHeight(val: number, max: number): number {
    return Math.round((val / max) * 120);
}

// Intensity class for hour cell: 0 = empty, 1-4 = light → dark
function intensity(tx: number): string {
    if (tx === 0) return 'bg-muted/30';
    const pct = tx / maxHourTx.value;
    if (pct < 0.25) return 'bg-primary/20';
    if (pct < 0.5)  return 'bg-primary/40';
    if (pct < 0.75) return 'bg-primary/70';
    return 'bg-primary';
}

function txColor(tx: number): string {
    if (tx === 0) return 'text-muted-foreground/40';
    const pct = tx / maxHourTx.value;
    if (pct < 0.5) return 'text-foreground';
    return 'text-primary-foreground';
}

// AM/PM label for hour
function ampm(h: number): string {
    if (h === 0)  return '12am';
    if (h < 12)   return `${h}am`;
    if (h === 12) return '12pm';
    return `${h - 12}pm`;
}

// Peak hour rank colours
const rankCls = [
    'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300',
    'border-slate-300  bg-slate-50  dark:border-slate-600  dark:bg-slate-800/50  text-slate-600  dark:text-slate-300',
    'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300',
];

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function formatDate(s: string): string { return dtf.format(new Date(s + 'T00:00:00')); }
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports' },
        { title: 'Hourly Analysis', href: ReportController.hourly.url() },
    ]">
        <div class="p-6 space-y-6 max-w-5xl">

            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Hourly Sales Analysis</h1>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        {{ formatDate(dateFrom) }} — {{ formatDate(dateTo) }}
                        · {{ summary.total_tx.toLocaleString() }} transactions · {{ format(summary.total_revenue) }} revenue
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

            <!-- Peak hours callout -->
            <div v-if="peakHours.some(p => p.transactions > 0)" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                    v-for="(peak, i) in peakHours"
                    :key="peak.hour"
                    class="rounded-xl border p-4 space-y-1"
                    :class="rankCls[i]"
                >
                    <div class="flex items-center gap-2">
                        <Flame class="h-4 w-4" />
                        <p class="font-semibold text-sm">
                            {{ i === 0 ? 'Busiest Hour' : i === 1 ? '2nd Busiest' : '3rd Busiest' }}
                        </p>
                    </div>
                    <p class="text-3xl font-bold tabular-nums">{{ ampm(peak.hour) }}</p>
                    <p class="text-xs">{{ peak.transactions.toLocaleString() }} transactions · {{ format(peak.revenue) }}</p>
                </div>
            </div>

            <!-- Hour-of-day bar chart -->
            <div class="rounded-xl border p-5 space-y-4">
                <div class="flex items-center gap-2">
                    <Clock class="h-4 w-4 text-muted-foreground" />
                    <h2 class="font-semibold text-sm">Transactions by Hour of Day</h2>
                    <span class="text-xs text-muted-foreground ml-auto">all periods combined</span>
                </div>

                <!-- SVG bar chart -->
                <div class="overflow-x-auto">
                    <svg
                        :viewBox="`0 0 ${24 * 36} 160`"
                        class="w-full min-w-[640px] h-40"
                        preserveAspectRatio="none"
                    >
                        <g v-for="(row, i) in byHour" :key="row.hour">
                            <!-- Bar -->
                            <rect
                                :x="i * 36 + 4"
                                :y="130 - barHeight(row.transactions, maxHourTx)"
                                :width="28"
                                :height="barHeight(row.transactions, maxHourTx)"
                                :class="row.transactions > 0
                                    ? (row.transactions / maxHourTx >= 0.75
                                        ? 'fill-primary'
                                        : row.transactions / maxHourTx >= 0.4
                                            ? 'fill-primary/60'
                                            : 'fill-primary/30')
                                    : 'fill-muted'"
                                rx="3"
                            />
                            <!-- Hour label -->
                            <text
                                :x="i * 36 + 18"
                                y="148"
                                text-anchor="middle"
                                class="fill-muted-foreground"
                                font-size="8"
                            >{{ ampm(row.hour) }}</text>
                            <!-- Value on top of bar -->
                            <text
                                v-if="row.transactions > 0"
                                :x="i * 36 + 18"
                                :y="126 - barHeight(row.transactions, maxHourTx)"
                                text-anchor="middle"
                                class="fill-muted-foreground"
                                font-size="7"
                            >{{ row.transactions }}</text>
                        </g>
                    </svg>
                </div>
            </div>

            <!-- Hour heatmap grid + Day-of-week side by side -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Hour heatmap: 6 rows × 4 cols (00-05 / 06-11 / 12-17 / 18-23) -->
                <div class="rounded-xl border p-5 space-y-3">
                    <div class="flex items-center gap-2">
                        <TrendingUp class="h-4 w-4 text-muted-foreground" />
                        <h2 class="font-semibold text-sm">Hour Heatmap</h2>
                    </div>
                    <div class="grid grid-cols-4 gap-1.5">
                        <div
                            v-for="row in byHour"
                            :key="row.hour"
                            class="rounded-lg p-2 text-center transition-colors"
                            :class="intensity(row.transactions)"
                            :title="`${row.label}: ${row.transactions} txns, ${format(row.revenue)}`"
                        >
                            <p class="text-[10px] font-mono leading-none" :class="txColor(row.transactions)">
                                {{ ampm(row.hour) }}
                            </p>
                            <p class="text-xs font-bold tabular-nums mt-0.5" :class="txColor(row.transactions)">
                                {{ row.transactions || '' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                        <span>Low</span>
                        <div class="flex gap-0.5">
                            <div class="h-3 w-4 rounded bg-primary/20" />
                            <div class="h-3 w-4 rounded bg-primary/40" />
                            <div class="h-3 w-4 rounded bg-primary/70" />
                            <div class="h-3 w-4 rounded bg-primary" />
                        </div>
                        <span>High</span>
                    </div>
                </div>

                <!-- Day of week chart -->
                <div class="rounded-xl border p-5 space-y-4">
                    <div class="flex items-center gap-2">
                        <TrendingUp class="h-4 w-4 text-muted-foreground" />
                        <h2 class="font-semibold text-sm">Transactions by Day of Week</h2>
                    </div>
                    <div class="space-y-2">
                        <div
                            v-for="day in byDay"
                            :key="day.dow"
                            class="flex items-center gap-3"
                        >
                            <span class="w-8 text-xs font-semibold text-muted-foreground">{{ day.label }}</span>
                            <div class="flex-1 h-6 rounded-md bg-muted/30 overflow-hidden">
                                <div
                                    class="h-full rounded-md bg-primary/70 transition-all"
                                    :style="{ width: `${(day.transactions / maxDayTx * 100).toFixed(1)}%` }"
                                />
                            </div>
                            <span class="w-24 text-right text-xs tabular-nums text-muted-foreground">
                                {{ day.transactions.toLocaleString() }} txns
                            </span>
                            <span class="w-24 text-right text-xs tabular-nums font-medium">
                                {{ format(day.revenue) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Full hour table -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold text-sm">Full Hour-by-Hour Table</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-3 py-2.5 font-medium">Hour</th>
                                <th class="px-3 py-2.5 font-medium text-right">Transactions</th>
                                <th class="px-3 py-2.5 font-medium text-right">Revenue</th>
                                <th class="px-3 py-2.5 font-medium text-right">% of Total Txns</th>
                                <th class="px-3 py-2.5 font-medium w-32">Share</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr
                                v-for="row in byHour"
                                :key="row.hour"
                                class="hover:bg-muted/20 transition-colors"
                                :class="row.transactions === 0 ? 'opacity-40' : ''"
                            >
                                <td class="px-3 py-2 font-mono text-xs">
                                    {{ row.label }}
                                    <span class="text-muted-foreground ml-1">{{ ampm(row.hour) }}</span>
                                </td>
                                <td class="px-3 py-2 text-right tabular-nums font-semibold">
                                    {{ row.transactions.toLocaleString() }}
                                </td>
                                <td class="px-3 py-2 text-right tabular-nums">
                                    {{ row.revenue > 0 ? format(row.revenue) : '—' }}
                                </td>
                                <td class="px-3 py-2 text-right tabular-nums text-muted-foreground text-xs">
                                    {{ summary.total_tx > 0 ? (row.transactions / summary.total_tx * 100).toFixed(1) + '%' : '—' }}
                                </td>
                                <td class="px-3 py-2">
                                    <div class="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            class="h-full rounded-full bg-primary transition-all"
                                            :style="{ width: `${(row.transactions / maxHourTx * 100).toFixed(1)}%` }"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
