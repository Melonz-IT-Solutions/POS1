<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { ClipboardList, Pencil, Plus, Search, Trash2 } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import type { PurchaseOrder, PurchaseOrderStatus } from '@/types/models';

interface OrderRow extends PurchaseOrder {
    items_count: number;
}

interface PaginatedOrders {
    data: OrderRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number; last_page: number;
    from: number | null; to: number | null; total: number;
}

const props = defineProps<{
    orders: PaginatedOrders;
    statuses: { value: string; label: string }[];
    filters: { search?: string; status?: string };
}>();

const search = ref(props.filters.search ?? '');
const statusFilter = ref(props.filters.status ?? 'all');

function applyFilters() {
    router.get(PurchaseOrderController.index.url(), {
        search: search.value || undefined,
        status: statusFilter.value === 'all' ? undefined : statusFilter.value,
    }, { preserveState: true, replace: true });
}

let timer: ReturnType<typeof setTimeout>;
function onSearch() { clearTimeout(timer); timer = setTimeout(applyFilters, 350); }

const confirmDelete = ref(false);
const target = ref<OrderRow | null>(null);

function askDelete(o: OrderRow) { target.value = o; confirmDelete.value = true; }
function doDelete() {
    if (!target.value) return;
    router.delete(PurchaseOrderController.destroy.url({ purchase: target.value.id }), { preserveScroll: true });
}

const statusConfig: Record<PurchaseOrderStatus, { label: string; class: string }> = {
    draft:              { label: 'Draft',              class: 'bg-gray-100 text-gray-700' },
    ordered:            { label: 'Ordered',            class: 'bg-blue-100 text-blue-800' },
    partially_received: { label: 'Partial',            class: 'bg-orange-100 text-orange-800' },
    received:           { label: 'Received',           class: 'bg-green-100 text-green-800' },
    cancelled:          { label: 'Cancelled',          class: 'bg-red-100 text-red-800' },
};

const df = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function formatDate(s: string | null): string {
    return s ? df.format(new Date(s)) : '—';
}
function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Purchase Orders', href: PurchaseOrderController.index.url() }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Purchase Orders</h1>
                    <p class="text-muted-foreground text-sm">{{ orders.total }} purchase orders</p>
                </div>
                <Button as-child>
                    <a :href="PurchaseOrderController.create.url()">
                        <Plus class="mr-2 h-4 w-4" />
                        New PO
                    </a>
                </Button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input v-model="search" placeholder="Search PO number or supplier…" class="pl-9" @input="onSearch" />
                </div>
                <Select v-model="statusFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-44">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Table -->
            <div class="rounded-xl border">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b text-left">
                            <th class="px-4 py-3 font-medium">PO Number</th>
                            <th class="px-4 py-3 font-medium">Supplier</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Items</th>
                            <th class="px-4 py-3 font-medium">Subtotal</th>
                            <th class="px-4 py-3 font-medium">Expected</th>
                            <th class="px-4 py-3 font-medium">Ordered By</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="o in orders.data"
                            :key="o.id"
                            class="border-b transition-colors hover:bg-muted/50"
                        >
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <ClipboardList class="text-muted-foreground h-4 w-4 shrink-0" />
                                    <a
                                        :href="PurchaseOrderController.show.url({ purchase: o.id })"
                                        class="font-mono font-medium hover:underline"
                                    >{{ o.po_number }}</a>
                                </div>
                            </td>
                            <td class="px-4 py-3">{{ o.supplier?.company_name ?? '—' }}</td>
                            <td class="px-4 py-3">
                                <Badge
                                    variant="secondary"
                                    :class="statusConfig[o.status].class"
                                    class="text-xs"
                                >
                                    {{ statusConfig[o.status].label }}
                                </Badge>
                            </td>
                            <td class="px-4 py-3 tabular-nums">{{ o.items_count }}</td>
                            <td class="px-4 py-3 tabular-nums font-medium">{{ peso(o.subtotal) }}</td>
                            <td class="px-4 py-3 text-muted-foreground">{{ formatDate(o.expected_date) }}</td>
                            <td class="px-4 py-3 text-muted-foreground text-xs">{{ o.orderedBy?.name ?? '—' }}</td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Button size="sm" variant="ghost" as-child title="View">
                                        <a :href="PurchaseOrderController.show.url({ purchase: o.id })">
                                            <ClipboardList class="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        v-if="o.status === 'draft'"
                                        size="sm" variant="ghost" as-child title="Edit"
                                    >
                                        <a :href="PurchaseOrderController.edit.url({ purchase: o.id })">
                                            <Pencil class="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        v-if="o.status === 'draft'"
                                        size="sm" variant="ghost" class="text-destructive" @click="askDelete(o)" title="Delete"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!orders.data.length">
                            <td colspan="8" class="text-muted-foreground px-4 py-12 text-center">No purchase orders found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="orders" />
        </div>

        <ConfirmDialog
            v-model:open="confirmDelete"
            title="Delete Purchase Order"
            :description="`Delete draft PO &quot;${target?.po_number}&quot;? This cannot be undone.`"
            confirm-label="Delete"
            @confirm="doDelete"
        />
    </AppLayout>
</template>
