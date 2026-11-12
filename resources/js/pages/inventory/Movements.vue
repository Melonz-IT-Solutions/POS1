<script setup lang="ts">
import { ArrowDown, ArrowUp, Box } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';
import type { Product, StockMovement } from '@/types/models';

interface PaginatedMovements {
    data: (StockMovement & {
        user?: { id: number; name: string };
    })[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

const props = defineProps<{
    product: Product & { category?: { id: number; name: string } };
    movements: PaginatedMovements;
}>();

const typeLabels: Record<string, string> = {
    sale: 'Sale',
    refund: 'Refund',
    void: 'Void',
    purchase_receipt: 'Purchase',
    manual_adjustment: 'Adjustment',
    damage_loss: 'Damage/Loss',
    initial_stock: 'Initial Stock',
};

const typeBadgeClass: Record<string, string> = {
    sale: 'bg-blue-100 text-blue-800',
    refund: 'bg-green-100 text-green-800',
    void: 'bg-gray-100 text-gray-800',
    purchase_receipt: 'bg-purple-100 text-purple-800',
    manual_adjustment: 'bg-orange-100 text-orange-800',
    damage_loss: 'bg-red-100 text-red-800',
    initial_stock: 'bg-cyan-100 text-cyan-800',
};

function formatDate(dt: string) {
    return new Intl.DateTimeFormat('en-PH', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(dt));
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Inventory', href: InventoryController.index.url() },
        { title: product.name, href: InventoryController.movements.url({ product: product.id }) },
    ]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Stock Movements</h1>
                    <p class="text-muted-foreground text-sm">
                        {{ product.name }}
                        <span class="font-mono ml-1">· {{ product.sku }}</span>
                        <span class="ml-2">— Current stock: <strong>{{ product.stock_quantity }} {{ product.unit_of_measure }}</strong></span>
                    </p>
                </div>
                <Button variant="outline" as-child>
                    <a :href="InventoryController.index.url()">
                        <Box class="mr-2 h-4 w-4" />
                        Back to Inventory
                    </a>
                </Button>
            </div>

            <!-- Table -->
            <div class="rounded-xl border">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b text-left">
                            <th class="px-4 py-3 font-medium">Date</th>
                            <th class="px-4 py-3 font-medium">Type</th>
                            <th class="px-4 py-3 font-medium text-right">Change</th>
                            <th class="px-4 py-3 font-medium text-right">Before</th>
                            <th class="px-4 py-3 font-medium text-right">After</th>
                            <th class="px-4 py-3 font-medium">Reason</th>
                            <th class="px-4 py-3 font-medium">By</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="mv in movements.data"
                            :key="mv.id"
                            class="border-b transition-colors hover:bg-muted/50"
                        >
                            <td class="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                {{ formatDate(mv.created_at) }}
                            </td>
                            <td class="px-4 py-3">
                                <Badge class="text-xs" :class="typeBadgeClass[mv.type] ?? 'bg-gray-100 text-gray-800'">
                                    {{ typeLabels[mv.type] ?? mv.type }}
                                </Badge>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <span
                                    :class="[
                                        'inline-flex items-center gap-1 font-semibold',
                                        mv.quantity > 0 ? 'text-green-600' : 'text-red-600',
                                    ]"
                                >
                                    <ArrowUp v-if="mv.quantity > 0" class="h-3.5 w-3.5" />
                                    <ArrowDown v-else class="h-3.5 w-3.5" />
                                    {{ Math.abs(mv.quantity) }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right text-muted-foreground">{{ mv.quantity_before }}</td>
                            <td class="px-4 py-3 text-right font-medium">{{ mv.quantity_after }}</td>
                            <td class="px-4 py-3 text-muted-foreground max-w-xs">
                                <span class="line-clamp-1">{{ mv.reason ?? '—' }}</span>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">{{ mv.user?.name ?? '—' }}</td>
                        </tr>
                        <tr v-if="!movements.data.length">
                            <td colspan="7" class="text-muted-foreground px-4 py-12 text-center">
                                No movements recorded yet.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="movements" />
        </div>
    </AppLayout>
</template>
