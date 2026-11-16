<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { CheckCircle2, ClipboardList, PackageCheck, Pencil, Printer, XCircle } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import type { PurchaseOrder, PurchaseOrderStatus } from '@/types/models';

const props = defineProps<{
    order: PurchaseOrder;
}>();

const statusConfig: Record<PurchaseOrderStatus, { label: string; class: string }> = {
    draft:              { label: 'Draft',              class: 'bg-gray-100 text-gray-700' },
    ordered:            { label: 'Ordered',            class: 'bg-blue-100 text-blue-800' },
    partially_received: { label: 'Partially Received', class: 'bg-orange-100 text-orange-800' },
    received:           { label: 'Received',           class: 'bg-green-100 text-green-800' },
    cancelled:          { label: 'Cancelled',          class: 'bg-red-100 text-red-800' },
};

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const df = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function formatDate(s: string | null): string { return s ? df.format(new Date(s)) : '—'; }
function formatDateTime(s: string): string { return dtf.format(new Date(s)); }

function markOrdered() {
    router.post(PurchaseOrderController.markOrdered.url({ purchase: props.order.id }), {}, { preserveScroll: true });
}
function cancelOrder() {
    if (!confirm('Cancel this purchase order?')) return;
    router.post(PurchaseOrderController.cancel.url({ purchase: props.order.id }), {}, { preserveScroll: true });
}

function remainingQty(item: { quantity_ordered: number; quantity_received: number }): number {
    return item.quantity_ordered - item.quantity_received;
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Purchase Orders', href: PurchaseOrderController.index.url() },
        { title: order.po_number, href: PurchaseOrderController.show.url({ purchase: order.id }) },
    ]">
        <div class="mx-auto max-w-4xl p-6 space-y-6">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                        <ClipboardList class="h-5 w-5" />
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold font-mono">{{ order.po_number }}</h1>
                        <div class="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" :class="statusConfig[order.status].class" class="text-xs">
                                {{ statusConfig[order.status].label }}
                            </Badge>
                            <span class="text-muted-foreground text-xs">Created {{ formatDate(order.created_at) }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <!-- Print button always visible for non-cancelled POs -->
                    <Button
                        v-if="order.status !== 'cancelled'"
                        variant="outline"
                        size="sm"
                        as-child
                    >
                        <a :href="PurchaseOrderController.print.url({ purchase: order.id })" target="_blank">
                            <Printer class="mr-2 h-4 w-4" />
                            Print PO
                        </a>
                    </Button>
                    <template v-if="order.status === 'draft'">
                        <Button variant="outline" size="sm" as-child>
                            <a :href="PurchaseOrderController.edit.url({ purchase: order.id })">
                                <Pencil class="mr-2 h-4 w-4" />
                                Edit
                            </a>
                        </Button>
                        <Button size="sm" @click="markOrdered">
                            <CheckCircle2 class="mr-2 h-4 w-4" />
                            Mark as Ordered
                        </Button>
                    </template>
                    <template v-if="order.status === 'ordered' || order.status === 'partially_received'">
                        <Button size="sm" as-child>
                            <a :href="PurchaseOrderController.receive.url({ purchase: order.id })">
                                <PackageCheck class="mr-2 h-4 w-4" />
                                Receive Goods
                            </a>
                        </Button>
                        <Button variant="outline" size="sm" class="text-destructive border-destructive/30" @click="cancelOrder">
                            <XCircle class="mr-2 h-4 w-4" />
                            Cancel PO
                        </Button>
                    </template>
                </div>
            </div>

            <!-- Info cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Supplier</p>
                    <p class="font-medium text-sm">{{ order.supplier?.company_name ?? '—' }}</p>
                    <p v-if="order.supplier?.contact_person" class="text-muted-foreground text-xs">{{ order.supplier.contact_person }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Ordered By</p>
                    <p class="font-medium text-sm">{{ order.orderedBy?.name ?? '—' }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Expected Date</p>
                    <p class="font-medium text-sm">{{ formatDate(order.expected_date) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Subtotal</p>
                    <p class="font-semibold tabular-nums">{{ peso(order.subtotal) }}</p>
                </div>
            </div>

            <div v-if="order.notes" class="rounded-xl border p-4">
                <p class="text-muted-foreground text-xs mb-1">Notes</p>
                <p class="text-sm">{{ order.notes }}</p>
            </div>

            <!-- Line items -->
            <div class="rounded-xl border">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold">Line Items</h2>
                </div>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2 font-medium">Product</th>
                            <th class="px-4 py-2 font-medium text-right">Ordered</th>
                            <th class="px-4 py-2 font-medium text-right">Received</th>
                            <th class="px-4 py-2 font-medium text-right">Remaining</th>
                            <th class="px-4 py-2 font-medium text-right">Unit Cost</th>
                            <th class="px-4 py-2 font-medium text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="item in order.items" :key="item.id">
                            <td class="px-4 py-2.5">
                                <p class="font-medium">{{ item.product?.name ?? '—' }}</p>
                                <p class="text-muted-foreground font-mono text-xs">{{ item.product?.sku }}</p>
                            </td>
                            <td class="px-4 py-2.5 text-right tabular-nums">{{ item.quantity_ordered }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums text-green-700">{{ item.quantity_received }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums" :class="remainingQty(item) > 0 ? 'text-orange-700' : 'text-muted-foreground'">
                                {{ remainingQty(item) }}
                            </td>
                            <td class="px-4 py-2.5 text-right tabular-nums">{{ peso(item.unit_cost) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-medium">{{ peso(item.total_cost) }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="border-t bg-muted/20">
                            <td colspan="5" class="px-4 py-2.5 text-right font-medium">Subtotal</td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-semibold">{{ peso(order.subtotal) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Receipts -->
            <div v-if="order.receipts && order.receipts.length" class="rounded-xl border">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold">Receipts ({{ order.receipts.length }})</h2>
                </div>
                <div class="divide-y">
                    <div v-for="receipt in order.receipts" :key="receipt.id" class="p-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium">Received {{ formatDateTime(receipt.received_at) }}</p>
                                <p class="text-muted-foreground text-xs">by {{ receipt.receivedBy?.name ?? '—' }}</p>
                            </div>
                        </div>
                        <div v-if="receipt.notes" class="text-muted-foreground text-xs">{{ receipt.notes }}</div>
                        <table class="w-full text-xs">
                            <thead>
                                <tr class="border-b text-left text-muted-foreground">
                                    <th class="pb-1">Product</th>
                                    <th class="pb-1 text-right">Qty Received</th>
                                    <th class="pb-1 text-right">Unit Cost</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="ri in receipt.items" :key="ri.id">
                                    <td class="py-1">{{ ri.product?.name ?? '—' }}</td>
                                    <td class="py-1 text-right tabular-nums">{{ ri.quantity_received }}</td>
                                    <td class="py-1 text-right tabular-nums">{{ peso(ri.unit_cost) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
