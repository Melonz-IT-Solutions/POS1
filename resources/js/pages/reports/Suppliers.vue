<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    Building2, CheckCircle2, Download, Mail, Package, Phone, TrendingUp,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/composables/useCurrency';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';
import * as SupplierController from '@/actions/App/Http/Controllers/Admin/SupplierController';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';

interface SupplierRow {
    supplier_id:      number;
    company_name:     string;
    phone:            string | null;
    email:            string | null;
    total_orders:     number;
    completed_orders: number;
    total_ordered:    number;
    total_received:   number;
    last_order_at:    string | null;
}

interface Summary {
    total_suppliers: number;
    total_orders:    number;
    total_ordered:   number;
    total_received:  number;
}

const props = defineProps<{
    rows:     SupplierRow[];
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
    router.get(ReportController.suppliers.url(), {
        preset:    preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true, replace: true });
}

watch(preset, (val) => { if (val !== 'custom') applyFilters(); });

// ── Sort ──────────────────────────────────────────────────────────────────
type SortKey = 'company_name' | 'total_orders' | 'total_ordered' | 'total_received' | 'last_order_at';
const sortKey = ref<SortKey>('total_ordered');
const sortDir = ref<'asc' | 'desc'>('desc');

function setSort(key: SortKey) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortDir.value = key === 'company_name' ? 'asc' : 'desc';
    }
}

const sorted = computed(() => {
    const dir = sortDir.value === 'asc' ? 1 : -1;
    return [...props.rows].sort((a, b) => {
        const av = a[sortKey.value] ?? '';
        const bv = b[sortKey.value] ?? '';
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

function fulfillmentPct(row: SupplierRow): number {
    if (!row.total_ordered) return 0;
    return Math.round(row.total_received / row.total_ordered * 100);
}

function fulfillmentColor(pct: number): string {
    if (pct >= 90) return 'text-green-700 dark:text-green-400';
    if (pct >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
}

// ── CSV Export ────────────────────────────────────────────────────────────
function exportCsv() {
    const headers = [
        'Supplier', 'Phone', 'Email',
        'Total Orders', 'Completed Orders',
        'Total Ordered (₱)', 'Total Received (₱)', 'Fulfillment %',
        'Last Order',
    ];
    const csvRows = [headers, ...sorted.value.map(r => [
        r.company_name,
        r.phone ?? '',
        r.email ?? '',
        r.total_orders,
        r.completed_orders,
        (r.total_ordered / 100).toFixed(2),
        (r.total_received / 100).toFixed(2),
        fulfillmentPct(r) + '%',
        r.last_order_at ? formatDate(r.last_order_at) : '',
    ])].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `supplier-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports' },
        { title: 'Suppliers', href: ReportController.suppliers.url() },
    ]">
        <div class="p-6 space-y-6">

            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Supplier Spending Report</h1>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        Purchase order activity by supplier (excludes cancelled POs)
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
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Building2 class="h-3.5 w-3.5" />Suppliers
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.total_suppliers }}</p>
                    <p class="text-xs text-muted-foreground">with orders this period</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Package class="h-3.5 w-3.5" />Purchase Orders
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.total_orders }}</p>
                    <p class="text-xs text-muted-foreground">non-cancelled</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                    <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs">
                        <TrendingUp class="h-3.5 w-3.5" />Total Ordered
                    </div>
                    <p class="text-xl font-bold tabular-nums text-blue-700 dark:text-blue-300">{{ format(summary.total_ordered) }}</p>
                    <p class="text-xs text-blue-600 dark:text-blue-400">procurement spend</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                    <div class="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs">
                        <CheckCircle2 class="h-3.5 w-3.5" />Total Received
                    </div>
                    <p class="text-xl font-bold tabular-nums text-green-700 dark:text-green-300">{{ format(summary.total_received) }}</p>
                    <p class="text-xs text-green-600 dark:text-green-400">goods received</p>
                </div>
            </div>

            <!-- Supplier table -->
            <div class="rounded-xl border overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-3 py-2.5 font-medium w-8 text-center">#</th>
                                <th
                                    class="px-3 py-2.5 font-medium cursor-pointer hover:bg-muted/50 select-none"
                                    @click="setSort('company_name')"
                                >Supplier{{ sortIndicator('company_name') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('total_orders')"
                                >Orders{{ sortIndicator('total_orders') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('total_ordered')"
                                >Total Ordered{{ sortIndicator('total_ordered') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('total_received')"
                                >Received{{ sortIndicator('total_received') }}</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap">Fulfillment</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('last_order_at')"
                                >Last Order{{ sortIndicator('last_order_at') }}</th>
                                <th class="px-3 py-2.5 font-medium w-16"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr
                                v-for="(row, i) in sorted"
                                :key="row.supplier_id"
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

                                <!-- Supplier info -->
                                <td class="px-3 py-2.5">
                                    <p class="font-medium leading-snug">{{ row.company_name }}</p>
                                    <div class="flex items-center gap-3 mt-0.5">
                                        <span v-if="row.phone" class="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Phone class="h-3 w-3" />{{ row.phone }}
                                        </span>
                                        <span v-if="row.email" class="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Mail class="h-3 w-3" />{{ row.email }}
                                        </span>
                                    </div>
                                </td>

                                <!-- Orders -->
                                <td class="px-3 py-2.5 text-right tabular-nums">
                                    <span class="font-semibold">{{ row.total_orders }}</span>
                                    <span class="text-xs text-muted-foreground ml-1">
                                        ({{ row.completed_orders }} done)
                                    </span>
                                </td>

                                <!-- Total ordered -->
                                <td class="px-3 py-2.5 text-right tabular-nums font-semibold">
                                    {{ format(row.total_ordered) }}
                                </td>

                                <!-- Received -->
                                <td class="px-3 py-2.5 text-right tabular-nums text-green-700 dark:text-green-400">
                                    {{ format(row.total_received) }}
                                </td>

                                <!-- Fulfillment % with mini bar -->
                                <td class="px-3 py-2.5 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <div class="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                            <div
                                                class="h-full rounded-full transition-all"
                                                :class="fulfillmentPct(row) >= 90 ? 'bg-green-500' : fulfillmentPct(row) >= 60 ? 'bg-amber-500' : 'bg-red-500'"
                                                :style="{ width: fulfillmentPct(row) + '%' }"
                                            />
                                        </div>
                                        <span
                                            class="tabular-nums text-xs font-semibold w-9 text-right"
                                            :class="fulfillmentColor(fulfillmentPct(row))"
                                        >{{ fulfillmentPct(row) }}%</span>
                                    </div>
                                </td>

                                <!-- Last order -->
                                <td class="px-3 py-2.5 text-right text-muted-foreground text-xs whitespace-nowrap">
                                    {{ row.last_order_at ? formatDate(row.last_order_at) : '—' }}
                                </td>

                                <!-- Actions -->
                                <td class="px-3 py-2.5 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <a
                                            :href="SupplierController.show.url({ supplier: row.supplier_id })"
                                            class="text-xs text-primary hover:underline"
                                        >Profile</a>
                                        <a
                                            :href="PurchaseOrderController.index.url()"
                                            class="text-xs text-muted-foreground hover:underline"
                                        >POs</a>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="rows.length === 0">
                                <td colspan="8" class="px-3 py-12 text-center text-muted-foreground">
                                    No purchase orders found in this period.
                                </td>
                            </tr>
                        </tbody>

                        <!-- Totals footer -->
                        <tfoot v-if="rows.length > 1">
                            <tr class="border-t-2 bg-muted/30 font-semibold">
                                <td class="px-3 py-2.5" colspan="3">
                                    Totals ({{ summary.total_suppliers }} suppliers · {{ summary.total_orders }} orders)
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums">{{ format(summary.total_ordered) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums text-green-700 dark:text-green-400">{{ format(summary.total_received) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums">
                                    <span :class="fulfillmentColor(summary.total_ordered > 0 ? Math.round(summary.total_received / summary.total_ordered * 100) : 0)">
                                        {{ summary.total_ordered > 0 ? Math.round(summary.total_received / summary.total_ordered * 100) : 0 }}%
                                    </span>
                                </td>
                                <td colspan="2" />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
