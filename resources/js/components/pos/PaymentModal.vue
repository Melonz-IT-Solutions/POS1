<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { usePosStore } from '@/stores/pos';
import { useSettingsStore } from '@/stores/settings';
import { useCurrency } from '@/composables/useCurrency';
import NumpadInput from './NumpadInput.vue';
import * as SaleController from '@/actions/App/Http/Controllers/POS/SaleController';
import type { PaymentEntry } from '@/types/pos';
import type { PaymentMethod } from '@/types/models';

const cart     = useCartStore();
const pos      = usePosStore();
const settings = useSettingsStore();
const { format } = useCurrency();

const payments   = ref<PaymentEntry[]>([]);
const activeMethod = ref<PaymentMethod | null>(null);
const currentAmount = ref(0);
const refNumber  = ref('');
const error      = ref('');
const success    = ref(false);

// ── Loyalty redemption state ───────────────────────────────────────────────
const loyaltyPointsInput = ref(cart.loyaltyRedemption.points);

const maxRedeemablePoints = computed(() => {
    if (!cart.customer || !settings.loyaltyEnabled) return 0;
    const maxByBalance  = cart.customer.loyalty_points;
    const maxByTotal    = Math.floor(cart.summary.total_amount / settings.loyaltyRedeemRate);
    return Math.min(maxByBalance, maxByTotal);
});

const loyaltyDiscount = computed(() =>
    loyaltyPointsInput.value * settings.loyaltyRedeemRate
);

function applyLoyaltyRedemption() {
    const pts = Math.min(loyaltyPointsInput.value, maxRedeemablePoints.value);
    loyaltyPointsInput.value = pts;
    cart.setLoyaltyRedemption(pts, settings.loyaltyRedeemRate);
}

function clearLoyaltyRedemption() {
    loyaltyPointsInput.value = 0;
    cart.setLoyaltyRedemption(0, settings.loyaltyRedeemRate);
}

const hasLoyalty = computed(() =>
    settings.loyaltyEnabled &&
    !!cart.customer &&
    (cart.customer.loyalty_points ?? 0) > 0
);

// ── Totals ─────────────────────────────────────────────────────────────────
const totalDue   = computed(() => Math.max(0, cart.summary.total_amount - cart.loyaltyRedemption.centavos));
const totalPaid  = computed(() => payments.value.reduce((s, p) => s + p.amount, 0));
const remaining  = computed(() => Math.max(0, totalDue.value - totalPaid.value));
const change     = computed(() => Math.max(0, totalPaid.value - totalDue.value));
const canConfirm = computed(() => totalPaid.value >= totalDue.value && !pos.isProcessing);

function selectMethod(method: PaymentMethod) {
    activeMethod.value  = method;
    currentAmount.value = remaining.value;
    refNumber.value     = '';
}

function addPayment() {
    if (!activeMethod.value || currentAmount.value <= 0) return;
    if (activeMethod.value.requires_reference && !refNumber.value.trim()) {
        error.value = 'Reference number is required for this payment method.';
        return;
    }
    error.value = '';
    payments.value.push({
        payment_method:   activeMethod.value.code,
        amount:           currentAmount.value,
        reference_number: refNumber.value || null,
    });
    currentAmount.value = 0;
    refNumber.value     = '';
    activeMethod.value  = null;
}

function removePayment(idx: number) {
    payments.value.splice(idx, 1);
}

async function confirm() {
    if (!canConfirm.value) return;

    pos.isProcessing = true;
    error.value = '';

    try {
        const payload = {
            items: cart.computedItems.map((item) => ({
                product_id:      item.product_id,
                product_name:    item.product_name,
                product_sku:     item.product_sku,
                product_barcode: item.product_barcode,
                unit_price:      item.unit_price,
                cost_price:      item.cost_price,
                vat_type:        item.vat_type,
                quantity:        item.quantity,
                discount_type:   item.discount_type,
                discount_value:  item.discount_value,
            })),
            payments: payments.value,
            customer_id:    cart.customer?.id ?? null,
            discount_type:  cart.discount.type,
            discount_value: cart.discount.value,
            notes:          cart.notes || null,
            sc_name:        cart.isSeniorPwd ? cart.seniorPwd.sc_name : null,
            sc_id_no:       cart.isSeniorPwd ? cart.seniorPwd.sc_id_no : null,
            pwd_name:       cart.isSeniorPwd ? cart.seniorPwd.pwd_name : null,
            pwd_id_no:      cart.isSeniorPwd ? cart.seniorPwd.pwd_id_no : null,
            redeem_points:  cart.loyaltyRedemption.points,
        };

        const csrfMeta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
        const res = await fetch('/pos/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '',
                ),
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            error.value = data.message ?? 'Sale failed. Please try again.';
            pos.isProcessing = false;
            return;
        }

        pos.setSaleCompleted(data.sale);
        success.value = true;
        cart.clearCart();
        payments.value = [];
    } catch (e) {
        error.value      = 'Network error. Please try again.';
        pos.isProcessing = false;
    }
}

function close() {
    if (success.value) {
        success.value = false;
    }
    clearLoyaltyRedemption();
    pos.closeModal();
    payments.value      = [];
    activeMethod.value  = null;
    currentAmount.value = 0;
    error.value         = '';
}

function printReceipt() {
    if (!pos.lastCompletedSale?.id) return;
    window.open(SaleController.receipt.url({ sale: pos.lastCompletedSale.id }), '_blank');
}

// Set default cash payment when modal opens
watch(
    () => pos.activeModal,
    (modal) => {
        if (modal === 'payment') {
            const cashMethod = pos.paymentMethods.find((m) => m.code === 'cash');
            if (cashMethod) selectMethod(cashMethod);
        }
    },
);
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="bg-background flex w-full max-w-2xl flex-col rounded-xl border shadow-2xl" style="max-height: 90vh">

            <!-- Header -->
            <div class="flex items-center justify-between border-b px-6 py-4">
                <h2 class="text-lg font-semibold">{{ success ? 'Sale Complete' : 'Process Payment' }}</h2>
                <button class="text-muted-foreground hover:text-foreground p-1" @click="close">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Success screen -->
            <div v-if="success" class="flex flex-col items-center gap-4 p-8 text-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <div class="text-2xl font-bold text-green-600">Payment Successful</div>
                    <div class="text-muted-foreground mt-1">
                        OR# {{ pos.lastCompletedSale?.receipt_number }}
                    </div>
                </div>
                <div v-if="pos.lastCompletedSale?.change_amount && pos.lastCompletedSale.change_amount > 0"
                    class="rounded-lg bg-blue-50 px-6 py-3 text-blue-800">
                    <div class="text-sm">Change</div>
                    <div class="text-3xl font-bold">{{ format(pos.lastCompletedSale.change_amount) }}</div>
                </div>
                <div class="flex gap-3 mt-2">
                    <button
                        class="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                        @click="printReceipt">
                        Print Receipt
                    </button>
                    <button
                        class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-2.5 text-sm font-medium"
                        @click="close">
                        New Sale
                    </button>
                </div>
            </div>

            <!-- Payment form -->
            <div v-else class="flex flex-1 overflow-hidden">

                <!-- Left: Payment methods + amount -->
                <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
                    <!-- Total -->
                    <div class="rounded-lg bg-primary/5 border border-primary/20 p-4 text-center">
                        <div class="text-muted-foreground text-sm">Total Due</div>
                        <div class="text-primary text-3xl font-bold">{{ format(totalDue) }}</div>
                        <div v-if="cart.loyaltyRedemption.centavos > 0" class="text-xs text-emerald-600 mt-1">
                            Points discount: -{{ format(cart.loyaltyRedemption.centavos) }}
                        </div>
                    </div>

                    <!-- Loyalty redemption -->
                    <div v-if="hasLoyalty" class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
                        <div class="flex items-center justify-between mb-2">
                            <div>
                                <span class="text-sm font-medium">Loyalty Points</span>
                                <span class="ml-2 text-xs text-muted-foreground">
                                    {{ cart.customer!.loyalty_points }} pts available
                                    ({{ format(cart.customer!.loyalty_points * settings.loyaltyRedeemRate) }})
                                </span>
                            </div>
                            <button
                                v-if="cart.loyaltyRedemption.points > 0"
                                class="text-xs text-destructive hover:underline"
                                @click="clearLoyaltyRedemption">
                                Clear
                            </button>
                        </div>
                        <div class="flex items-center gap-2">
                            <input
                                v-model.number="loyaltyPointsInput"
                                type="number"
                                min="0"
                                :max="maxRedeemablePoints"
                                class="border-input bg-background w-24 rounded border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="0"
                                @keydown.enter="applyLoyaltyRedemption"
                            />
                            <span class="text-xs text-muted-foreground">pts = {{ format(loyaltyDiscount) }}</span>
                            <button
                                :disabled="loyaltyPointsInput <= 0 || loyaltyPointsInput > maxRedeemablePoints"
                                class="rounded bg-amber-500 text-white px-3 py-1 text-xs font-medium hover:bg-amber-600 disabled:opacity-50 transition-colors"
                                @click="applyLoyaltyRedemption">
                                Apply
                            </button>
                            <button
                                class="text-xs text-muted-foreground hover:text-foreground"
                                @click="loyaltyPointsInput = maxRedeemablePoints; applyLoyaltyRedemption()">
                                Use all
                            </button>
                        </div>
                    </div>

                    <!-- Payment methods -->
                    <div>
                        <div class="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                            Payment Method
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <button
                                v-for="method in pos.paymentMethods"
                                :key="method.id"
                                :class="[
                                    'rounded-lg border p-3 text-sm font-medium transition-colors text-left',
                                    activeMethod?.id === method.id
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'hover:bg-muted',
                                ]"
                                type="button"
                                @click="selectMethod(method)">
                                {{ method.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Reference number (card/e-wallet) -->
                    <div v-if="activeMethod?.requires_reference">
                        <label class="text-muted-foreground mb-1 block text-xs font-medium uppercase tracking-wider">
                            Reference Number
                        </label>
                        <input
                            v-model="refNumber"
                            class="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Enter reference number" />
                    </div>

                    <!-- Existing payments -->
                    <div v-if="payments.length > 0" class="space-y-1">
                        <div class="text-muted-foreground text-xs font-medium uppercase tracking-wider">Payments</div>
                        <div
                            v-for="(p, idx) in payments"
                            :key="idx"
                            class="bg-muted/50 flex items-center justify-between rounded px-3 py-2 text-sm">
                            <span class="font-medium capitalize">{{ p.payment_method }}</span>
                            <div class="flex items-center gap-2">
                                <span>{{ format(p.amount) }}</span>
                                <button
                                    class="text-muted-foreground hover:text-destructive"
                                    type="button"
                                    @click="removePayment(idx)">×</button>
                            </div>
                        </div>
                        <div class="flex justify-between text-sm font-semibold pt-1 border-t">
                            <span>Total Paid</span>
                            <span class="text-green-600">{{ format(totalPaid) }}</span>
                        </div>
                        <div v-if="remaining > 0" class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Remaining</span>
                            <span class="text-orange-500 font-medium">{{ format(remaining) }}</span>
                        </div>
                        <div v-if="change > 0" class="flex justify-between text-sm">
                            <span class="text-muted-foreground">Change</span>
                            <span class="font-semibold text-blue-600">{{ format(change) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Right: Numpad -->
                <div class="flex flex-col border-l p-5" style="width: 320px">
                    <NumpadInput
                        v-if="activeMethod"
                        v-model="currentAmount"
                        :label="activeMethod.name + ' Amount'"
                        @done="addPayment" />
                    <button
                        v-if="activeMethod"
                        :disabled="currentAmount <= 0"
                        class="bg-secondary text-secondary-foreground hover:bg-secondary/80 mt-2 rounded-lg py-2.5 text-sm font-medium disabled:opacity-40"
                        type="button"
                        @click="addPayment">
                        + Add Payment
                    </button>
                </div>
            </div>

            <!-- Footer -->
            <div v-if="!success" class="flex gap-3 border-t px-6 py-4">
                <div v-if="error" class="text-destructive flex-1 text-sm">{{ error }}</div>
                <div v-else class="flex-1" />
                <button
                    class="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted"
                    @click="close">
                    Cancel
                </button>
                <button
                    :disabled="!canConfirm"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-40"
                    @click="confirm">
                    {{ pos.isProcessing ? 'Processing...' : 'Confirm Payment' }}
                </button>
            </div>
        </div>
    </div>
</template>
