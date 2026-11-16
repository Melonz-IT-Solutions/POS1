<script setup lang="ts">
import {
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Box,
    Building2,
    DollarSign,
    Pencil,
    Tag,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/composables/useCurrency';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import * as PriceHistoryController from '@/actions/App/Http/Controllers/Admin/PriceHistoryController';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';
import type { Product, Supplier, StockMovement, User } from '@/types/models';

interface PriceHistoryRow {
    id: number;
    old_cost_price: number;
    new_cost_price: number;
    old_selling_price: number;
    new_selling_price: number;
    reason: string | null;
    created_at: string;
    changedBy?: Pick<User, 'id' | 'name'>;
}

const props = defineProps<{
    product: Product & { suppliers?: Pick<Supplier, 'id' | 'company_name' | 'contact_person' | 'phone'>[] };
    recentMovements: (StockMovement & { user?: Pick<User, 'id' | 'name'> })[];
    recentPriceHistory: PriceHistoryRow[];
    canViewCost: boolean;
    canEdit: boolean;
}>();

const { format } = useCurrency();

const vatLabel: Record<string, string> = {
    vatable:    'VATable (12%)',
    vat_exempt: 'VAT Exempt',
    zero_rated:  'Zero Rated',
};

const movementLabel: Record<string, { label: string; cls: string }> = {
    sale:              { label: 'Sale',             cls: 'bg-blue-100 text-blue-700' },
    refund:            { label: 'Refund',           cls: 'bg-green-100 text-green-700' },
    void:              { label: 'Void',             cls: 'bg-gray-100 text-gray-700' },
    purchase_receipt:  { label: 'Purchase',         cls: 'bg-purple-100 text-purple-700' },
    manual_adjustment: { label: 'Adjustment',       cls: 'bg-amber-100 text-amber-700' },
    damage_loss:       { label: 'Damage/Loss',      cls: 'bg-red-100 text-red-700' },
    initial_stock:     { label: 'Initial Stock',    cls: 'bg-teal-100 text-teal-700' },
};

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function fmt(s: string) { return dtf.format(new Date(s)); }
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Products', href: ProductController.index.url() },
        { title: product.name, href: ProductController.show.url({ product: product.id }) },
    ]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex items-start gap-4">
                    <!-- Product Image -->
                    <div class="shrink-0">
                        <div v-if="product.image_path" class="h-20 w-20 rounded-xl overflow-hidden border">
                            <img :src="`/storage/${product.image_path}`" :alt="product.name" class="h-full w-full object-cover" />
                        </div>
                        <div v-else class="bg-muted h-20 w-20 rounded-xl flex items-center justify-center text-muted-foreground border">
                            <Box class="h-8 w-8" />
                        </div>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
                        <div class="flex flex-wrap items-center gap-2 mt-1">
                            <span class="font-mono text-sm text-muted-foreground">{{ product.sku }}</span>
                            <span v-if="product.barcode" class="font-mono text-sm text-muted-foreground">· {{ product.barcode }}</span>
                            <Badge variant="outline" class="text-xs">{{ vatLabel[product.vat_type as string] ?? product.vat_type }}</Badge>
                            <Badge v-if="product.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                            <Badge v-else-if="!product.is_active" variant="outline" class="text-xs text-muted-foreground">Inactive</Badge>
                            <Badge v-else class="text-xs bg-green-100 text-green-800 border-0">Active</Badge>
                        </div>
                        <p v-if="product.description" class="text-muted-foreground text-sm mt-1 max-w-xl">{{ product.description }}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2" v-if="canEdit && !product.deleted_at">
                    <Button as-child>
                        <a :href="ProductController.edit.url({ product: product.id })">
                            <Pencil class="mr-2 h-4 w-4" />
                            Edit Product
                        </a>
                    </Button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm flex items-center gap-1.5">
                        <DollarSign class="h-3.5 w-3.5" />Selling Price
                    </p>
                    <p class="text-2xl font-bold">{{ format(product.selling_price) }}</p>
                </div>
                <div v-if="canViewCost" class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm flex items-center gap-1.5">
                        <DollarSign class="h-3.5 w-3.5" />Cost Price
                    </p>
                    <p class="text-2xl font-bold">{{ format(product.cost_price) }}</p>
                    <p class="text-xs text-green-600 font-medium">
                        Margin: {{ product.selling_price > 0
                            ? (((product.selling_price - product.cost_price) / product.selling_price) * 100).toFixed(1) + '%'
                            : '—' }}
                    </p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm flex items-center gap-1.5">
                        <Box class="h-3.5 w-3.5" />Stock
                    </p>
                    <p class="text-2xl font-bold" :class="product.stock_quantity <= product.minimum_stock && product.minimum_stock > 0 ? 'text-orange-600' : ''">
                        {{ product.stock_quantity.toLocaleString() }}
                        <span class="text-sm font-normal text-muted-foreground">{{ product.unit_of_measure }}</span>
                    </p>
                    <div v-if="product.stock_quantity <= product.minimum_stock && product.minimum_stock > 0" class="flex items-center gap-1 text-xs text-orange-600">
                        <AlertTriangle class="h-3 w-3" />Low stock (min: {{ product.minimum_stock }})
                    </div>
                    <p v-else class="text-xs text-muted-foreground">Min: {{ product.minimum_stock }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm flex items-center gap-1.5">
                        <Tag class="h-3.5 w-3.5" />Category
                    </p>
                    <p class="text-lg font-semibold">{{ product.category?.name ?? '—' }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recent Stock Movements -->
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Box class="h-5 w-5 text-muted-foreground" />
                            <h2 class="font-semibold text-lg">Recent Stock Movements</h2>
                        </div>
                        <Button variant="ghost" size="sm" as-child>
                            <a :href="InventoryController.movements.url({ product: product.id })" class="flex items-center gap-1 text-xs">
                                View all <ArrowRight class="h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2.5 font-medium">Date</th>
                                    <th class="px-3 py-2.5 font-medium">Type</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Qty</th>
                                    <th class="px-3 py-2.5 font-medium text-right">After</th>
                                    <th class="px-3 py-2.5 font-medium">By</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="mv in recentMovements" :key="mv.id" class="hover:bg-muted/20">
                                    <td class="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{{ fmt(mv.created_at) }}</td>
                                    <td class="px-3 py-2">
                                        <span class="inline-block text-xs font-medium rounded-full px-2 py-0.5"
                                            :class="movementLabel[mv.type]?.cls ?? 'bg-muted text-muted-foreground'"
                                        >{{ movementLabel[mv.type]?.label ?? mv.type }}</span>
                                    </td>
                                    <td class="px-3 py-2 text-right tabular-nums font-medium"
                                        :class="mv.quantity >= 0 ? 'text-green-600' : 'text-red-600'"
                                    >{{ mv.quantity >= 0 ? '+' : '' }}{{ mv.quantity }}</td>
                                    <td class="px-3 py-2 text-right tabular-nums text-muted-foreground">{{ mv.quantity_after }}</td>
                                    <td class="px-3 py-2 text-xs text-muted-foreground">{{ mv.user?.name ?? '—' }}</td>
                                </tr>
                                <tr v-if="!recentMovements.length">
                                    <td colspan="5" class="text-muted-foreground px-3 py-8 text-center text-sm">No stock movements yet.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Recent Price History -->
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <BarChart3 class="h-5 w-5 text-muted-foreground" />
                            <h2 class="font-semibold text-lg">Price History</h2>
                        </div>
                        <Button variant="ghost" size="sm" as-child>
                            <a :href="PriceHistoryController.index.url({ query: { product_id: product.id } })" class="flex items-center gap-1 text-xs">
                                View all <ArrowRight class="h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2.5 font-medium">Date</th>
                                    <th v-if="canViewCost" class="px-3 py-2.5 font-medium text-right">Old Cost</th>
                                    <th v-if="canViewCost" class="px-3 py-2.5 font-medium text-right">New Cost</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Old Price</th>
                                    <th class="px-3 py-2.5 font-medium text-right">New Price</th>
                                    <th class="px-3 py-2.5 font-medium">By</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="ph in recentPriceHistory" :key="ph.id" class="hover:bg-muted/20">
                                    <td class="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{{ fmt(ph.created_at) }}</td>
                                    <td v-if="canViewCost" class="px-3 py-2 text-right tabular-nums text-muted-foreground text-xs">{{ format(ph.old_cost_price) }}</td>
                                    <td v-if="canViewCost" class="px-3 py-2 text-right tabular-nums text-xs font-medium"
                                        :class="ph.new_cost_price > ph.old_cost_price ? 'text-red-600' : ph.new_cost_price < ph.old_cost_price ? 'text-green-600' : ''"
                                    >{{ format(ph.new_cost_price) }}</td>
                                    <td class="px-3 py-2 text-right tabular-nums text-muted-foreground text-xs">{{ format(ph.old_selling_price) }}</td>
                                    <td class="px-3 py-2 text-right tabular-nums text-xs font-medium"
                                        :class="ph.new_selling_price > ph.old_selling_price ? 'text-red-600' : ph.new_selling_price < ph.old_selling_price ? 'text-green-600' : ''"
                                    >{{ format(ph.new_selling_price) }}</td>
                                    <td class="px-3 py-2 text-xs text-muted-foreground">{{ ph.changedBy?.name ?? '—' }}</td>
                                </tr>
                                <tr v-if="!recentPriceHistory.length">
                                    <td :colspan="canViewCost ? 6 : 4" class="text-muted-foreground px-3 py-8 text-center text-sm">No price changes recorded.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Suppliers -->
            <div v-if="product.suppliers && product.suppliers.length > 0" class="space-y-3">
                <div class="flex items-center gap-2">
                    <Building2 class="h-5 w-5 text-muted-foreground" />
                    <h2 class="font-semibold text-lg">Linked Suppliers</h2>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="sup in product.suppliers" :key="sup.id" class="rounded-xl border p-4 space-y-1">
                        <p class="font-semibold">{{ sup.company_name }}</p>
                        <p v-if="sup.contact_person" class="text-sm text-muted-foreground">{{ sup.contact_person }}</p>
                        <p v-if="sup.phone" class="text-sm text-muted-foreground font-mono">{{ sup.phone }}</p>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
