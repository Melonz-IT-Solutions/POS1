<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Mail, Printer } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import * as SaleController from '@/actions/App/Http/Controllers/POS/SaleController';
import type { Sale } from '@/types/models';

const props = defineProps<{
    sale: Sale;
    canVoid: boolean;
    canRefund: boolean;
}>();

// ── Void modal ──────────────────────────────────────────────────────────────
const showVoidModal = ref(false);
const voidReason    = ref('');
const voidLoading   = ref(false);

function submitVoid() {
    if (!voidReason.value.trim()) return;
    voidLoading.value = true;
    router.post(
        SaleController.voidMethod.url(props.sale.id),
        { reason: voidReason.value },
        {
            onSuccess: () => { showVoidModal.value = false; voidReason.value = ''; },
            onFinish:  () => { voidLoading.value = false; },
        },
    );
}

// ── Refund modal ─────────────────────────────────────────────────────────────
const showRefundModal = ref(false);
const refundReason    = ref('');
const refundLoading   = ref(false);

interface RefundItemState {
    sale_item_id: number;
    name: string;
    sku: string;
    quantity: number;
    max_quantity: number;
    unit_refund: number;
}

const refundItems = ref<RefundItemState[]>([]);

function openRefundModal() {
    const refundedByProduct: Record<number, number> = {};
    for (const refund of (props.sale as any).refunds ?? []) {
        for (const item of (refund.items ?? []) as { product_id: number | null; quantity: number }[]) {
            if (item.product_id != null) {
                refundedByProduct[item.product_id] = (refundedByProduct[item.product_id] ?? 0) + item.quantity;
            }
        }
    }
    refundItems.value = (props.sale.items ?? [])
        .map(item => ({
            sale_item_id: item.id,
            name: item.product_name,
            sku: item.product_sku,
            quantity: 0,
            max_quantity: item.product_id != null
                ? item.quantity - (refundedByProduct[item.product_id] ?? 0)
                : item.quantity,
            unit_refund: item.quantity > 0 ? Math.round(item.line_total / item.quantity) : 0,
        }))
        .filter(i => i.max_quantity > 0);
    refundReason.value = '';
    showRefundModal.value = true;
}

const refundTotal = computed(() =>
    refundItems.value.reduce((sum, i) => sum + i.unit_refund * i.quantity, 0),
);

const canSubmitRefund = computed(() =>
    refundReason.value.trim().length >= 5
    && refundItems.value.some(i => i.quantity > 0)
    && refundItems.value.every(i => i.quantity >= 0 && i.quantity <= i.max_quantity),
);

function submitRefund() {
    const selectedItems = refundItems.value.filter(i => i.quantity > 0);
    if (!selectedItems.length) return;
    refundLoading.value = true;
    router.post(
        SaleController.refund.url(props.sale.id),
        {
            reason: refundReason.value,
            items: selectedItems.map(i => ({ sale_item_id: i.sale_item_id, quantity: i.quantity })),
        },
        {
            onSuccess: () => { showRefundModal.value = false; },
            onFinish:  () => { refundLoading.value = false; },
        },
    );
}

// ── Email receipt ────────────────────────────────────────────────────────────
const showEmailModal  = ref(false);
const emailAddress    = ref(props.sale.customer?.email ?? '');
const emailLoading    = ref(false);
const emailSent       = ref(false);

function sendEmailReceipt() {
    emailLoading.value = true;
    router.post(
        SaleController.emailReceipt.url(props.sale.id),
        { email: emailAddress.value },
        {
            onSuccess: () => { emailSent.value = true; showEmailModal.value = false; },
            onFinish:  () => { emailLoading.value = false; },
        },
    );
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'long', timeStyle: 'short' });
function formatDt(s: string): string { return dtf.format(new Date(s)); }

const statusClasses: Record<string, string> = {
    completed:          'bg-green-100 text-green-700',
    void:               'bg-red-100 text-red-700',
    refunded:           'bg-orange-100 text-orange-700',
    partially_refunded: 'bg-amber-100 text-amber-700',
    held:               'bg-yellow-100 text-yellow-700',
};

const statusLabels: Record<string, string> = {
    completed:          'Completed',
    void:               'Voided',
    refunded:           'Refunded',
    partially_refunded: 'Partially Refunded',
    held:               'On Hold',
};

const paymentLabels: Record<string, string> = {
    cash:  'Cash',
    card:  'Card',
    gcash: 'GCash',
    maya:  'Maya',
};

const vatTypeLabels: Record<string, string> = {
    vatable:    'VATable',
    vat_exempt: 'VAT Exempt',
    zero_rated: 'Zero Rated',
};
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Sales History', href: SaleController.index.url() },
        { title: sale.receipt_number, href: SaleController.show.url(sale.id) },
    ]">
        <div class="p-6 space-y-6 max-w-4xl">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-bold font-mono">{{ sale.receipt_number }}</h1>
                        <span
                            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                            :class="statusClasses[sale.status] ?? 'bg-muted text-muted-foreground'"
                        >{{ statusLabels[sale.status] ?? sale.status }}</span>
                    </div>
                    <p class="text-muted-foreground text-sm mt-0.5">{{ formatDt(sale.created_at) }}</p>
                </div>

                <div class="flex gap-2">
                    <Button
                        v-if="sale.status !== 'void'"
                        variant="outline"
                        size="sm"
                        as-child
                    >
                        <a :href="SaleController.receipt.url({ sale: sale.id })" target="_blank">
                            <Printer class="mr-1.5 h-4 w-4" />
                            Print Receipt
                        </a>
                    </Button>
                    <Button
                        v-if="sale.status === 'completed'"
                        variant="outline"
                        size="sm"
                        @click="showEmailModal = true"
                    >
                        <Mail class="mr-1.5 h-4 w-4" />
                        Email Receipt
                    </Button>
                    <Button
                        v-if="canRefund && (sale.status === 'completed' || sale.status === 'partially_refunded')"
                        variant="outline"
                        size="sm"
                        @click="openRefundModal"
                    >Process Refund</Button>
                    <Button
                        v-if="canVoid && sale.status === 'completed'"
                        variant="destructive"
                        size="sm"
                        @click="showVoidModal = true"
                    >Void Sale</Button>
                </div>
            </div>

            <!-- Void info banner -->
            <div
                v-if="sale.status === 'void'"
                class="rounded-xl border border-red-200 bg-red-50 p-4 space-y-1"
            >
                <p class="font-semibold text-red-700 text-sm">This sale has been voided</p>
                <p v-if="sale.void_reason" class="text-red-600 text-sm">Reason: {{ sale.void_reason }}</p>
                <p v-if="sale.voided_at" class="text-red-500 text-xs">
                    Voided {{ formatDt(sale.voided_at) }}
                    <span v-if="sale.voidedBy"> by {{ (sale as any).voidedBy?.name }}</span>
                </p>
            </div>

            <!-- Partial refund banner -->
            <div
                v-if="sale.status === 'partially_refunded'"
                class="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1"
            >
                <p class="font-semibold text-amber-700 text-sm">This sale has been partially refunded</p>
                <p class="text-amber-600 text-xs">Some items have been refunded. You may still process additional refunds for remaining items.</p>
            </div>

            <!-- Sale info -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Cashier</p>
                    <p class="font-medium text-sm">{{ sale.cashier?.name ?? '—' }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Customer</p>
                    <p class="font-medium text-sm">{{ sale.customer?.name ?? 'Walk-in' }}</p>
                </div>
                <div v-if="sale.sc_id_no || sale.pwd_id_no" class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">SC / PWD</p>
                    <p class="font-medium text-sm">
                        {{ sale.sc_name ?? sale.pwd_name }}
                        <span class="text-muted-foreground font-normal">({{ sale.sc_id_no ?? sale.pwd_id_no }})</span>
                    </p>
                </div>
            </div>

            <!-- Line items -->
            <div class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold text-sm">Items</h2>
                </div>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2 font-medium">Product</th>
                            <th class="px-4 py-2 font-medium">Type</th>
                            <th class="px-4 py-2 font-medium text-right">Unit Price</th>
                            <th class="px-4 py-2 font-medium text-right">Qty</th>
                            <th class="px-4 py-2 font-medium text-right">Discount</th>
                            <th class="px-4 py-2 font-medium text-right">Line Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="item in sale.items" :key="item.id" class="hover:bg-muted/20">
                            <td class="px-4 py-2.5">
                                <div class="font-medium">{{ item.product_name }}</div>
                                <div class="text-muted-foreground text-xs">{{ item.product_sku }}</div>
                            </td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ vatTypeLabels[item.vat_type] }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums">{{ peso(item.unit_price) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums">{{ item.quantity }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                                {{ item.discount_amount > 0 ? `(${peso(item.discount_amount)})` : '—' }}
                            </td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-medium">{{ peso(item.line_total) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Totals + Payments -->
            <div class="grid gap-4 sm:grid-cols-2">
                <!-- Sale totals -->
                <div class="rounded-xl border p-4 space-y-2 text-sm">
                    <h2 class="font-semibold mb-3">Sale Summary</h2>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Subtotal</span>
                        <span class="tabular-nums">{{ peso(sale.subtotal) }}</span>
                    </div>
                    <div v-if="sale.discount_amount > 0" class="flex justify-between text-red-600">
                        <span>Discount</span>
                        <span class="tabular-nums">({{ peso(sale.discount_amount) }})</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">VAT (12%)</span>
                        <span class="tabular-nums">{{ peso(sale.vat_amount) }}</span>
                    </div>
                    <div class="border-t pt-2 flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span class="tabular-nums">{{ peso(sale.total_amount) }}</span>
                    </div>
                    <div v-if="sale.amount_tendered > 0" class="flex justify-between text-muted-foreground">
                        <span>Tendered</span>
                        <span class="tabular-nums">{{ peso(sale.amount_tendered) }}</span>
                    </div>
                    <div v-if="sale.change_amount > 0" class="flex justify-between text-muted-foreground">
                        <span>Change</span>
                        <span class="tabular-nums">{{ peso(sale.change_amount) }}</span>
                    </div>
                </div>

                <!-- Payments -->
                <div class="rounded-xl border p-4 space-y-2 text-sm">
                    <h2 class="font-semibold mb-3">Payments</h2>
                    <div
                        v-for="payment in sale.payments"
                        :key="payment.id"
                        class="flex justify-between items-start"
                    >
                        <div>
                            <span class="font-medium">{{ paymentLabels[payment.payment_method] ?? payment.payment_method }}</span>
                            <span
                                v-if="payment.reference_number"
                                class="ml-2 text-muted-foreground font-mono text-xs"
                            >{{ payment.reference_number }}</span>
                        </div>
                        <span class="tabular-nums font-medium">{{ peso(payment.amount) }}</span>
                    </div>
                    <p v-if="!sale.payments?.length" class="text-muted-foreground">No payment records.</p>
                </div>
            </div>

            <!-- BIR VAT breakdown -->
            <div class="rounded-xl border p-4">
                <h2 class="font-semibold text-sm mb-3">BIR VAT Breakdown</h2>
                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p class="text-muted-foreground text-xs">VATable Sales</p>
                        <p class="font-medium tabular-nums">{{ peso(sale.vatable_sales) }}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground text-xs">VAT Amount (12%)</p>
                        <p class="font-medium tabular-nums">{{ peso(sale.vat_amount) }}</p>
                    </div>
                    <div>
                        <p class="text-muted-foreground text-xs">VAT Exempt</p>
                        <p class="font-medium tabular-nums">{{ peso(sale.vat_exempt_sales) }}</p>
                    </div>
                </div>
            </div>

            <!-- Refund records -->
            <div v-if="(sale as any).refunds?.length" class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold text-sm">Refund Transactions</h2>
                </div>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2 font-medium">Receipt #</th>
                            <th class="px-4 py-2 font-medium">Date</th>
                            <th class="px-4 py-2 font-medium">Cashier</th>
                            <th class="px-4 py-2 font-medium text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="refund in (sale as any).refunds" :key="refund.id" class="hover:bg-muted/20">
                            <td class="px-4 py-2.5 font-mono text-xs">{{ refund.receipt_number }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ formatDt(refund.created_at) }}</td>
                            <td class="px-4 py-2.5">{{ refund.cashier?.name ?? '—' }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-medium text-red-600">
                                ({{ peso(refund.total_amount) }})
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Notes -->
            <div v-if="sale.notes" class="rounded-xl border p-4 text-sm">
                <p class="text-muted-foreground text-xs mb-1">Notes</p>
                <p>{{ sale.notes }}</p>
            </div>
        </div>

        <!-- Refund modal -->
        <Dialog v-model:open="showRefundModal">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Process Refund — {{ sale.receipt_number }}</DialogTitle>
                </DialogHeader>

                <div class="space-y-4 py-2">
                    <!-- Items table -->
                    <div class="rounded-lg border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2 font-medium">Product</th>
                                    <th class="px-3 py-2 font-medium text-right">Unit Price</th>
                                    <th class="px-3 py-2 font-medium text-center">Available</th>
                                    <th class="px-3 py-2 font-medium text-center w-28">Qty to Refund</th>
                                    <th class="px-3 py-2 font-medium text-right">Refund Amt</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="item in refundItems" :key="item.sale_item_id" class="hover:bg-muted/20">
                                    <td class="px-3 py-2">
                                        <div class="font-medium">{{ item.name }}</div>
                                        <div class="text-muted-foreground text-xs font-mono">{{ item.sku }}</div>
                                    </td>
                                    <td class="px-3 py-2 text-right tabular-nums text-muted-foreground">{{ peso(item.unit_refund) }}</td>
                                    <td class="px-3 py-2 text-center tabular-nums">{{ item.max_quantity }}</td>
                                    <td class="px-3 py-2 text-center">
                                        <input
                                            v-model.number="item.quantity"
                                            type="number"
                                            :min="0"
                                            :max="item.max_quantity"
                                            class="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm text-center tabular-nums focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            :class="item.quantity > item.max_quantity ? 'border-destructive' : ''"
                                        />
                                    </td>
                                    <td class="px-3 py-2 text-right tabular-nums font-medium"
                                        :class="item.quantity > 0 ? 'text-red-600' : 'text-muted-foreground'"
                                    >{{ item.quantity > 0 ? `(${peso(item.unit_refund * item.quantity)})` : '—' }}</td>
                                </tr>
                                <tr v-if="!refundItems.length">
                                    <td colspan="5" class="px-3 py-6 text-center text-muted-foreground text-sm">All items have already been refunded.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Refund total -->
                    <div v-if="refundTotal > 0" class="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                        <span class="text-sm font-medium text-red-700">Total Refund Amount</span>
                        <span class="text-lg font-bold text-red-700 tabular-nums">({{ peso(refundTotal) }})</span>
                    </div>

                    <!-- Reason -->
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">
                            Reason <span class="text-destructive">*</span>
                            <span class="text-muted-foreground font-normal text-xs ml-1">(min. 5 characters)</span>
                        </label>
                        <textarea
                            v-model="refundReason"
                            placeholder="Reason for refund (e.g. Defective item, customer returned)"
                            rows="2"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" @click="showRefundModal = false">Cancel</Button>
                    <Button
                        variant="destructive"
                        :disabled="!canSubmitRefund || refundLoading"
                        @click="submitRefund"
                    >{{ refundLoading ? 'Processing…' : 'Confirm Refund' }}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Void modal -->
        <Dialog v-model:open="showVoidModal">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Void Sale</DialogTitle>
                </DialogHeader>
                <div class="space-y-3 py-2">
                    <p class="text-sm text-muted-foreground">
                        You are about to void <strong class="font-mono">{{ sale.receipt_number }}</strong>.
                        This action cannot be undone. Stock will be restored.
                    </p>
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">Reason <span class="text-red-500">*</span></label>
                        <textarea
                            v-model="voidReason"
                            placeholder="Enter void reason..."
                            rows="3"
                            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" @click="showVoidModal = false">Cancel</Button>
                    <Button
                        variant="destructive"
                        :disabled="!voidReason.trim() || voidLoading"
                        @click="submitVoid"
                    >{{ voidLoading ? 'Voiding…' : 'Confirm Void' }}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Email Receipt modal -->
        <Dialog v-model:open="showEmailModal">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Email Receipt</DialogTitle>
                </DialogHeader>
                <div class="space-y-3 py-2">
                    <p class="text-sm text-muted-foreground">
                        Send receipt <strong class="font-mono">{{ sale.receipt_number }}</strong> to an email address.
                    </p>
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">Email Address</label>
                        <Input v-model="emailAddress" type="email" placeholder="customer@example.com" />
                    </div>
                    <p v-if="emailSent" class="text-sm text-green-600">Receipt sent successfully!</p>
                </div>
                <DialogFooter>
                    <Button variant="ghost" @click="showEmailModal = false">Cancel</Button>
                    <Button
                        :disabled="!emailAddress.trim() || emailLoading"
                        @click="sendEmailReceipt"
                    >{{ emailLoading ? 'Sending…' : 'Send Receipt' }}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
