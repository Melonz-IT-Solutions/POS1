<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    Download, Mail, Phone, Repeat2, ShoppingBag, Star, TrendingUp, Users,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/composables/useCurrency';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';
import * as CustomerController from '@/actions/App/Http/Controllers/Admin/CustomerController';

interface CustomerRow {
    customer_id:     number;
    name:            string;
    phone:           string | null;
    email:           string | null;
    loyalty_points:  number;
    transactions:    number;
    total_spent:     number;
    avg_transaction: number;
    last_visit:      string;
}

interface Summary {
    total_customers:  number;
    total_revenue:    number;
    total_tx:         number;
    avg_spend:        number;
    repeat_customers: number;
    walkin_revenue:   number;
}

const props = defineProps<{
    rows:     CustomerRow[];
    summary:  Summary;
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
    router.get(ReportController.customers.url(), {
        preset:    preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true, replace: true });
}

watch(preset, (val) => { if (val !== 'custom') applyFilters(); });

// ── Sort ──────────────────────────────────────────────────────────────────
type SortKey = 'name' | 'transactions' | 'total_spent' | 'avg_transaction' | 'loyalty_points' | 'last_visit';
const sortKey = ref<SortKey>('total_spent');
const sortDir = ref<'asc' | 'desc'>('desc');

function setSort(key: SortKey) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDir.value = key === 'name' ? 'asc' : 'desc';
    }
}

const sorted = computed(() => {
    const dir = sortDir.value === 'asc' ? 1 : -1;
    return [...props.rows].sort((a, b) => {
        const av = a[sortKey.value];
        const bv = b[sortKey.value];
        if (typeof av === 'string' && typeof bv === 'string') {
            return dir * av.localeCompare(bv);
        }
        return dir * ((av as number) - (bv as number));
    });
});

function sortIndicator(key: SortKey) {
    if (sortKey.value !== key) return '';
    return sortDir.value === 'asc' ? ' ↑' : ' ↓';
}

// ── Helpers ───────────────────────────────────────────────────────────────
const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function formatDate(s: string): string { return dtf.format(new Date(s)); }

// ── CSV Export ────────────────────────────────────────────────────────────
function exportCsv() {
    const headers = [
        'Name', 'Phone', 'Email',
        'Transactions', 'Total Spent (₱)', 'Avg Transaction (₱)',
        'Loyalty Points', 'Last Visit',
    ];
    const csvRows = [headers, ...sorted.value.map(r => [
        r.name,
        r.phone ?? '',
        r.email ?? '',
        r.transactions,
        (r.total_spent / 100).toFixed(2),
        (r.avg_transaction / 100).toFixed(2),
        r.loyalty_points,
        r.last_visit ? formatDate(r.last_visit) : '',
    ])].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `customer-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

const repeatPct = computed(() =>
    props.summary.total_customers > 0
        ? Math.round(props.summary.repeat_customers / props.summary.total_customers * 100)
        : 0
);
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports' },
        { title: 'Customers', href: ReportController.customers.url() },
    ]">
        <div class="p-6 space-y-6">

            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Customer Report</h1>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        Customer spending within the selected period
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

            <!-- Summary cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Users class="h-3.5 w-3.5" />Customers
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.total_customers }}</p>
                    <p class="text-xs text-muted-foreground">with purchases</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Repeat2 class="h-3.5 w-3.5" />Repeat
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.repeat_customers }}</p>
                    <p class="text-xs text-muted-foreground">{{ repeatPct }}% of buyers</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <ShoppingBag class="h-3.5 w-3.5" />Transactions
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.total_tx.toLocaleString() }}</p>
                    <p class="text-xs text-muted-foreground">named customers</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                    <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs">
                        <TrendingUp class="h-3.5 w-3.5" />Customer Revenue
                    </div>
                    <p class="text-xl font-bold tabular-nums text-blue-700 dark:text-blue-300">{{ format(summary.total_revenue) }}</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <TrendingUp class="h-3.5 w-3.5" />Avg Spend
                    </div>
                    <p class="text-xl font-bold tabular-nums">{{ format(summary.avg_spend) }}</p>
                    <p class="text-xs text-muted-foreground">per customer</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <ShoppingBag class="h-3.5 w-3.5" />Walk-in Revenue
                    </div>
                    <p class="text-xl font-bold tabular-nums">{{ format(summary.walkin_revenue) }}</p>
                    <p class="text-xs text-muted-foreground">no account</p>
                </div>
            </div>

            <!-- Table -->
            <div class="rounded-xl border overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-3 py-2.5 font-medium w-8 text-center">#</th>
                                <th
                                    class="px-3 py-2.5 font-medium cursor-pointer hover:bg-muted/50 select-none"
                                    @click="setSort('name')"
                                >Customer{{ sortIndicator('name') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('transactions')"
                                >Visits{{ sortIndicator('transactions') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('total_spent')"
                                >Total Spent{{ sortIndicator('total_spent') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('avg_transaction')"
                                >Avg Basket{{ sortIndicator('avg_transaction') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('loyalty_points')"
                                >Points{{ sortIndicator('loyalty_points') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('last_visit')"
                                >Last Visit{{ sortIndicator('last_visit') }}</th>
                                <th class="px-3 py-2.5 font-medium w-10"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr
                                v-for="(row, i) in sorted"
                                :key="row.customer_id"
                                class="hover:bg-muted/20 transition-colors"
                            >
                                <!-- Rank -->
                                <td class="px-3 py-2.5 text-center">
                                    <span
                                        v-if="i < 3"
                                        class="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                                        :class="[
                                            i === 0 && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
                                            i === 1 && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                                            i === 2 && 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
                                        ]"
                                    >{{ i + 1 }}</span>
                                    <span v-else class="text-xs text-muted-foreground">{{ i + 1 }}</span>
                                </td>

                                <!-- Customer info -->
                                <td class="px-3 py-2.5">
                                    <p class="font-medium leading-snug">{{ row.name }}</p>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span v-if="row.phone" class="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Phone class="h-3 w-3" />{{ row.phone }}
                                        </span>
                                        <span v-if="row.email" class="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Mail class="h-3 w-3" />{{ row.email }}
                                        </span>
                                    </div>
                                </td>

                                <!-- Visits -->
                                <td class="px-3 py-2.5 text-right tabular-nums">
                                    <span
                                        class="font-semibold"
                                        :class="row.transactions > 1 ? 'text-primary' : ''"
                                    >{{ row.transactions }}</span>
                                    <span v-if="row.transactions > 1" class="ml-1 text-xs text-muted-foreground">×</span>
                                </td>

                                <!-- Total spent -->
                                <td class="px-3 py-2.5 text-right tabular-nums font-semibold">
                                    {{ format(row.total_spent) }}
                                </td>

                                <!-- Avg basket -->
                                <td class="px-3 py-2.5 text-right tabular-nums text-muted-foreground">
                                    {{ format(row.avg_transaction) }}
                                </td>

                                <!-- Loyalty points -->
                                <td class="px-3 py-2.5 text-right tabular-nums">
                                    <span v-if="row.loyalty_points > 0" class="flex items-center justify-end gap-1 text-amber-600 dark:text-amber-400">
                                        <Star class="h-3 w-3" />
                                        {{ row.loyalty_points.toLocaleString() }}
                                    </span>
                                    <span v-else class="text-muted-foreground">—</span>
                                </td>

                                <!-- Last visit -->
                                <td class="px-3 py-2.5 text-right text-muted-foreground text-xs whitespace-nowrap">
                                    {{ row.last_visit ? formatDate(row.last_visit) : '—' }}
                                </td>

                                <!-- Link -->
                                <td class="px-3 py-2.5 text-right">
                                    <a
                                        :href="CustomerController.show.url({ customer: row.customer_id })"
                                        class="text-xs text-primary hover:underline"
                                    >View</a>
                                </td>
                            </tr>

                            <tr v-if="rows.length === 0">
                                <td colspan="8" class="px-3 py-12 text-center text-muted-foreground">
                                    No customer purchases found in this period.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
