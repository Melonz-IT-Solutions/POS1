import { useSettingsStore } from '@/stores/settings';

export function useCurrency() {
    const settings = useSettingsStore();

    function format(centavos: number): string {
        const pesos = centavos / 100;
        const symbol = settings.currencySymbol;

        return `${symbol}${pesos.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    function toCentavos(pesos: number | string): number {
        return Math.round(parseFloat(String(pesos)) * 100);
    }

    function toPesos(centavos: number): number {
        return centavos / 100;
    }

    function formatPesos(pesos: number): string {
        return format(Math.round(pesos * 100));
    }

    return { format, toCentavos, toPesos, formatPesos };
}
