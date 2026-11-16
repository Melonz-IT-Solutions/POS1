<script setup lang="ts">
import { computed, ref } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import { DollarSign, TrendingDown, TrendingUp } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import type { Category, Product } from '@/types/models';

type SlimProduct = Pick<Product, 'id' | 'name' | 'sku' | 'selling_price' | 'cost_price'> & {
    category_id: number | null;
};

const props = defineProps<{
    products:   SlimProduct[];
    categories: Pick<Category, 'id' | 'name'>[];
    filters:    { category_id?: string; search?: string };
}>();

// ── Filter state ──────────────────────────────────────────────────────────
const search     = ref(props.filters.search ?? '');
const categoryId = ref(props.filters.category_id ?? '');

let searchTimer: ReturnType<typeof setTimeout>;
function onSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 300);
}
function applyFilters() {
    router.get(ProductController.bulkPriceIndex.url(), {
        search:      search.value     || undefined,
        category_id: categoryId.value || undefined,
    }, { preserveState: true, replace: true });
}

// ── Selection ─────────────────────────────────────────────────────────────
const selectedIds = ref<Set<number>>(new Set(props.products.map(p => p.id)));

const allSelected = computed(() => props.products.every(p => selectedIds.value.has(p.id)));

function toggleAll() {
    if (allSelected.value) {
        selectedIds.value = new Set();
    } else {
        selectedIds.value = new Set(props.products.map(p => p.id));
    }
}

function toggleOne(id: number) {
    const s = new Set(selectedIds.value);
    s.has(id) ? s.delete(id) : s.add(id);
    selectedIds.value = s;
}

// ── Adjustment form ───────────────────────────────────────────────────────
const method   = ref<'percent_increase' | 'percent_decrease' | 'fixed_increase' | 'fixed_decrease' | 'set_price'>('percent_increase');
const value    = ref('');
const rounding = ref<'none' | 'peso' | 'five' | 'ten'>('none');
const reason   = ref('');

const methods = [
    { value: 'percent_increase', label: '% Increase',    hint: 'e.g. 10 → all prices +10%' },
    { value: 'percent_decrease', label: '% Decrease',    hint: 'e.g. 15 → all prices −15%' },
    { value: 'fixed_increase',   label: '+ Fixed Amount', hint: 'e.g. 5 → add ₱5.00 to each price' },
    { value: 'fixed_decrease',   label: '− Fixed Amount', hint: 'e.g. 10 → subtract ₱10.00 from each price' },
    { value: 'set_price',        label: 'Set Fixed Price', hint: 'e.g. 99.00 → set every selected product to ₱99.00' },
] as const;

const roundingOptions = [
    { value: 'none',  label: 'No rounding' },
    { value: 'peso',  label: 'Nearest ₱1' },
    { value: 'five',  label: 'Nearest ₱5' },
    { value: 'ten',   label: 'Nearest ₱10' },
];

// ── Live preview ──────────────────────────────────────────────────────────
function computeNew(oldCents: number): number | null {
    const v = parseFloat(value.value);
    if (isNaN(v) || v < 0) return null;

    let raw: number;
    switch (method.value) {
        case 'percent_increase': raw = Math.round(oldCents * (1 + v / 100)); break;
        case 'percent_decrease': raw = Math.round(oldCents * (1 - v / 100)); break;
        case 'fixed_increase':   raw = oldCents + Math.round(v * 100); break;
        case 'fixed_decrease':   raw = Math.max(1, oldCents - Math.round(v * 100)); break;
        case 'set_price':        raw = Math.round(v * 100); break;
    }

    switch (rounding.value) {
        case 'peso': raw = Math.round(raw / 100) * 100; break;
        case 'five': raw = Math.round(raw / 500) * 500; break;
        case 'ten':  raw = Math.round(raw / 1000) * 1000; break;
    }

    return Math.max(1, raw);
}

function delta(product: SlimProduct): number | null {
    const n = computeNew(product.selling_price);
    return n === null ? null : n - product.selling_price;
}

const hasPreview = computed(() => value.value !== '' && !isNaN(parseFloat(value.value)));

const affectedCount = computed(() =>
    props.products.filter(p => {
        if (!selectedIds.value.has(p.id)) return false;
        const n = computeNew(p.selling_price);
        return n !== null && n !== p.selling_price;
    }).length
);

// ── Submit ────────────────────────────────────────────────────────────────
const form = useForm({});

function submit() {
    if (selectedIds.value.size === 0) return;

    form.transform(() => ({
        ids:      [...selectedIds.value],
        method:   method.value,
        value:    value.value,
        rounding: rounding.value,
        reason:   reason.value || undefined,
    })).post(ProductController.bulkPriceUpdate.url());
}

// ── Helpers ───────────────────────────────────────────────────────────────
function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function deltaClass(d: number | null): string {
    if (d === null || d === 0) return 'text-muted-foreground';
    return d > 0 ? 'text-green-600' : 'text-red-600';
}

function deltaLabel(d: number | null): string {
    if (d === null) return '—';
    if (d === 0) return 'No change';
    return (d > 0 ? '+' : '') + peso(d);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Products', href: ProductController.index.url() },
        { title: 'Bulk Price Update', href: ProductController.bulkPriceIndex.url() },
    ]">
        <div class="max-w-6xl p-6 space-y-6">

            <!-- Header -->
            <div class="flex items-center gap-3">
                <div class="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <DollarSign class="h-5 w-5" />
                </div>
                <div>
                    <h1 class="text-2xl font-bold">Bulk Price Update</h1>
                    <p class="text-muted-foreground text-sm">Select products, set an adjustment rule, preview and apply.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <!-- Left: product selector -->
                <div class="lg:col-span-2 space-y-4">

                    <!-- Filters -->
                    <div class="flex flex-wrap gap-3">
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Search name or SKU…"
                            class="rounded-lg border bg-background px-3 py-2 text-sm flex-1 min-w-48 outline-none focus:ring-2 focus:ring-primary/30"
                            @input="onSearch"
                        />
                        <select
                            v-model="categoryId"
                            class="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            @change="applyFilters"
                        >
                            <option value="">All categories</option>
                            <option v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
                                {{ cat.name }}
                            </option>
                        </select>
                        <span class="self-center text-xs text-muted-foreground">
                            {{ selectedIds.size }} / {{ products.length }} selected
                        </span>
                    </div>

                    <!-- Table -->
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2.5 w-8">
                                        <input
                                            type="checkbox"
                                            :checked="allSelected"
                                            class="rounded"
                                            @change="toggleAll"
                                        />
                                    </th>
                                    <th class="px-3 py-2.5 font-medium">Product</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Current Price</th>
                                    <th v-if="hasPreview" class="px-3 py-2.5 font-medium text-right">New Price</th>
                                    <th v-if="hasPreview" class="px-3 py-2.5 font-medium text-right">Change</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-if="products.length === 0">
                                    <td colspan="5" class="px-4 py-10 text-center text-muted-foreground">No products found.</td>
                                </tr>
                                <tr
                                    v-for="p in products"
                                    :key="p.id"
                                    class="hover:bg-muted/20 cursor-pointer"
                                    :class="selectedIds.has(p.id) ? 'bg-primary/5' : ''"
                                    @click="toggleOne(p.id)"
                                >
                                    <td class="px-3 py-2.5" @click.stop>
                                        <input
                                            type="checkbox"
                                            :checked="selectedIds.has(p.id)"
                                            class="rounded"
                                            @change="toggleOne(p.id)"
                                        />
                                    </td>
                                    <td class="px-3 py-2.5">
                                        <p class="font-medium leading-tight">{{ p.name }}</p>
                                        <p class="text-muted-foreground font-mono text-xs">{{ p.sku }}</p>
                                    </td>
                                    <td class="px-3 py-2.5 text-right tabular-nums">{{ peso(p.selling_price) }}</td>
                                    <td v-if="hasPreview" class="px-3 py-2.5 text-right tabular-nums font-semibold">
                                        <template v-if="selectedIds.has(p.id) && computeNew(p.selling_price) !== null">
                                            {{ peso(computeNew(p.selling_price)!) }}
                                        </template>
                                        <span v-else class="text-muted-foreground">—</span>
                                    </td>
                                    <td v-if="hasPreview" class="px-3 py-2.5 text-right tabular-nums text-xs" :class="selectedIds.has(p.id) ? deltaClass(delta(p)) : 'text-muted-foreground'">
                                        <template v-if="selectedIds.has(p.id)">
                                            <span class="flex items-center justify-end gap-1">
                                                <TrendingUp v-if="(delta(p) ?? 0) > 0" class="h-3 w-3" />
                                                <TrendingDown v-else-if="(delta(p) ?? 0) < 0" class="h-3 w-3" />
                                                {{ deltaLabel(delta(p)) }}
                                            </span>
                                        </template>
                                        <span v-else>—</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Right: adjustment panel -->
                <div class="space-y-4">
                    <div class="rounded-xl border p-5 space-y-5 sticky top-6">
                        <h2 class="font-semibold">Adjustment Rule</h2>

                        <!-- Method -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Method</label>
                            <div class="space-y-1.5">
                                <label
                                    v-for="m in methods"
                                    :key="m.value"
                                    class="flex items-start gap-2.5 cursor-pointer rounded-lg border p-2.5 text-sm transition-colors"
                                    :class="method === m.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'"
                                >
                                    <input type="radio" v-model="method" :value="m.value" class="mt-0.5 shrink-0" />
                                    <div>
                                        <p class="font-medium">{{ m.label }}</p>
                                        <p class="text-muted-foreground text-xs">{{ m.hint }}</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Value -->
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium">
                                {{ method.includes('percent') ? 'Percentage (%)' : 'Amount (₱)' }}
                            </label>
                            <input
                                v-model="value"
                                type="number"
                                min="0"
                                step="0.01"
                                :placeholder="method.includes('percent') ? '0.00' : '0.00'"
                                class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <!-- Rounding -->
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium">Rounding</label>
                            <select
                                v-model="rounding"
                                class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            >
                                <option v-for="r in roundingOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
                            </select>
                        </div>

                        <!-- Reason -->
                        <div class="space-y-1.5">
                            <label class="text-sm font-medium">Reason <span class="text-muted-foreground font-normal">(optional)</span></label>
                            <input
                                v-model="reason"
                                type="text"
                                placeholder="e.g. Q4 price adjustment"
                                class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </div>

                        <!-- Summary -->
                        <div v-if="hasPreview" class="rounded-lg bg-muted/40 p-3 text-sm space-y-1">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Selected</span>
                                <span class="font-medium">{{ selectedIds.size }} products</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Will change</span>
                                <span class="font-medium">{{ affectedCount }} prices</span>
                            </div>
                        </div>

                        <Button
                            class="w-full"
                            :disabled="selectedIds.size === 0 || !hasPreview || form.processing || affectedCount === 0"
                            @click="submit"
                        >
                            {{ form.processing ? 'Applying…' : `Apply to ${affectedCount} product${affectedCount !== 1 ? 's' : ''}` }}
                        </Button>

                        <p class="text-center text-xs text-muted-foreground">
                            Changes are recorded in Price History and cannot be automatically undone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
