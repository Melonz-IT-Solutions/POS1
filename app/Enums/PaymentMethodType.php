<?php

namespace App\Enums;

enum PaymentMethodType: string
{
    case Cash          = 'cash';
    case Card          = 'card';
    case DigitalWallet = 'digital_wallet';
    case Other         = 'other';
}
