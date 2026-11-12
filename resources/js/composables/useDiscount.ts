import type { DiscountType } from '@/types/models';

export function useDiscount() {
    function calculate(type: DiscountType, value: number, amount: number): number {
        if (type === 'percentage') {
            // value is in basis points (5000 = 50%)
            return Math.round((amount * value) / 10000);
        }
        if (type === 'fixed') {
            return Math.min(value, amount);
        }
        return 0;
    }

    function percentageFromBasisPoints(basisPoints: number): number {
        return basisPoints / 100;
    }

    function basisPointsFromPercentage(percentage: number): number {
        return Math.round(percentage * 100);
    }

    return { calculate, percentageFromBasisPoints, basisPointsFromPercentage };
}
