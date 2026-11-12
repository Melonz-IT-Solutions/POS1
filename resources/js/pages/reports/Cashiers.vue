<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';

interface CashierRow {
    cashier_id: number;
    cashier_name: string;
    transactions: number;
    revenue: number;
    discounts: number;
    avg_sale: number;
}

const props = defineProps<{
    rows: CashierRow[];
    filters: { preset?: string; date_from?: string; date_to?: string };
    dateFrom: string;
    dateTo: string;
}>();

const preset   = ref(props.filters.preset ?? 'today');
const dateFrom = ref(props.filters.date_from ?? props.dateFrom);
const dateTo   = ref(props.filters.date_to ?? props.dateTo);

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
    router.get(ReportController.cashiers.url(), {
        preset:    preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true, replace: true });
}

watch(preset, (val) => { if (val !== 'custom') applyFilters(); });

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const df = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function formatDate(s: string): string { return df.format(new Date(s + 'T00:00:00')); }

const totals = computed(() => ({
    transactions: props.rows.reduce((s, r) => s + r.transactions, 0),
    revenue:      props.rows.reduce((s, r) => s + r.revenue, 0),
    discounts:    props.rows.reduce((s, r) => s + r.discounts, 0),
}));

const maxRevenue = computed(() => Math.max(...props.rows.map(r => r.revenue), 1));

function initials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports', href: ReportController.sales.url() },
        { title: 'Cashier Report', href: ReportController.cashiers.url() },
    ]">
        <div class="p-6 space-y-6">
            <!-- Header + Filter -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Cashier Performance</h1>
                    <p class="text-muted-foreground text-sm">{{ formatDate(dateFrom) }} — {{ formatDate(dateTo) }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <Select v-model="preset">
                        <SelectTrigger class="w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="p in presets" :key="p.value" :value="p.value">{{ p.label }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <template v-if="preset === 'custom'">
                        <Input v-model="dateFrom" type="date" class="w-38" />
                        <span class="text-muted-foreground text-sm">to</span>
                        <Input v-model="dateTo" type="date" class="w-38" />
                        <Button size="sm" @click="applyFilters">Apply</Button>
                    </template>
                </div>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-3 gap-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Cashiers Active</p>
                    <p class="text-2xl font-bold tabular-nums">{{ rows.length }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Total Transactions</p>
                    <p class="text-2xl font-bold tabular-nums">{{ totals.transactions.toLocaleString() }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Total Revenue</p>
                    <p class="text-2xl font-bold tabular-nums">{{ peso(totals.revenue) }}</p>
                </div>
            </div>

            <!-- Cashier table -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold text-sm">Performance by Cashier</h2>
                </div>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2 font-medium">#</th>
                            <th class="px-4 py-2 font-medium">Cashier</th>
                            <th class="px-4 py-2 font-medium text-right">Transactions</th>
                            <th class="px-4 py-2 font-medium text-right">Revenue</th>
                            <th class="px-4 py-2 font-medium text-right">Avg Sale</th>
                            <th class="px-4 py-2 font-medium text-right">Discounts Given</th>
                            <th class="px-4 py-2 font-medium w-28">Share</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="(row, idx) in rows" :key="row.cashier_id" class="hover:bg-muted/30">
                            <td class="px-4 py-2.5 text-muted-foreground tabular-nums">{{ idx + 1 }}</td>
                            <td class="px-4 py-2.5">
                                <div class="flex items-center gap-2.5">
                                    <div class="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                                        {{ initials(row.cashier_name) }}
                                    </div>
                                    <span class="font-medium">{{ row.cashier_name }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-2.5 text-right tabular-nums">{{ row.transactions.toLocaleString() }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-medium">{{ peso(row.revenue) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{{ peso(row.avg_sale) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{{ peso(row.discounts) }}</td>
                            <td class="px-4 py-2.5">
                                <div class="space-y-0.5">
                                    <div class="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            class="h-full bg-primary/70 rounded-full"
                                            :style="{ width: `${(row.revenue / maxRevenue * 100).toFixed(1)}%` }"
                                        />
                                    </div>
                                    <p class="text-muted-foreground text-xs text-right">
                                        {{ (row.revenue / (totals.revenue || 1) * 100).toFixed(0) }}%
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!rows.length">
                            <td colspan="7" class="text-muted-foreground px-4 py-12 text-center">
                                No sales data in this period.
                            </td>
                        </tr>
                    </tbody>
                    <tfoot v-if="rows.length">
                        <tr class="border-t bg-muted/20 font-semibold">
                            <td colspan="2" class="px-4 py-2">Total</td>
                            <td class="px-4 py-2 text-right tabular-nums">{{ totals.transactions.toLocaleString() }}</td>
                            <td class="px-4 py-2 text-right tabular-nums">{{ peso(totals.revenue) }}</td>
                            <td class="px-4 py-2 text-right tabular-nums">
                                {{ peso(totals.transactions > 0 ? Math.round(totals.revenue / totals.transactions) : 0) }}
                            </td>
                            <td class="px-4 py-2 text-right tabular-nums">{{ peso(totals.discounts) }}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </AppLayout>
</template>
