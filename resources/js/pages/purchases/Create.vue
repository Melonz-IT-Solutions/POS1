<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Plus, Trash2 } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import type { Product, Supplier } from '@/types/models';

type SupplierWithProducts = Pick<Supplier, 'id' | 'company_name'> & {
    products: Pick<Product, 'id' | 'name' | 'sku' | 'cost_price'>[];
};

const props = defineProps<{
    suppliers: SupplierWithProducts[];
    products: Pick<Product, 'id' | 'name' | 'sku' | 'cost_price'>[];
}>();

interface LineItem {
    product_id: number | '';
    quantity: number;
    unit_cost: string;
}

const form = useForm({
    supplier_id:   '' as number | '',
    expected_date: '',
    notes:         '',
    mark_ordered:  false,
    items:         [] as LineItem[],
});

function addItem() {
    form.items.push({ product_id: '', quantity: 1, unit_cost: '' });
}

function removeItem(idx: number) {
    form.items.splice(idx, 1);
}

function onProductChange(idx: number) {
    const item = form.items[idx];
    if (!item.product_id) return;
    const product = props.products.find(p => p.id === item.product_id);
    if (product) {
        item.unit_cost = (product.cost_price / 100).toFixed(2);
    }
}

// Suggested products when a supplier is selected
const supplierProducts = computed<Pick<Product, 'id' | 'name' | 'sku' | 'cost_price'>[]>(() => {
    if (!form.supplier_id) return [];
    const supplier = props.suppliers.find(s => s.id === form.supplier_id);
    return supplier?.products ?? [];
});

function addAllSupplierProducts() {
    for (const p of supplierProducts.value) {
        if (!form.items.some(i => i.product_id === p.id)) {
            form.items.push({
                product_id: p.id,
                quantity: 1,
                unit_cost: (p.cost_price / 100).toFixed(2),
            });
        }
    }
}

const subtotal = computed(() =>
    form.items.reduce((sum, item) => {
        const cost = parseFloat(item.unit_cost) || 0;
        return sum + cost * item.quantity;
    }, 0),
);

function submit() {
    form.post(PurchaseOrderController.store.url(), { preserveScroll: true });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Purchase Orders', href: PurchaseOrderController.index.url() },
        { title: 'New PO', href: PurchaseOrderController.create.url() },
    ]">
        <div class="max-w-4xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">New Purchase Order</h1>
                <p class="text-muted-foreground text-sm">Create a purchase order for a supplier</p>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Header -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Order Details</h2>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label>Supplier <span class="text-destructive">*</span></Label>
                            <Select v-model="form.supplier_id">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="s in suppliers" :key="s.id" :value="s.id">
                                        {{ s.company_name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.supplier_id" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="expected_date">Expected Delivery Date</Label>
                            <Input id="expected_date" v-model="form.expected_date" type="date" />
                            <InputError :message="form.errors.expected_date" />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <Label for="notes">Notes</Label>
                        <textarea
                            id="notes"
                            v-model="form.notes"
                            rows="2"
                            placeholder="Any instructions for this order…"
                            class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                        />
                    </div>
                </div>

                <!-- Line Items -->
                <div class="rounded-xl border p-5 space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="font-semibold">Line Items</h2>
                        <div class="flex gap-2">
                            <Button
                                v-if="supplierProducts.length"
                                type="button"
                                size="sm"
                                variant="outline"
                                @click="addAllSupplierProducts"
                            >
                                Add Supplier Products
                            </Button>
                            <Button type="button" size="sm" variant="outline" @click="addItem">
                                <Plus class="mr-1 h-4 w-4" />
                                Add Row
                            </Button>
                        </div>
                    </div>

                    <div v-if="form.items.length" class="rounded-lg border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/40 text-left">
                                    <th class="px-3 py-2 font-medium">Product</th>
                                    <th class="px-3 py-2 font-medium w-28">Qty</th>
                                    <th class="px-3 py-2 font-medium w-36">Unit Cost (₱)</th>
                                    <th class="px-3 py-2 font-medium w-32 text-right">Total</th>
                                    <th class="px-3 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="(item, idx) in form.items" :key="idx">
                                    <td class="px-3 py-2">
                                        <Select v-model="item.product_id" @update:model-value="onProductChange(idx)">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem v-for="p in products" :key="p.id" :value="p.id">
                                                    {{ p.name }}
                                                    <span class="text-muted-foreground ml-1 font-mono text-xs">{{ p.sku }}</span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td class="px-3 py-2">
                                        <Input v-model.number="item.quantity" type="number" min="1" class="w-full" />
                                    </td>
                                    <td class="px-3 py-2">
                                        <Input v-model="item.unit_cost" type="number" step="0.01" min="0" class="w-full" />
                                    </td>
                                    <td class="px-3 py-2 text-right tabular-nums font-medium">
                                        ₱{{ ((parseFloat(item.unit_cost) || 0) * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
                                    </td>
                                    <td class="px-3 py-2">
                                        <button type="button" class="text-muted-foreground hover:text-destructive" @click="removeItem(idx)">
                                            <Trash2 class="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr class="border-t bg-muted/20">
                                    <td colspan="3" class="px-3 py-2 text-right font-medium">Subtotal</td>
                                    <td class="px-3 py-2 text-right tabular-nums font-semibold">
                                        ₱{{ subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <p v-else class="text-muted-foreground rounded-lg border border-dashed py-8 text-center text-sm">
                        No items yet. Click "Add Row" to add products.
                    </p>
                    <InputError :message="form.errors.items" />
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <Checkbox id="mark_ordered" v-model:checked="form.mark_ordered" />
                        <Label for="mark_ordered" class="cursor-pointer font-normal">
                            Save and mark as <strong>Ordered</strong>
                        </Label>
                    </div>
                    <div class="flex gap-3">
                        <Button variant="outline" as-child>
                            <a :href="PurchaseOrderController.index.url()">Cancel</a>
                        </Button>
                        <Button type="submit" :disabled="form.processing || !form.items.length">
                            {{ form.processing ? 'Creating…' : (form.mark_ordered ? 'Create & Order' : 'Save Draft') }}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
