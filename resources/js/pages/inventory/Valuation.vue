<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { Download, TrendingUp, Package, DollarSign, BarChart3 } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/composables/useCurrency';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';

interface Category {
    id: number;
    name: string;
}

interface ValuationRow {
    id:            number;
    name:          string;
    sku:           string;
    category:      string | null;
    stock_qty:     number;
    min_stock:     number;
    cost_price:    number;
    selling_price: number;
    cost_value:    number;
    retail_value:  number;
    gross_profit:  number;
    margin_pct:    number;
}

interface Summary {
    total_skus:         number;
    total_units:        number;
    total_cost_value:   number;
    total_retail_value: number;
    total_gross_profit: number;
    overall_margin:     number;
}

const props = defineProps<{
    products:   ValuationRow[];
    summary:    Summary;
    categories: Category[];
    filters:    { category_id?: string; stock_status?: string };
}>();

const { format } = useCurrency();

const categoryFilter  = ref(props.filters.category_id ?? 'all');
const stockStatus     = ref(props.filters.stock_status ?? 'all');

function applyFilters() {
    router.get(
        InventoryController.valuation.url(),
        {
            category_id:  categoryFilter.value === 'all' ? undefined : categoryFilter.value,
            stock_status: stockStatus.value === 'all' ? undefined : stockStatus.value,
        },
        { preserveState: true, replace: true },
    );
}

// ── Sort ──────────────────────────────────────────────────────────────────
type SortKey = 'name' | 'stock_qty' | 'cost_value' | 'retail_value' | 'gross_profit' | 'margin_pct';
const sortKey = ref<SortKey>('retail_value');
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
    return [...props.products].sort((a, b) => {
        const av = a[sortKey.value];
        const bv = b[sortKey.value];
        if (typeof av === 'string' && typeof bv === 'string') {
            return dir * av.localeCompare(bv);
        }
        return dir * ((av as number) - (bv as number));
    });
});

// ── CSV Export (client-side) ──────────────────────────────────────────────
function exportCsv() {
    const headers = [
        'Name', 'SKU', 'Category', 'Stock Qty', 'Min Stock',
        'Cost/Unit (₱)', 'Selling/Unit (₱)',
        'Cost Value (₱)', 'Retail Value (₱)', 'Gross Profit (₱)', 'Margin %',
    ];
    const rows = [headers, ...sorted.value.map(p => [
        p.name,
        p.sku,
        p.category ?? '',
        p.stock_qty,
        p.min_stock,
        (p.cost_price / 100).toFixed(2),
        (p.selling_price / 100).toFixed(2),
        (p.cost_value / 100).toFixed(2),
        (p.retail_value / 100).toFixed(2),
        (p.gross_profit / 100).toFixed(2),
        p.margin_pct.toFixed(1) + '%',
    ])].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `inventory-valuation-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function sortIndicator(key: SortKey) {
    if (sortKey.value !== key) return '';
    return sortDir.value === 'asc' ? ' ↑' : ' ↓';
}

function stockBadge(row: ValuationRow) {
    if (row.stock_qty === 0) return { label: 'Out', cls: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' };
    if (row.stock_qty <= row.min_stock) return { label: 'Low', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' };
    return null;
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Inventory', href: InventoryController.index.url() },
        { title: 'Valuation', href: InventoryController.valuation.url() },
    ]">
        <div class="p-6 space-y-6">

            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Inventory Valuation</h1>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        Current stock value at cost and retail — {{ products.length }} SKUs
                    </p>
                </div>
                <Button variant="outline" class="gap-2" @click="exportCsv">
                    <Download class="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Package class="h-3.5 w-3.5" />SKUs
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.total_skus }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Package class="h-3.5 w-3.5" />Total Units
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.total_units.toLocaleString() }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <DollarSign class="h-3.5 w-3.5" />Cost Value
                    </div>
                    <p class="text-xl font-bold tabular-nums">{{ format(summary.total_cost_value) }}</p>
                    <p class="text-xs text-muted-foreground">at purchase cost</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                    <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs">
                        <TrendingUp class="h-3.5 w-3.5" />Retail Value
                    </div>
                    <p class="text-xl font-bold tabular-nums text-blue-700 dark:text-blue-300">{{ format(summary.total_retail_value) }}</p>
                    <p class="text-xs text-blue-600 dark:text-blue-400">at selling price</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                    <div class="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-xs">
                        <TrendingUp class="h-3.5 w-3.5" />Gross Profit
                    </div>
                    <p class="text-xl font-bold tabular-nums text-green-700 dark:text-green-300">{{ format(summary.total_gross_profit) }}</p>
                    <p class="text-xs text-green-600 dark:text-green-400">if all stock sold</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <BarChart3 class="h-3.5 w-3.5" />Overall Margin
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.overall_margin }}%</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <Select v-model="categoryFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-48">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem v-for="c in categories" :key="c.id" :value="String(c.id)">
                            {{ c.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select v-model="stockStatus" @update:model-value="applyFilters">
                    <SelectTrigger class="w-40">
                        <SelectValue placeholder="All Stock" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Stock</SelectItem>
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                        <SelectItem value="out">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>

                <p class="text-sm text-muted-foreground ml-auto">
                    Showing {{ products.length }} products · click column headers to sort
                </p>
            </div>

            <!-- Table -->
            <div class="rounded-xl border overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th
                                    class="px-3 py-2.5 font-medium cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('name')"
                                >Product{{ sortIndicator('name') }}</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap">Stock</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap">Cost/Unit</th>
                                <th class="px-3 py-2.5 font-medium text-right whitespace-nowrap">Sell/Unit</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('cost_value')"
                                >Cost Value{{ sortIndicator('cost_value') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('retail_value')"
                                >Retail Value{{ sortIndicator('retail_value') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('gross_profit')"
                                >Gross Profit{{ sortIndicator('gross_profit') }}</th>
                                <th
                                    class="px-3 py-2.5 font-medium text-right cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap"
                                    @click="setSort('margin_pct')"
                                >Margin{{ sortIndicator('margin_pct') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr
                                v-for="row in sorted"
                                :key="row.id"
                                class="hover:bg-muted/20 transition-colors"
                                :class="row.stock_qty === 0 ? 'opacity-60' : ''"
                            >
                                <td class="px-3 py-2.5">
                                    <div class="flex items-center gap-2">
                                        <div class="min-w-0">
                                            <p class="font-medium leading-snug truncate max-w-56">{{ row.name }}</p>
                                            <p class="text-xs text-muted-foreground font-mono">{{ row.sku }}</p>
                                            <p v-if="row.category" class="text-xs text-muted-foreground">{{ row.category }}</p>
                                        </div>
                                        <span
                                            v-if="stockBadge(row)"
                                            class="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                            :class="stockBadge(row)!.cls"
                                        >{{ stockBadge(row)!.label }}</span>
                                    </div>
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums font-semibold">
                                    {{ row.stock_qty.toLocaleString() }}
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums text-muted-foreground text-xs">
                                    {{ format(row.cost_price) }}
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums text-muted-foreground text-xs">
                                    {{ format(row.selling_price) }}
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums">
                                    {{ format(row.cost_value) }}
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums font-semibold">
                                    {{ format(row.retail_value) }}
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums"
                                    :class="row.gross_profit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-600'">
                                    {{ format(row.gross_profit) }}
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums"
                                    :class="row.margin_pct >= 30 ? 'text-green-700 dark:text-green-400'
                                        : row.margin_pct >= 10 ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-red-600'">
                                    {{ row.margin_pct.toFixed(1) }}%
                                </td>
                            </tr>
                            <tr v-if="products.length === 0">
                                <td colspan="8" class="px-3 py-12 text-center text-muted-foreground">
                                    No products found.
                                </td>
                            </tr>
                        </tbody>

                        <!-- Totals footer -->
                        <tfoot v-if="products.length > 0">
                            <tr class="border-t-2 bg-muted/30 font-semibold">
                                <td class="px-3 py-2.5" colspan="4">
                                    Totals ({{ summary.total_skus }} SKUs · {{ summary.total_units.toLocaleString() }} units)
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums">{{ format(summary.total_cost_value) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums">{{ format(summary.total_retail_value) }}</td>
                                <td class="px-3 py-2.5 text-right tabular-nums text-green-700 dark:text-green-400">
                                    {{ format(summary.total_gross_profit) }}
                                </td>
                                <td class="px-3 py-2.5 text-right tabular-nums">{{ summary.overall_margin }}%</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
