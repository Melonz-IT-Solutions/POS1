<script setup lang="ts">
import { computed } from 'vue';
import {
    AlertTriangle,
    Building2,
    CheckCircle,
    ClipboardList,
    Mail,
    PackageOpen,
    Phone,
    Plus,
    ShoppingBag,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/composables/useCurrency';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import type { Product, Supplier } from '@/types/models';

type SupplierPick = Pick<Supplier, 'id' | 'company_name' | 'phone' | 'email'>;
type ProductWithSuppliers = Product & { suppliers?: SupplierPick[] };

interface Stats {
    low_stock: number;
    out_of_stock: number;
    suppliers: number;
}

const props = defineProps<{
    products: ProductWithSuppliers[];
    canCreatePO: boolean;
    stats: Stats;
}>();

const { format } = useCurrency();

interface SupplierGroup {
    supplier: SupplierPick | null;
    products: ProductWithSuppliers[];
}

const grouped = computed((): SupplierGroup[] => {
    const map = new Map<number | null, SupplierGroup>();

    for (const product of props.products) {
        const supplier = product.suppliers?.[0] ?? null;
        const key = supplier?.id ?? null;

        if (!map.has(key)) {
            map.set(key, { supplier, products: [] });
        }
        map.get(key)!.products.push(product);
    }

    return [...map.values()].sort((a, b) => {
        if (!a.supplier) return 1;
        if (!b.supplier) return -1;
        return a.supplier.company_name.localeCompare(b.supplier.company_name);
    });
});

function deficit(product: ProductWithSuppliers): number {
    return Math.max(0, product.minimum_stock - product.stock_quantity);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Inventory', href: InventoryController.index.url() },
        { title: 'Reorder Dashboard', href: InventoryController.reorder.url() },
    ]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Reorder Dashboard</h1>
                    <p class="text-muted-foreground text-sm">Products that need restocking, grouped by supplier</p>
                </div>
                <Button variant="outline" as-child>
                    <a :href="InventoryController.index.url()">
                        Back to Inventory
                    </a>
                </Button>
            </div>

            <!-- All good state -->
            <div v-if="!products.length" class="rounded-xl border border-green-200 bg-green-50 p-10 flex flex-col items-center gap-3 text-center">
                <CheckCircle class="h-12 w-12 text-green-500" />
                <h2 class="text-lg font-semibold text-green-800">All stock levels are healthy</h2>
                <p class="text-green-600 text-sm">No products are currently below their minimum stock threshold.</p>
            </div>

            <template v-else>
                <!-- Stats -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="rounded-xl border p-4 space-y-1">
                        <div class="flex items-center gap-1.5 text-orange-600 text-sm">
                            <AlertTriangle class="h-4 w-4" />Low Stock
                        </div>
                        <p class="text-2xl font-bold text-orange-600">{{ stats.low_stock }}</p>
                        <p class="text-xs text-muted-foreground">below minimum threshold</p>
                    </div>
                    <div class="rounded-xl border p-4 space-y-1">
                        <div class="flex items-center gap-1.5 text-destructive text-sm">
                            <PackageOpen class="h-4 w-4" />Out of Stock
                        </div>
                        <p class="text-2xl font-bold text-destructive">{{ stats.out_of_stock }}</p>
                        <p class="text-xs text-muted-foreground">zero quantity on hand</p>
                    </div>
                    <div class="rounded-xl border p-4 space-y-1">
                        <div class="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Building2 class="h-4 w-4" />Suppliers Affected
                        </div>
                        <p class="text-2xl font-bold">{{ stats.suppliers }}</p>
                        <p class="text-xs text-muted-foreground">with low-stock products</p>
                    </div>
                </div>

                <!-- Supplier groups -->
                <div v-for="group in grouped" :key="group.supplier?.id ?? 'none'" class="space-y-3">
                    <!-- Group header -->
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div v-if="group.supplier" class="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                                {{ group.supplier.company_name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() }}
                            </div>
                            <div v-else class="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                                <ShoppingBag class="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <h2 class="font-semibold">
                                    {{ group.supplier?.company_name ?? 'No Supplier Assigned' }}
                                </h2>
                                <div v-if="group.supplier" class="flex items-center gap-3 mt-0.5">
                                    <span v-if="group.supplier.phone" class="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Phone class="h-3 w-3" />{{ group.supplier.phone }}
                                    </span>
                                    <span v-if="group.supplier.email" class="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Mail class="h-3 w-3" />{{ group.supplier.email }}
                                    </span>
                                </div>
                                <p v-else class="text-xs text-muted-foreground">Link products to a supplier to enable quick PO creation</p>
                            </div>
                        </div>
                        <Button v-if="canCreatePO && group.supplier" size="sm" as-child>
                            <a :href="PurchaseOrderController.create.url()">
                                <Plus class="mr-1.5 h-3.5 w-3.5" />
                                Create PO for {{ group.supplier.company_name }}
                            </a>
                        </Button>
                    </div>

                    <!-- Products table -->
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-4 py-2.5 font-medium">Product</th>
                                    <th class="px-4 py-2.5 font-medium">Category</th>
                                    <th class="px-4 py-2.5 font-medium text-right">Cost Price</th>
                                    <th class="px-4 py-2.5 font-medium text-right">On Hand</th>
                                    <th class="px-4 py-2.5 font-medium text-right">Minimum</th>
                                    <th class="px-4 py-2.5 font-medium text-right">Deficit</th>
                                    <th class="px-4 py-2.5 font-medium text-center">Status</th>
                                    <th class="px-4 py-2.5 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr
                                    v-for="product in group.products"
                                    :key="product.id"
                                    class="hover:bg-muted/20"
                                    :class="product.stock_quantity === 0 ? 'bg-red-50/50' : ''"
                                >
                                    <td class="px-4 py-2.5">
                                        <a
                                            :href="ProductController.show.url({ product: product.id })"
                                            class="font-medium hover:underline"
                                        >{{ product.name }}</a>
                                        <div class="text-muted-foreground text-xs font-mono">{{ product.sku }}</div>
                                    </td>
                                    <td class="px-4 py-2.5 text-muted-foreground text-sm">
                                        {{ product.category?.name ?? '—' }}
                                    </td>
                                    <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                                        {{ format(product.cost_price) }}
                                    </td>
                                    <td class="px-4 py-2.5 text-right tabular-nums font-semibold"
                                        :class="product.stock_quantity === 0 ? 'text-destructive' : 'text-orange-600'"
                                    >
                                        {{ product.stock_quantity }}
                                        <span class="text-xs font-normal text-muted-foreground ml-0.5">{{ product.unit_of_measure }}</span>
                                    </td>
                                    <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                                        {{ product.minimum_stock }}
                                    </td>
                                    <td class="px-4 py-2.5 text-right tabular-nums font-semibold text-primary">
                                        {{ deficit(product) > 0 ? `+${deficit(product)}` : '—' }}
                                    </td>
                                    <td class="px-4 py-2.5 text-center">
                                        <Badge v-if="product.stock_quantity === 0" variant="destructive" class="text-xs">
                                            Out of Stock
                                        </Badge>
                                        <Badge v-else class="text-xs bg-orange-100 text-orange-800 border-0">
                                            Low Stock
                                        </Badge>
                                    </td>
                                    <td class="px-4 py-2.5 text-right">
                                        <Button size="sm" variant="ghost" as-child>
                                            <a :href="InventoryController.movements.url({ product: product.id })" title="View Movements">
                                                <ClipboardList class="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </div>
    </AppLayout>
</template>
