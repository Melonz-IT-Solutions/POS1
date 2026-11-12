<script setup lang="ts">
import { computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import type { PurchaseOrder } from '@/types/models';

const props = defineProps<{
    order: PurchaseOrder;
}>();

interface ReceiveItem {
    purchase_order_item_id: number;
    quantity_received: number;
    max: number;
    product_name: string;
    sku: string;
    quantity_ordered: number;
    quantity_already_received: number;
    unit_cost: number;
}

const receiveItems = computed<ReceiveItem[]>(() =>
    (props.order.items ?? [])
        .filter(i => i.quantity_received < i.quantity_ordered)
        .map(i => ({
            purchase_order_item_id:   i.id,
            quantity_received:        i.quantity_ordered - i.quantity_received, // default to full remaining
            max:                      i.quantity_ordered - i.quantity_received,
            product_name:             i.product?.name ?? '—',
            sku:                      i.product?.sku ?? '',
            quantity_ordered:         i.quantity_ordered,
            quantity_already_received: i.quantity_received,
            unit_cost:                i.unit_cost,
        })),
);

const form = useForm({
    notes: '',
    items: receiveItems.value,
});

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const totalReceiving = computed(() =>
    form.items.reduce((s, i) => s + i.quantity_received * i.unit_cost, 0),
);

function submit() {
    form.post(PurchaseOrderController.storeReceipt.url({ purchase: props.order.id }), {
        preserveScroll: true,
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Purchase Orders', href: PurchaseOrderController.index.url() },
        { title: order.po_number, href: PurchaseOrderController.show.url({ purchase: order.id }) },
        { title: 'Receive Goods', href: PurchaseOrderController.receive.url({ purchase: order.id }) },
    ]">
        <div class="mx-auto max-w-3xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">Receive Goods</h1>
                <p class="text-muted-foreground text-sm font-mono">{{ order.po_number }} — {{ order.supplier?.company_name }}</p>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Items table -->
                <div class="rounded-xl border overflow-hidden">
                    <div class="border-b px-4 py-3 bg-muted/30">
                        <p class="font-semibold text-sm">Pending Items</p>
                        <p class="text-muted-foreground text-xs">Enter the quantity you are receiving for each item. Leave 0 to skip.</p>
                    </div>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/20 text-left">
                                <th class="px-4 py-2 font-medium">Product</th>
                                <th class="px-4 py-2 font-medium text-right">Ordered</th>
                                <th class="px-4 py-2 font-medium text-right">Prev. Received</th>
                                <th class="px-4 py-2 font-medium text-right">Remaining</th>
                                <th class="px-4 py-2 font-medium text-right">Receiving Now</th>
                                <th class="px-4 py-2 font-medium text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="(item, idx) in form.items" :key="item.purchase_order_item_id">
                                <td class="px-4 py-2.5">
                                    <p class="font-medium">{{ item.product_name }}</p>
                                    <p class="text-muted-foreground font-mono text-xs">{{ item.sku }}</p>
                                </td>
                                <td class="px-4 py-2.5 text-right tabular-nums">{{ item.quantity_ordered }}</td>
                                <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{{ item.quantity_already_received }}</td>
                                <td class="px-4 py-2.5 text-right tabular-nums text-orange-700">{{ item.max }}</td>
                                <td class="px-4 py-2.5 text-right">
                                    <Input
                                        v-model.number="form.items[idx].quantity_received"
                                        type="number"
                                        min="0"
                                        :max="item.max"
                                        class="w-24 text-right ml-auto"
                                    />
                                </td>
                                <td class="px-4 py-2.5 text-right tabular-nums font-medium">
                                    {{ peso(item.quantity_received * item.unit_cost) }}
                                </td>
                            </tr>
                            <tr v-if="!form.items.length">
                                <td colspan="6" class="text-muted-foreground px-4 py-8 text-center">
                                    All items have been fully received.
                                </td>
                            </tr>
                        </tbody>
                        <tfoot v-if="form.items.length">
                            <tr class="border-t bg-muted/20">
                                <td colspan="5" class="px-4 py-2.5 text-right font-medium">Total Receiving</td>
                                <td class="px-4 py-2.5 text-right tabular-nums font-semibold">{{ peso(totalReceiving) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <InputError :message="(form.errors as Record<string, string>).items" />

                <!-- Notes -->
                <div class="rounded-xl border p-5 space-y-2">
                    <Label for="notes">Receipt Notes <span class="text-muted-foreground font-normal">(optional)</span></Label>
                    <textarea
                        id="notes"
                        v-model="form.notes"
                        rows="2"
                        placeholder="e.g. Partial delivery, 2 items backordered"
                        class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                    />
                </div>

                <div class="flex justify-end gap-3">
                    <Button variant="outline" as-child>
                        <a :href="PurchaseOrderController.show.url({ purchase: order.id })">Cancel</a>
                    </Button>
                    <Button type="submit" :disabled="form.processing || !form.items.length">
                        {{ form.processing ? 'Processing…' : 'Confirm Receipt' }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
