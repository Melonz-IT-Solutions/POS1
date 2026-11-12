import type { VatType } from '@/types/models';
import { useSettingsStore } from '@/stores/settings';

export interface VatCalculation {
    vatBase: number;      // net amount (excl. VAT), centavos
    vatAmount: number;    // VAT portion, centavos
    gross: number;        // gross amount (incl. VAT), centavos
}

export function useTax() {
    const settings = useSettingsStore();

    function calculate(amountCentavos: number, vatType: VatType): VatCalculation {
        if (vatType === 'vat_exempt' || vatType === 'zero_rated') {
            return { vatBase: amountCentavos, vatAmount: 0, gross: amountCentavos };
        }

        const rate = settings.vatRate; // e.g., 12
        const isInclusive = settings.vatInclusive;

        if (isInclusive) {
            const divisor = 100 + rate;
            const vatBase = Math.round((amountCentavos * 100) / divisor);
            const vatAmount = amountCentavos - vatBase;
            return { vatBase, vatAmount, gross: amountCentavos };
        } else {
            const vatAmount = Math.round((amountCentavos * rate) / 100);
            return { vatBase: amountCentavos, vatAmount, gross: amountCentavos + vatAmount };
        }
    }

    /**
     * BIR Senior/PWD: 20% discount on VAT-exclusive base price, then VAT-exempt.
     * Returns the final price (no VAT, 20% off net base).
     */
    function applySeniorPwdDiscount(grossCentavos: number, vatType: VatType): number {
        const { vatBase } = calculate(grossCentavos, vatType);
        return Math.round(vatBase * 0.8);
    }

    return { calculate, applySeniorPwdDiscount };
}
