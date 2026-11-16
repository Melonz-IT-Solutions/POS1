<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as LayawayController from '@/actions/App/Http/Controllers/Admin/LayawayController';
import type { Customer, Product } from '@/types/models';

const props = defineProps<{
    customers: Pick<Customer, 'id' | 'name' | 'phone'>[];
    products:  Pick<Product,  'id' | 'name' | 'sku' | 'selling_price'>[];
}>();

interface LineItem { product_id: number; name: string; sku: string; quantity: number; unit_price: number }

const form = useForm({
    customer_id: '',
    deposit:     '0',
    due_date:    '',
    notes:       '',
    items:       [] as { product_id: number; quantity: number }[],
});

const lines = ref<LineItem[]>([]);
const productSearch = ref('');

const filteredProducts = computed(() => {
    const q = productSearch.value.toLowerCase();
    return q ? props.products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) : props.products;
});

function addProduct(p: Pick<Product, 'id' | 'name' | 'sku' | 'selling_price'>) {
    const existing = lines.value.find(l => l.product_id === p.id);
    if (existing) {
        existing.quantity++;
    } else {
        lines.value.push({ product_id: p.id, name: p.name, sku: p.sku, quantity: 1, unit_price: p.selling_price });
    }
    productSearch.value = '';
}

function removeLine(idx: number) {
    lines.value.splice(idx, 1);
}

const total = computed(() => lines.value.reduce((s, l) => s + l.unit_price * l.quantity, 0));
const balance = computed(() => Math.max(0, total.value - Math.round(parseFloat(form.deposit || '0') * 100)));

function peso(c: number) {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function submit() {
    form.items = lines.value.map(l => ({ product_id: l.product_id, quantity: l.quantity }));
    form.post(LayawayController.store.url());
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Layaway', href: LayawayController.index.url() },
        { title: 'New Layaway' },
    ]">
        <div class="p-6 max-w-3xl space-y-6">
            <h1 class="text-2xl font-bold">New Layaway Contract</h1>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Customer -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Customer</h2>
                    <div class="space-y-1.5">
                        <Label>Customer <span class="text-destructive">*</span></Label>
                        <select v-model="form.customer_id" class="border rounded-md px-3 py-2 text-sm bg-background w-full">
                            <option value="">Select customer</option>
                            <option v-for="c in customers" :key="c.id" :value="String(c.id)">
                                {{ c.name }}{{ c.phone ? ` — ${c.phone}` : '' }}
                            </option>
                        </select>
                        <InputError :message="form.errors.customer_id" />
                    </div>
                </div>

                <!-- Products -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Items</h2>

                    <Input v-model="productSearch" placeholder="Search products..." />

                    <div v-if="productSearch" class="border rounded-md divide-y max-h-48 overflow-y-auto text-sm">
                        <div
                            v-for="p in filteredProducts.slice(0, 20)"
                            :key="p.id"
                            class="flex items-center justify-between px-3 py-2 hover:bg-muted cursor-pointer"
                            @click="addProduct(p)"
                        >
                            <div>
                                <span class="font-medium">{{ p.name }}</span>
                                <span class="text-muted-foreground ml-2 text-xs">{{ p.sku }}</span>
                            </div>
                            <span class="font-mono text-xs">{{ peso(p.selling_price) }}</span>
                        </div>
                    </div>

                    <div v-if="lines.length" class="border rounded-md overflow-hidden">
                        <table class="w-full text-sm">
                            <thead class="bg-muted/50">
                                <tr>
                                    <th class="text-left px-3 py-2">Product</th>
                                    <th class="text-right px-3 py-2 w-24">Qty</th>
                                    <th class="text-right px-3 py-2">Unit</th>
                                    <th class="text-right px-3 py-2">Total</th>
                                    <th class="px-3 py-2 w-8"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(l, i) in lines" :key="i" class="border-t">
                                    <td class="px-3 py-2">
                                        <p class="font-medium">{{ l.name }}</p>
                                        <p class="text-xs text-muted-foreground">{{ l.sku }}</p>
                                    </td>
                                    <td class="px-3 py-2 text-right">
                                        <input v-model.number="l.quantity" type="number" min="1" class="w-16 border rounded px-2 py-1 text-xs text-right bg-background" />
                                    </td>
                                    <td class="px-3 py-2 text-right font-mono text-xs">{{ peso(l.unit_price) }}</td>
                                    <td class="px-3 py-2 text-right font-mono text-xs">{{ peso(l.unit_price * l.quantity) }}</td>
                                    <td class="px-3 py-2 text-center">
                                        <button type="button" @click="removeLine(i)" class="text-muted-foreground hover:text-destructive text-xs">✕</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-if="!lines.length" class="text-center text-muted-foreground text-sm py-4 border rounded-md">
                        Search and click to add products
                    </div>

                    <InputError :message="form.errors.items" />
                </div>

                <!-- Payment & Schedule -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Deposit & Schedule</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label>Initial Deposit (₱)</Label>
                            <Input v-model="form.deposit" type="number" min="0" step="0.01" placeholder="0.00" />
                            <InputError :message="form.errors.deposit" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>Due Date</Label>
                            <Input v-model="form.due_date" type="date" />
                            <InputError :message="form.errors.due_date" />
                        </div>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Notes</Label>
                        <textarea v-model="form.notes" rows="2" class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm" />
                    </div>
                </div>

                <!-- Summary & submit -->
                <div class="rounded-xl border p-5 space-y-3">
                    <h2 class="font-semibold">Summary</h2>
                    <div class="flex justify-between text-sm"><span>Total Amount</span><span class="font-mono font-semibold">{{ peso(total) }}</span></div>
                    <div class="flex justify-between text-sm text-green-600"><span>Deposit</span><span class="font-mono">{{ peso(Math.round(parseFloat(form.deposit || '0') * 100)) }}</span></div>
                    <div class="flex justify-between text-sm font-bold border-t pt-2"><span>Balance Due</span><span class="font-mono">{{ peso(balance) }}</span></div>
                </div>

                <div class="flex gap-3">
                    <Button type="submit" :disabled="form.processing || !lines.length || !form.customer_id">
                        Create Layaway
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="LayawayController.index.url()">Cancel</a>
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
