<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    AlertTriangle,
    CheckCircle2,
    ClipboardList,
    Filter,
    Layers,
    TrendingDown,
    TrendingUp,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';
import type { Category, Product } from '@/types/models';

interface ProductRow extends Pick<Product, 'id' | 'name' | 'sku' | 'stock_quantity' | 'minimum_stock'> {
    category?: Pick<Category, 'id' | 'name'> | null;
}

const props = defineProps<{
    products: ProductRow[];
}>();

// ── Counts state ─────────────────────────────────────────────────────────────
const counts = ref<Record<number, number>>(
    Object.fromEntries(props.products.map(p => [p.id, p.stock_quantity])),
);

// ── Filters ───────────────────────────────────────────────────────────────────
const search             = ref('');
const showDiscrepanciesOnly = ref(false);
const reason             = ref('');
const submitting         = ref(false);

// ── Computed ──────────────────────────────────────────────────────────────────
const rows = computed(() =>
    props.products.map(p => ({
        ...p,
        actual:   counts.value[p.id] ?? p.stock_quantity,
        variance: (counts.value[p.id] ?? p.stock_quantity) - p.stock_quantity,
    })),
);

const filteredRows = computed(() => {
    let list = rows.value;
    if (showDiscrepanciesOnly.value) {
        list = list.filter(r => r.variance !== 0);
    }
    if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter(r =>
            r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q),
        );
    }
    return list;
});

// Group by category for display
const groupedRows = computed(() => {
    const groups = new Map<string, typeof filteredRows.value>();
    for (const row of filteredRows.value) {
        const key = row.category?.name ?? 'Uncategorised';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(row);
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
});

const stats = computed(() => {
    const all = rows.value;
    const discrepancies = all.filter(r => r.variance !== 0);
    const netVariance   = discrepancies.reduce((s, r) => s + r.variance, 0);
    return {
        total:         all.length,
        discrepancies: discrepancies.length,
        netVariance,
    };
});

const canSubmit = computed(() =>
    stats.value.discrepancies > 0 && reason.value.trim().length >= 5,
);

// ── Submit ────────────────────────────────────────────────────────────────────
function submit() {
    const changed = rows.value
        .filter(r => r.variance !== 0)
        .map(r => ({ product_id: r.id, actual_count: r.actual }));

    submitting.value = true;
    router.post(
        InventoryController.applyPhysicalCount.url(),
        { reason: reason.value, counts: changed },
        { onFinish: () => { submitting.value = false; } },
    );
}

function resetAll() {
    for (const p of props.products) {
        counts.value[p.id] = p.stock_quantity;
    }
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Inventory', href: InventoryController.index.url() },
        { title: 'Physical Count', href: InventoryController.physicalCount.url() },
    ]">
        <div class="p-6 space-y-6 max-w-6xl">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold flex items-center gap-2">
                        <ClipboardList class="h-6 w-6 text-primary" />
                        Physical Inventory Count
                    </h1>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        Enter actual on-hand quantities. Only products with discrepancies will be adjusted.
                    </p>
                </div>
                <Button variant="outline" size="sm" @click="resetAll">Reset All</Button>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-3 gap-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Products Counted</p>
                    <p class="text-2xl font-bold">{{ stats.total }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1" :class="stats.discrepancies > 0 ? 'border-amber-300 bg-amber-50' : ''">
                    <p class="text-muted-foreground text-xs">Discrepancies</p>
                    <p class="text-2xl font-bold" :class="stats.discrepancies > 0 ? 'text-amber-700' : ''">
                        {{ stats.discrepancies }}
                    </p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Net Variance</p>
                    <p
                        class="text-2xl font-bold flex items-center gap-1"
                        :class="stats.netVariance > 0 ? 'text-green-600' : stats.netVariance < 0 ? 'text-destructive' : ''"
                    >
                        <TrendingUp v-if="stats.netVariance > 0" class="h-5 w-5" />
                        <TrendingDown v-else-if="stats.netVariance < 0" class="h-5 w-5" />
                        {{ stats.netVariance > 0 ? '+' : '' }}{{ stats.netVariance }}
                    </p>
                </div>
            </div>

            <!-- Filters row -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <Input v-model="search" placeholder="Filter by name or SKU…" class="h-9" />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    :class="showDiscrepanciesOnly ? 'border-amber-400 bg-amber-50 text-amber-700' : ''"
                    @click="showDiscrepanciesOnly = !showDiscrepanciesOnly"
                >
                    <Filter class="mr-1.5 h-3.5 w-3.5" />
                    {{ showDiscrepanciesOnly ? 'Discrepancies only' : 'All products' }}
                    <Badge v-if="stats.discrepancies > 0" class="ml-1.5 bg-amber-500 text-white text-xs">{{ stats.discrepancies }}</Badge>
                </Button>
            </div>

            <!-- Table by category group -->
            <div v-if="groupedRows.length" class="space-y-4">
                <div v-for="[category, categoryRows] in groupedRows" :key="category">
                    <div class="flex items-center gap-2 mb-2">
                        <Layers class="h-4 w-4 text-muted-foreground" />
                        <span class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{{ category }}</span>
                        <span class="text-xs text-muted-foreground">({{ categoryRows.length }})</span>
                    </div>
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-4 py-2.5 font-medium">Product</th>
                                    <th class="px-4 py-2.5 font-medium">SKU</th>
                                    <th class="px-4 py-2.5 font-medium text-right">System Stock</th>
                                    <th class="px-4 py-2.5 font-medium text-right w-36">Actual Count</th>
                                    <th class="px-4 py-2.5 font-medium text-right">Variance</th>
                                    <th class="px-4 py-2.5 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr
                                    v-for="row in categoryRows"
                                    :key="row.id"
                                    :class="row.variance !== 0 ? 'bg-amber-50/50' : 'hover:bg-muted/20'"
                                >
                                    <td class="px-4 py-2.5 font-medium">{{ row.name }}</td>
                                    <td class="px-4 py-2.5 font-mono text-xs text-muted-foreground">{{ row.sku }}</td>
                                    <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{{ row.stock_quantity }}</td>
                                    <td class="px-4 py-2.5 text-right">
                                        <Input
                                            v-model.number="counts[row.id]"
                                            type="number"
                                            min="0"
                                            class="h-8 w-24 text-right tabular-nums ml-auto"
                                            :class="row.variance !== 0 ? 'border-amber-400 focus-visible:ring-amber-400' : ''"
                                        />
                                    </td>
                                    <td class="px-4 py-2.5 text-right tabular-nums font-semibold">
                                        <span
                                            v-if="row.variance !== 0"
                                            :class="row.variance > 0 ? 'text-green-600' : 'text-destructive'"
                                        >{{ row.variance > 0 ? '+' : '' }}{{ row.variance }}</span>
                                        <span v-else class="text-muted-foreground">—</span>
                                    </td>
                                    <td class="px-4 py-2.5 text-center">
                                        <CheckCircle2 v-if="row.variance === 0" class="h-4 w-4 text-green-500 mx-auto" />
                                        <AlertTriangle v-else class="h-4 w-4 text-amber-500 mx-auto" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div v-else class="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                <ClipboardList class="mx-auto h-8 w-8 mb-2 opacity-30" />
                <p class="text-sm">No products match the current filter.</p>
            </div>

            <!-- Submit panel -->
            <div class="rounded-xl border bg-muted/30 p-5 space-y-4">
                <h2 class="font-semibold text-sm">Apply Adjustments</h2>
                <div class="flex flex-wrap items-end gap-4">
                    <div class="flex-1 min-w-[280px] space-y-1.5">
                        <label class="text-sm font-medium">Reason <span class="text-destructive">*</span></label>
                        <Input
                            v-model="reason"
                            placeholder="e.g. Monthly physical inventory count"
                            class="max-w-md"
                        />
                        <p class="text-muted-foreground text-xs">Required — recorded on every stock movement.</p>
                    </div>
                    <Button
                        :disabled="!canSubmit || submitting"
                        class="shrink-0"
                        @click="submit"
                    >
                        <ClipboardList class="mr-2 h-4 w-4" />
                        {{ submitting ? 'Applying…' : `Apply ${stats.discrepancies} Adjustment${stats.discrepancies === 1 ? '' : 's'}` }}
                    </Button>
                </div>
                <p v-if="stats.discrepancies === 0" class="text-green-600 text-sm flex items-center gap-1.5">
                    <CheckCircle2 class="h-4 w-4" />
                    All counts match system stock — no adjustments needed.
                </p>
            </div>
        </div>
    </AppLayout>
</template>
