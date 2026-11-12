<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            ['name' => 'Cash',  'code' => 'cash',  'type' => 'cash',           'requires_reference' => false, 'sort_order' => 1],
            ['name' => 'Card',  'code' => 'card',  'type' => 'card',           'requires_reference' => true,  'sort_order' => 2],
            ['name' => 'GCash', 'code' => 'gcash', 'type' => 'digital_wallet', 'requires_reference' => true,  'sort_order' => 3],
            ['name' => 'Maya',  'code' => 'maya',  'type' => 'digital_wallet', 'requires_reference' => true,  'sort_order' => 4],
        ];

        foreach ($methods as $method) {
            PaymentMethod::firstOrCreate(['code' => $method['code']], $method);
        }
    }
}
