<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { usePosStore } from '@/stores/pos';
import { useSettingsStore } from '@/stores/settings';
import { useCurrency } from '@/composables/useCurrency';
import type { DiscountType } from '@/types/models';

const cart     = useCartStore();
const pos      = usePosStore();
const settings = useSettingsStore();
const { format } = useCurrency();

const type   = ref<DiscountType>('percentage');
const value  = ref('');
const error  = ref('');

function computedAmount() {
    const v   = parseFloat(value.value) || 0;
    const sub = cart.summary.subtotal;
    if (type.value === 'percentage') {
        const basisPoints = Math.round(v * 100);
        // Cashier limit check
        if (basisPoints > settings.maxCashierDisc) {
            return null; // requires supervisor
        }
        return Math.round((sub * basisPoints) / 10000);
    }
    return Math.min(Math.round(v * 100), sub);
}

function apply() {
    error.value = '';
    const v     = parseFloat(value.value) || 0;
    if (v <= 0) {
        error.value = 'Enter a discount value.';
        return;
    }

    if (type.value === 'percentage') {
        const basisPoints = Math.round(v * 100);
        if (basisPoints > settings.maxCashierDisc) {
            // Needs supervisor
            pos.requireSupervisor(() => {
                cart.setDiscount('percentage', basisPoints);
                pos.closeModal();
            }, `Discount of ${v}% exceeds the cashier limit. Supervisor authorization needed.`);
            return;
        }
        cart.setDiscount('percentage', basisPoints);
    } else {
        cart.setDiscount('fixed', Math.round(v * 100));
    }

    pos.closeModal();
}

function clear() {
    cart.setDiscount(null, 0);
    pos.closeModal();
}

watch(() => pos.activeModal, (modal) => {
    if (modal === 'discount') {
        type.value  = 'percentage';
        value.value = cart.discount.type === 'percentage'
            ? String(cart.discount.value / 100)
            : String(cart.discount.value / 100);
        error.value = '';
    }
});
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="bg-background w-full max-w-sm rounded-xl border shadow-2xl">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold">Apply Discount</h2>
                <button @click="pos.closeModal" class="text-muted-foreground hover:text-foreground">×</button>
            </div>

            <div class="space-y-4 p-5">
                <!-- Type toggle -->
                <div class="flex rounded-lg border p-1">
                    <button
                        :class="type === 'percentage' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'"
                        class="flex-1 rounded-md py-1.5 text-sm font-medium transition-colors"
                        @click="type = 'percentage'">
                        Percentage (%)
                    </button>
                    <button
                        :class="type === 'fixed' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'"
                        class="flex-1 rounded-md py-1.5 text-sm font-medium transition-colors"
                        @click="type = 'fixed'">
                        Fixed Amount
                    </button>
                </div>

                <!-- Value input -->
                <div>
                    <input
                        v-model="value"
                        v-focus
                        :placeholder="type === 'percentage' ? 'e.g. 10 for 10%' : 'e.g. 50 for ₱50'"
                        class="border-input bg-background w-full rounded-lg border px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                        type="number"
                        min="0"
                        step="0.01" />
                </div>

                <div v-if="error" class="text-destructive text-sm">{{ error }}</div>

                <!-- Preview -->
                <div v-if="value && computedAmount() !== null"
                    class="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                    Discount: {{ format(computedAmount()!) }}
                    → Total: {{ format(cart.summary.subtotal - computedAmount()!) }}
                </div>
                <div v-else-if="value && type === 'percentage' && parseFloat(value) * 100 > settings.maxCashierDisc"
                    class="text-warning rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                    Above cashier limit — supervisor PIN required.
                </div>
            </div>

            <div class="flex gap-2 border-t px-5 py-4">
                <button
                    class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                    @click="clear">
                    Remove
                </button>
                <div class="flex-1" />
                <button
                    class="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                    @click="pos.closeModal">
                    Cancel
                </button>
                <button
                    class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-2 text-sm font-semibold"
                    @click="apply">
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>
