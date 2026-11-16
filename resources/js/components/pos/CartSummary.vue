<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { useCurrency } from '@/composables/useCurrency';
import CurrencyDisplay from '@/components/common/CurrencyDisplay.vue';

const cart   = useCartStore();
const { format } = useCurrency();
</script>

<template>
    <div class="space-y-1 px-4 py-3 text-sm">
        <div class="flex justify-between">
            <span class="text-muted-foreground">Subtotal</span>
            <CurrencyDisplay :centavos="cart.summary.subtotal" />
        </div>

        <div v-if="cart.summary.discount_amount > 0" class="flex justify-between text-green-600">
            <span class="flex items-center gap-1.5">
                Discount
                <span
                    v-if="cart.isSeniorPwd"
                    class="rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                >SC/PWD 20%</span>
            </span>
            <span>-{{ format(cart.summary.discount_amount) }}</span>
        </div>
        <div v-if="cart.forceVatExempt" class="text-xs text-emerald-600 dark:text-emerald-400 flex justify-between">
            <span>VAT Exempt (SC/PWD)</span>
            <span>applied</span>
        </div>

        <div class="text-muted-foreground border-t pt-1 mt-1 space-y-0.5 text-xs">
            <div class="flex justify-between">
                <span>VATable Sales</span>
                <CurrencyDisplay :centavos="cart.summary.vatable_sales" />
            </div>
            <div v-if="cart.summary.vat_exempt_sales > 0" class="flex justify-between">
                <span>VAT-Exempt Sales</span>
                <CurrencyDisplay :centavos="cart.summary.vat_exempt_sales" />
            </div>
            <div v-if="cart.summary.zero_rated_sales > 0" class="flex justify-between">
                <span>Zero-Rated Sales</span>
                <CurrencyDisplay :centavos="cart.summary.zero_rated_sales" />
            </div>
            <div class="flex justify-between">
                <span>VAT (12%)</span>
                <CurrencyDisplay :centavos="cart.summary.vat_amount" />
            </div>
        </div>

        <div class="border-t pt-2 mt-1 flex justify-between text-base font-bold">
            <span>TOTAL DUE</span>
            <CurrencyDisplay :centavos="cart.summary.total_amount" class="text-primary" />
        </div>
    </div>
</template>
