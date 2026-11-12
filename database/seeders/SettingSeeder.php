<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            // Business
            ['key' => 'business_name',    'group' => 'business', 'label' => 'Business Name',       'value' => 'My Store'],
            ['key' => 'business_address', 'group' => 'business', 'label' => 'Address',              'value' => '123 Main Street, Manila, Philippines'],
            ['key' => 'business_phone',   'group' => 'business', 'label' => 'Phone',                'value' => '+63 2 1234 5678'],
            ['key' => 'business_tin',     'group' => 'business', 'label' => 'TIN',                  'value' => '123-456-789-000'],
            ['key' => 'business_email',   'group' => 'business', 'label' => 'Email',                'value' => 'info@mystore.com'],
            ['key' => 'vat_registered',   'group' => 'business', 'label' => 'VAT Registered',       'value' => 'true'],

            // Tax
            ['key' => 'vat_inclusive',    'group' => 'tax',      'label' => 'Prices are VAT-inclusive', 'value' => 'true'],
            ['key' => 'vat_rate',         'group' => 'tax',      'label' => 'VAT Rate (%)',          'value' => '12'],

            // Currency
            ['key' => 'currency_code',    'group' => 'currency', 'label' => 'Currency Code',        'value' => 'PHP'],
            ['key' => 'currency_symbol',  'group' => 'currency', 'label' => 'Currency Symbol',      'value' => '₱'],

            // Receipt
            ['key' => 'receipt_prefix',    'group' => 'receipt', 'label' => 'Receipt Number Prefix', 'value' => 'OR'],
            ['key' => 'receipt_header',    'group' => 'receipt', 'label' => 'Receipt Header',        'value' => 'Thank you for shopping!'],
            ['key' => 'receipt_footer',    'group' => 'receipt', 'label' => 'Receipt Footer',        'value' => 'Please come again.'],
            ['key' => 'receipt_paper_size','group' => 'receipt', 'label' => 'Paper Size',            'value' => '80mm'],
            ['key' => 'show_vat_breakdown','group' => 'receipt', 'label' => 'Show VAT Breakdown',    'value' => 'true'],

            // Loyalty
            ['key' => 'loyalty_enabled',   'group' => 'loyalty', 'label' => 'Enable Loyalty Points', 'value' => 'false'],
            ['key' => 'loyalty_earn_rate', 'group' => 'loyalty', 'label' => 'Centavos per Point',    'value' => '10000'],
            ['key' => 'loyalty_redeem_rate','group' => 'loyalty','label' => 'Centavos per Point Redeemed', 'value' => '100'],

            // System
            ['key' => 'session_timeout',       'group' => 'system', 'label' => 'Session Timeout (min)',     'value' => '30'],
            ['key' => 'max_cashier_discount_pct','group' => 'system','label' => 'Max Cashier Discount (bps)','value' => '500'],
        ];

        foreach ($defaults as $setting) {
            Setting::firstOrCreate(
                ['key' => $setting['key']],
                ['group' => $setting['group'], 'label' => $setting['label'], 'value' => $setting['value']]
            );
        }
    }
}
