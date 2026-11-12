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
            <span>Discount</span>
            <span>-{{ format(cart.summary.discount_amount) }}</span>
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
