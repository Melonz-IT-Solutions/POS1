<?php

namespace App\Enums;

enum SaleStatus: string
{
    case Completed = 'completed';
    case Held      = 'held';
    case Void      = 'void';
    case Refunded  = 'refunded';
    case PartiallyRefunded = 'partially_refunded';

    public function label(): string
    {
        return match ($this) {
            self::Completed         => 'Completed',
            self::Held              => 'On Hold',
            self::Void              => 'Voided',
            self::Refunded          => 'Refunded',
            self::PartiallyRefunded => 'Partially Refunded',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Completed         => 'green',
            self::Held              => 'yellow',
            self::Void              => 'red',
            self::Refunded          => 'orange',
            self::PartiallyRefunded => 'orange',
        };
    }
}
