import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { POSSettings } from '@/types/pos';

export const useSettingsStore = defineStore('settings', () => {
    const businessName  = ref('POS System');
    const receiptPrefix = ref('OR');
    const vatInclusive  = ref(true);
    const vatRate       = ref(12);
    const currencySymbol = ref('₱');
    const loyaltyEnabled     = ref(false);
    const loyaltyRedeemRate  = ref(100); // centavos per point
    const maxCashierDisc = ref(500); // basis points

    function initialize(settings: POSSettings) {
        businessName.value  = settings.business_name;
        receiptPrefix.value = settings.receipt_prefix;
        vatInclusive.value  = settings.vat_inclusive;
        vatRate.value       = settings.vat_rate;
        currencySymbol.value = settings.currency_symbol;
        loyaltyEnabled.value    = settings.loyalty_enabled;
        loyaltyRedeemRate.value = settings.loyalty_redeem_rate ?? 100;
        maxCashierDisc.value    = settings.max_cashier_disc;
    }

    const maxCashierDiscPercent = computed(() => maxCashierDisc.value / 100);

    return {
        businessName, receiptPrefix, vatInclusive, vatRate,
        currencySymbol, loyaltyEnabled, loyaltyRedeemRate, maxCashierDisc,
        maxCashierDiscPercent, initialize,
    };
});
