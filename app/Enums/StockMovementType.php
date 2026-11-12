<?php

namespace App\Enums;

enum StockMovementType: string
{
    case Sale             = 'sale';
    case Refund           = 'refund';
    case Void             = 'void';
    case PurchaseReceipt  = 'purchase_receipt';
    case ManualAdjustment = 'manual_adjustment';
    case DamageLoss       = 'damage_loss';
    case InitialStock     = 'initial_stock';

    public function label(): string
    {
        return match ($this) {
            self::Sale             => 'Sale',
            self::Refund           => 'Refund',
            self::Void             => 'Void',
            self::PurchaseReceipt  => 'Purchase Receipt',
            self::ManualAdjustment => 'Manual Adjustment',
            self::DamageLoss       => 'Damage / Loss',
            self::InitialStock     => 'Initial Stock',
        };
    }

    public function direction(): int
    {
        return match ($this) {
            self::Sale, self::DamageLoss  => -1,
            self::Refund, self::Void, self::PurchaseReceipt, self::InitialStock => 1,
            self::ManualAdjustment => 0, // can be either
        };
    }
}
