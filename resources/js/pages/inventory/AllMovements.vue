<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { ArrowDown, ArrowUp, Box } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';
import type { StockMovement } from '@/types/models';

interface MovementRow extends StockMovement {
    product?: { id: number; name: string; sku: string };
    user?: { id: number; name: string };
}

interface PaginatedMovements {
    data: MovementRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

const props = defineProps<{
    movements: PaginatedMovements;
    movementTypes: { value: string; label: string }[];
    filters: { product_id?: string; type?: string; date_from?: string; date_to?: string };
}>();

const typeFilter = ref(props.filters.type ?? '');
const dateFrom = ref(props.filters.date_from ?? '');
const dateTo = ref(props.filters.date_to ?? '');

function applyFilters() {
    router.get(
        InventoryController.allMovements.url(),
        {
            type: typeFilter.value || undefined,
            date_from: dateFrom.value || undefined,
            date_to: dateTo.value || undefined,
        },
        { preserveState: true, replace: true },
    );
}

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
    return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dt));
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Inventory', href: InventoryController.index.url() },
        { title: 'All Movements', href: InventoryController.allMovements.url() },
    ]">
        <div class="p-6 space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">All Stock Movements</h1>
                    <p class="text-muted-foreground text-sm">{{ movements.total }} total movements</p>
                </div>
                <Button variant="outline" as-child>
                    <a :href="InventoryController.index.url()">
                        <Box class="mr-2 h-4 w-4" />
                        Stock Overview
                    </a>
                </Button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <Select v-model="typeFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-44">
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        <SelectItem v-for="mt in movementTypes" :key="mt.value" :value="mt.value">
                            {{ mt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Input type="date" v-model="dateFrom" class="w-40" @change="applyFilters" />
                <span class="text-muted-foreground text-sm">to</span>
                <Input type="date" v-model="dateTo" class="w-40" @change="applyFilters" />
            </div>

            <!-- Table -->
            <div class="rounded-xl border">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b text-left">
                            <th class="px-4 py-3 font-medium">Date</th>
                            <th class="px-4 py-3 font-medium">Product</th>
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
                            <td class="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                                {{ formatDate(mv.created_at) }}
                            </td>
                            <td class="px-4 py-3">
                                <p class="font-medium">{{ mv.product?.name ?? '—' }}</p>
                                <p class="font-mono text-xs text-muted-foreground">{{ mv.product?.sku }}</p>
                            </td>
                            <td class="px-4 py-3">
                                <Badge class="text-xs" :class="typeBadgeClass[mv.type] ?? 'bg-gray-100 text-gray-800'">
                                    {{ typeLabels[mv.type] ?? mv.type }}
                                </Badge>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <span :class="['inline-flex items-center gap-1 font-semibold', mv.quantity > 0 ? 'text-green-600' : 'text-red-600']">
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
                            <td colspan="8" class="text-muted-foreground px-4 py-12 text-center">No movements found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="movements" />
        </div>
    </AppLayout>
</template>
