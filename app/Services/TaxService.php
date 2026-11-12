<?php

namespace App\Services;

use App\Enums\VatType;
use App\Models\Setting;

class TaxService
{
    private const VAT_RATE = 12;

    public function isVatInclusive(): bool
    {
        return (bool) Setting::get('vat_inclusive', true);
    }

    public function vatRate(): int
    {
        return (int) Setting::get('vat_rate', self::VAT_RATE);
    }

    /**
     * Calculate VAT for an amount in centavos.
     *
     * Returns [vat_base, vat_amount, net_amount] all in centavos.
     * vat_base = amount excluding VAT (net)
     * vat_amount = VAT portion
     * net_amount = same as vat_base (amount excluding VAT)
     *
     * For VAT-inclusive:
     *   net = amount * 100 / (100 + rate)
     *   vat = amount * rate / (100 + rate)
     *
     * For VAT-exclusive:
     *   net = amount
     *   vat = amount * rate / 100
     */
    public function calculate(int $amountCentavos, VatType $vatType, ?bool $inclusive = null): array
    {
        $isInclusive = $inclusive ?? $this->isVatInclusive();
        $rate        = $this->vatRate();

        if ($vatType === VatType::VatExempt || $vatType === VatType::ZeroRated) {
            return [
                'vat_base'   => $amountCentavos,
                'vat_amount' => 0,
                'net_amount' => $amountCentavos,
                'gross'      => $amountCentavos,
            ];
        }

        if ($isInclusive) {
            // Price already includes VAT
            $divisor   = 100 + $rate;
            $netAmount = (int) round($amountCentavos * 100 / $divisor);
            $vatAmount = $amountCentavos - $netAmount;
        } else {
            // Price excludes VAT
            $netAmount = $amountCentavos;
            $vatAmount = (int) round($amountCentavos * $rate / 100);
        }

        return [
            'vat_base'   => $netAmount,
            'vat_amount' => $vatAmount,
            'net_amount' => $netAmount,
            'gross'      => $netAmount + $vatAmount,
        ];
    }

    /**
     * Apply Senior Citizen / PWD discount.
     * 20% off the VAT-exclusive base price (VAT is waived entirely).
     */
    public function applySeniorPwdDiscount(int $grossAmountCentavos, VatType $vatType): array
    {
        $vatCalc = $this->calculate($grossAmountCentavos, $vatType);
        $netBase = $vatCalc['vat_base'];

        // 20% discount on the VAT-exclusive amount
        $discountAmount = (int) round($netBase * 20 / 100);
        $finalPrice     = $netBase - $discountAmount;

        return [
            'original_gross' => $grossAmountCentavos,
            'net_base'       => $netBase,
            'discount_amount'=> $discountAmount,
            'final_price'    => $finalPrice,  // VAT-exempt price after SC/PWD discount
        ];
    }
}
