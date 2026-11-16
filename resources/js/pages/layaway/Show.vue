<script setup lang="ts">
import { ref } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as LayawayController from '@/actions/App/Http/Controllers/Admin/LayawayController';
import type { Layaway } from '@/types/models';

const props = defineProps<{
    layaway: Layaway;
    payment_methods: string[];
}>();

const paymentForm = useForm({
    amount:         '',
    payment_method: 'cash',
    reference:      '',
    notes:          '',
});

function submitPayment() {
    paymentForm.post(LayawayController.addPayment.url(props.layaway.id), {
        onSuccess: () => { paymentForm.reset(); },
    });
}

const showCancelConfirm = ref(false);
function cancelLayaway() {
    router.post(LayawayController.cancel.url(props.layaway.id));
}

function peso(c: number) {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function formatDate(s: string) {
    return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(s));
}

const statusClasses: Record<string, string> = {
    active:    'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const pctPaid = computed(() => props.layaway.total_amount > 0
    ? Math.round(props.layaway.deposit_paid / props.layaway.total_amount * 100)
    : 0,
);

import { computed } from 'vue';
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Layaway', href: LayawayController.index.url() },
        { title: layaway.layaway_number },
    ]">
        <div class="p-6 max-w-4xl space-y-6">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-bold font-mono">{{ layaway.layaway_number }}</h1>
                        <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClasses[layaway.status]">
                            {{ layaway.status }}
                        </span>
                    </div>
                    <p class="text-muted-foreground text-sm mt-0.5">Created {{ formatDate(layaway.created_at) }}</p>
                </div>
                <Button
                    v-if="layaway.status === 'active'"
                    variant="destructive"
                    size="sm"
                    @click="showCancelConfirm = true"
                >Cancel Layaway</Button>
            </div>

            <!-- Progress bar -->
            <div class="rounded-xl border p-5 space-y-3">
                <div class="flex justify-between text-sm">
                    <span>Payment Progress</span>
                    <span class="font-semibold">{{ pctPaid }}%</span>
                </div>
                <div class="h-3 bg-muted rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all" :style="{ width: pctPaid + '%' }" />
                </div>
                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p class="text-muted-foreground text-xs">Total</p>
                        <p class="font-semibold font-mono">{{ peso(layaway.total_amount) }}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground text-xs">Paid</p>
                        <p class="font-semibold font-mono text-green-600">{{ peso(layaway.deposit_paid) }}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground text-xs">Balance</p>
                        <p class="font-semibold font-mono" :class="layaway.balance > 0 ? 'text-orange-600' : 'text-green-600'">{{ peso(layaway.balance) }}</p>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Customer -->
                <div class="rounded-xl border p-5 space-y-2">
                    <h2 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Customer</h2>
                    <p class="font-semibold">{{ layaway.customer?.name }}</p>
                    <p v-if="layaway.customer?.phone" class="text-sm text-muted-foreground">{{ layaway.customer?.phone }}</p>
                    <p v-if="layaway.customer?.email" class="text-sm text-muted-foreground">{{ layaway.customer?.email }}</p>
                    <p v-if="layaway.due_date" class="text-sm" :class="layaway.due_date < new Date().toISOString().slice(0,10) && layaway.status === 'active' ? 'text-red-600 font-semibold' : ''">
                        Due: {{ layaway.due_date }}
                    </p>
                    <p v-if="layaway.notes" class="text-sm text-muted-foreground">{{ layaway.notes }}</p>
                </div>

                <!-- Add payment -->
                <div v-if="layaway.status === 'active'" class="rounded-xl border p-5 space-y-3">
                    <h2 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Record Payment</h2>
                    <form @submit.prevent="submitPayment" class="space-y-3">
                        <div class="space-y-1.5">
                            <Label>Amount (₱) <span class="text-destructive">*</span></Label>
                            <Input v-model="paymentForm.amount" type="number" min="0.01" step="0.01" placeholder="0.00" />
                            <InputError :message="paymentForm.errors.amount" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>Payment Method</Label>
                            <select v-model="paymentForm.payment_method" class="border rounded-md px-3 py-2 text-sm bg-background w-full">
                                <option v-for="m in payment_methods" :key="m" :value="m">{{ m.charAt(0).toUpperCase() + m.slice(1) }}</option>
                            </select>
                        </div>
                        <div class="space-y-1.5">
                            <Label>Reference / Note</Label>
                            <Input v-model="paymentForm.notes" placeholder="Optional" />
                        </div>
                        <Button type="submit" :disabled="paymentForm.processing" class="w-full">
                            Record Payment
                        </Button>
                    </form>
                </div>
            </div>

            <!-- Items -->
            <div class="rounded-xl border overflow-hidden">
                <div class="p-4 border-b font-semibold">Items</div>
                <table class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="text-left px-4 py-2">Product</th>
                            <th class="text-right px-4 py-2">Qty</th>
                            <th class="text-right px-4 py-2">Unit</th>
                            <th class="text-right px-4 py-2">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in layaway.items ?? []" :key="item.id" class="border-t">
                            <td class="px-4 py-2">
                                <p>{{ item.product_name }}</p>
                                <p class="text-xs text-muted-foreground">{{ item.product_sku }}</p>
                            </td>
                            <td class="px-4 py-2 text-right">{{ item.quantity }}</td>
                            <td class="px-4 py-2 text-right font-mono">{{ peso(item.unit_price) }}</td>
                            <td class="px-4 py-2 text-right font-mono font-semibold">{{ peso(item.total) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Payment history -->
            <div class="rounded-xl border overflow-hidden">
                <div class="p-4 border-b font-semibold">Payment History</div>
                <div v-if="!(layaway.payments?.length)" class="p-6 text-center text-muted-foreground text-sm">No payments yet.</div>
                <table v-else class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="text-left px-4 py-2">Date</th>
                            <th class="text-left px-4 py-2">Method</th>
                            <th class="text-right px-4 py-2">Amount</th>
                            <th class="text-left px-4 py-2">Received By</th>
                            <th class="text-left px-4 py-2">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="p in layaway.payments ?? []" :key="p.id" class="border-t">
                            <td class="px-4 py-2 text-xs text-muted-foreground">{{ formatDate(p.created_at) }}</td>
                            <td class="px-4 py-2">{{ p.payment_method }}</td>
                            <td class="px-4 py-2 text-right font-mono text-green-600">{{ peso(p.amount) }}</td>
                            <td class="px-4 py-2 text-xs">{{ p.receiver?.name ?? '—' }}</td>
                            <td class="px-4 py-2 text-xs text-muted-foreground">{{ p.notes ?? '' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Cancel confirm dialog -->
        <div v-if="showCancelConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-background rounded-xl border p-6 max-w-sm w-full space-y-4">
                <h3 class="font-semibold text-lg">Cancel Layaway?</h3>
                <p class="text-sm text-muted-foreground">This will cancel layaway {{ layaway.layaway_number }}. This action cannot be undone.</p>
                <div class="flex gap-3">
                    <Button variant="destructive" @click="cancelLayaway">Yes, Cancel</Button>
                    <Button variant="outline" @click="showCancelConfirm = false">Keep</Button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
