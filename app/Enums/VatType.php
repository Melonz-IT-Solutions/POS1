<?php

namespace App\Enums;

enum VatType: string
{
    case Vatable   = 'vatable';
    case VatExempt = 'vat_exempt';
    case ZeroRated = 'zero_rated';

    public function label(): string
    {
        return match ($this) {
            self::Vatable   => 'VATable (12%)',
            self::VatExempt => 'VAT-Exempt',
            self::ZeroRated => 'Zero-Rated',
        };
    }
}
