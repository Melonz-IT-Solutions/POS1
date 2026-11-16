<script setup lang="ts">
import {
    AlertTriangle,
    ArrowRight,
    Building2,
    ClipboardList,
    Mail,
    MapPin,
    Package,
    Pencil,
    Phone,
    Receipt,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/composables/useCurrency';
import * as SupplierController from '@/actions/App/Http/Controllers/Admin/SupplierController';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import type { Product, PurchaseOrder, User, Supplier } from '@/types/models';

interface Stats {
    products_count: number;
    orders_count: number;
    total_spend: number;
    pending_orders: number;
}

const props = defineProps<{
    supplier: Supplier & {
        products?: Pick<Product, 'id' | 'name' | 'sku' | 'selling_price' | 'stock_quantity' | 'minimum_stock' | 'is_active'>[];
    };
    recentOrders: (Pick<PurchaseOrder, 'id' | 'po_number' | 'status' | 'expected_date' | 'subtotal' | 'created_at' | 'notes'> & {
        orderedBy?: Pick<User, 'id' | 'name'>;
    })[];
    stats: Stats;
    canEdit: boolean;
}>();

const { format } = useCurrency();

const orderStatusConfig: Record<string, { label: string; cls: string }> = {
    draft:              { label: 'Draft',              cls: 'bg-gray-100 text-gray-700' },
    ordered:            { label: 'Ordered',            cls: 'bg-blue-100 text-blue-700' },
    partially_received: { label: 'Partial',            cls: 'bg-amber-100 text-amber-700' },
    received:           { label: 'Received',           cls: 'bg-green-100 text-green-700' },
    cancelled:          { label: 'Cancelled',          cls: 'bg-red-100 text-red-700' },
};

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function fmt(s: string | null) { return s ? dtf.format(new Date(s)) : '—'; }

function initials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Suppliers', href: SupplierController.index.url() },
        { title: supplier.company_name, href: SupplierController.show.url({ supplier: supplier.id }) },
    ]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex items-start gap-4">
                    <div class="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-xl font-bold">
                        {{ initials(supplier.company_name) }}
                    </div>
                    <div>
                        <div class="flex items-center gap-3">
                            <h1 class="text-2xl font-bold">{{ supplier.company_name }}</h1>
                            <Badge v-if="supplier.is_active" class="bg-green-100 text-green-800 border-0 text-xs">Active</Badge>
                            <Badge v-else variant="outline" class="text-xs text-muted-foreground">Inactive</Badge>
                        </div>
                        <p v-if="supplier.contact_person" class="text-muted-foreground mt-0.5">{{ supplier.contact_person }}</p>
                        <div class="flex flex-wrap items-center gap-3 mt-1.5">
                            <span v-if="supplier.phone" class="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone class="h-3.5 w-3.5" />{{ supplier.phone }}
                            </span>
                            <span v-if="supplier.email" class="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail class="h-3.5 w-3.5" />{{ supplier.email }}
                            </span>
                            <span v-if="supplier.address" class="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin class="h-3.5 w-3.5" />{{ supplier.address }}
                            </span>
                            <span v-if="supplier.tin" class="text-sm text-muted-foreground font-mono">
                                TIN: {{ supplier.tin }}
                            </span>
                        </div>
                    </div>
                </div>
                <Button v-if="canEdit && !supplier.deleted_at" as-child>
                    <a :href="SupplierController.edit.url({ supplier: supplier.id })">
                        <Pencil class="mr-2 h-4 w-4" />Edit Supplier
                    </a>
                </Button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm flex items-center gap-1.5">
                        <Package class="h-3.5 w-3.5" />Products
                    </p>
                    <p class="text-2xl font-bold">{{ stats.products_count }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm flex items-center gap-1.5">
                        <ClipboardList class="h-3.5 w-3.5" />Purchase Orders
                    </p>
                    <p class="text-2xl font-bold">{{ stats.orders_count }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm flex items-center gap-1.5">
                        <Receipt class="h-3.5 w-3.5" />Total Spend
                    </p>
                    <p class="text-2xl font-bold">{{ format(stats.total_spend) }}</p>
                    <p class="text-xs text-muted-foreground">received orders</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm flex items-center gap-1.5">
                        <ClipboardList class="h-3.5 w-3.5" />Pending Orders
                    </p>
                    <p class="text-2xl font-bold" :class="stats.pending_orders > 0 ? 'text-amber-600' : ''">
                        {{ stats.pending_orders }}
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Linked Products -->
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <Package class="h-5 w-5 text-muted-foreground" />
                        <h2 class="font-semibold text-lg">Products</h2>
                    </div>
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2.5 font-medium">Product</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Price</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Stock</th>
                                    <th class="px-3 py-2.5 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr
                                    v-for="p in supplier.products"
                                    :key="p.id"
                                    class="hover:bg-muted/20"
                                >
                                    <td class="px-3 py-2.5">
                                        <a
                                            :href="ProductController.show.url({ product: p.id })"
                                            class="font-medium hover:underline"
                                        >{{ p.name }}</a>
                                        <div class="text-muted-foreground text-xs font-mono">{{ p.sku }}</div>
                                    </td>
                                    <td class="px-3 py-2.5 text-right tabular-nums">{{ format(p.selling_price) }}</td>
                                    <td class="px-3 py-2.5 text-right tabular-nums">
                                        <div class="flex items-center justify-end gap-1">
                                            <span :class="p.stock_quantity <= p.minimum_stock && p.minimum_stock > 0 ? 'text-orange-600 font-semibold' : ''">
                                                {{ p.stock_quantity }}
                                            </span>
                                            <AlertTriangle
                                                v-if="p.stock_quantity <= p.minimum_stock && p.minimum_stock > 0"
                                                class="h-3 w-3 text-orange-500"
                                            />
                                        </div>
                                    </td>
                                    <td class="px-3 py-2.5 text-center">
                                        <Badge v-if="p.is_active" class="text-xs bg-green-100 text-green-800 border-0">Active</Badge>
                                        <Badge v-else variant="outline" class="text-xs text-muted-foreground">Inactive</Badge>
                                    </td>
                                </tr>
                                <tr v-if="!supplier.products?.length">
                                    <td colspan="4" class="text-muted-foreground px-3 py-8 text-center text-sm">
                                        No products linked.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Recent Purchase Orders -->
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <ClipboardList class="h-5 w-5 text-muted-foreground" />
                            <h2 class="font-semibold text-lg">Recent Purchase Orders</h2>
                        </div>
                        <Button variant="ghost" size="sm" as-child>
                            <a :href="PurchaseOrderController.index.url()" class="flex items-center gap-1 text-xs">
                                View all <ArrowRight class="h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2.5 font-medium">PO #</th>
                                    <th class="px-3 py-2.5 font-medium">Status</th>
                                    <th class="px-3 py-2.5 font-medium">Expected</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr
                                    v-for="po in recentOrders"
                                    :key="po.id"
                                    class="hover:bg-muted/20"
                                >
                                    <td class="px-3 py-2.5">
                                        <a
                                            :href="PurchaseOrderController.show.url({ purchase: po.id })"
                                            class="font-mono text-xs font-medium hover:underline"
                                        >{{ po.po_number }}</a>
                                        <div v-if="po.orderedBy" class="text-muted-foreground text-xs">{{ po.orderedBy.name }}</div>
                                    </td>
                                    <td class="px-3 py-2.5">
                                        <span
                                            class="inline-block text-xs font-medium rounded-full px-2 py-0.5"
                                            :class="orderStatusConfig[po.status]?.cls ?? 'bg-muted text-muted-foreground'"
                                        >{{ orderStatusConfig[po.status]?.label ?? po.status }}</span>
                                    </td>
                                    <td class="px-3 py-2.5 text-muted-foreground text-xs whitespace-nowrap">{{ fmt(po.expected_date) }}</td>
                                    <td class="px-3 py-2.5 text-right tabular-nums font-medium">{{ format(po.subtotal) }}</td>
                                </tr>
                                <tr v-if="!recentOrders.length">
                                    <td colspan="4" class="text-muted-foreground px-3 py-8 text-center text-sm">
                                        No purchase orders yet.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
