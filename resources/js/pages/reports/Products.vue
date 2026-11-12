<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';

interface ProductRow {
    product_name: string;
    product_sku: string;
    qty_sold: number;
    revenue: number;
    cost?: number;
    profit?: number;
    margin?: number;
}

const props = defineProps<{
    rows: ProductRow[];
    canViewProfit: boolean;
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
    router.get(ReportController.products.url(), {
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

const maxRevenue = computed(() => Math.max(...props.rows.map(r => r.revenue), 1));

const totals = computed(() => ({
    qty_sold: props.rows.reduce((s, r) => s + r.qty_sold, 0),
    revenue:  props.rows.reduce((s, r) => s + r.revenue, 0),
    cost:     props.rows.reduce((s, r) => s + (r.cost ?? 0), 0),
    profit:   props.rows.reduce((s, r) => s + (r.profit ?? 0), 0),
}));

function marginColor(margin: number): string {
    if (margin >= 30) return 'bg-green-100 text-green-800';
    if (margin >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports', href: ReportController.sales.url() },
        { title: 'Products Report', href: ReportController.products.url() },
    ]">
        <div class="p-6 space-y-6">
            <!-- Header + Filter -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Products Report</h1>
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
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Products Sold</p>
                    <p class="text-2xl font-bold tabular-nums">{{ rows.length }}</p>
                    <p class="text-muted-foreground text-xs">unique items</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Units Sold</p>
                    <p class="text-2xl font-bold tabular-nums">{{ totals.qty_sold.toLocaleString() }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Total Revenue</p>
                    <p class="text-2xl font-bold tabular-nums">{{ peso(totals.revenue) }}</p>
                </div>
                <div v-if="canViewProfit" class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Gross Profit</p>
                    <p class="text-2xl font-bold tabular-nums" :class="totals.profit >= 0 ? 'text-green-700' : 'text-red-700'">
                        {{ peso(totals.profit) }}
                    </p>
                    <p class="text-muted-foreground text-xs">
                        {{ totals.revenue > 0 ? (totals.profit / totals.revenue * 100).toFixed(1) : 0 }}% margin
                    </p>
                </div>
                <div v-else class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Total Cost</p>
                    <p class="text-muted-foreground text-sm italic py-2">Hidden</p>
                </div>
            </div>

            <!-- Products table -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold text-sm">Top Products by Revenue</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-4 py-2 font-medium">#</th>
                                <th class="px-4 py-2 font-medium">Product</th>
                                <th class="px-4 py-2 font-medium text-right">Units Sold</th>
                                <th class="px-4 py-2 font-medium text-right">Revenue</th>
                                <template v-if="canViewProfit">
                                    <th class="px-4 py-2 font-medium text-right">Cost</th>
                                    <th class="px-4 py-2 font-medium text-right">Profit</th>
                                    <th class="px-4 py-2 font-medium text-right">Margin</th>
                                </template>
                                <th class="px-4 py-2 font-medium w-24">Share</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="(row, idx) in rows" :key="row.product_sku" class="hover:bg-muted/30">
                                <td class="px-4 py-2.5 text-muted-foreground tabular-nums">{{ idx + 1 }}</td>
                                <td class="px-4 py-2.5">
                                    <p class="font-medium">{{ row.product_name }}</p>
                                    <p class="text-muted-foreground font-mono text-xs">{{ row.product_sku }}</p>
                                </td>
                                <td class="px-4 py-2.5 text-right tabular-nums">{{ row.qty_sold.toLocaleString() }}</td>
                                <td class="px-4 py-2.5 text-right tabular-nums font-medium">{{ peso(row.revenue) }}</td>
                                <template v-if="canViewProfit">
                                    <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{{ peso(row.cost ?? 0) }}</td>
                                    <td class="px-4 py-2.5 text-right tabular-nums" :class="(row.profit ?? 0) >= 0 ? 'text-green-700' : 'text-red-700'">
                                        {{ peso(row.profit ?? 0) }}
                                    </td>
                                    <td class="px-4 py-2.5 text-right">
                                        <Badge variant="secondary" :class="marginColor(row.margin ?? 0)" class="text-xs">
                                            {{ row.margin?.toFixed(1) ?? 0 }}%
                                        </Badge>
                                    </td>
                                </template>
                                <td class="px-4 py-2.5">
                                    <div class="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            class="h-full bg-primary/70 rounded-full"
                                            :style="{ width: `${(row.revenue / maxRevenue * 100).toFixed(1)}%` }"
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!rows.length">
                                <td :colspan="canViewProfit ? 8 : 5" class="text-muted-foreground px-4 py-12 text-center">
                                    No sales in this period.
                                </td>
                            </tr>
                        </tbody>
                        <tfoot v-if="rows.length">
                            <tr class="border-t bg-muted/20 font-semibold">
                                <td colspan="2" class="px-4 py-2">Total</td>
                                <td class="px-4 py-2 text-right tabular-nums">{{ totals.qty_sold.toLocaleString() }}</td>
                                <td class="px-4 py-2 text-right tabular-nums">{{ peso(totals.revenue) }}</td>
                                <template v-if="canViewProfit">
                                    <td class="px-4 py-2 text-right tabular-nums">{{ peso(totals.cost) }}</td>
                                    <td class="px-4 py-2 text-right tabular-nums" :class="totals.profit >= 0 ? 'text-green-700' : 'text-red-700'">
                                        {{ peso(totals.profit) }}
                                    </td>
                                    <td></td>
                                </template>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
