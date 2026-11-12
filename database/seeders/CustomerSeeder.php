<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name'          => 'Maria Santos',
                'phone'         => '09171234567',
                'email'         => 'maria@example.com',
                'address'       => 'Quezon City, Metro Manila',
                'discount_rate' => 0,
                'loyalty_points'=> 150,
            ],
            [
                'name'          => 'Jose Reyes',
                'phone'         => '09281234567',
                'email'         => 'jose@example.com',
                'address'       => 'Makati City, Metro Manila',
                'discount_rate' => 500, // 5% regular customer discount
                'loyalty_points'=> 320,
            ],
            [
                'name'          => 'Ana Cruz',
                'phone'         => '09091234567',
                'email'         => null,
                'address'       => 'Pasig City, Metro Manila',
                'discount_rate' => 0,
                'loyalty_points'=> 0,
            ],
        ];

        foreach ($customers as $customer) {
            Customer::firstOrCreate(
                ['phone' => $customer['phone']],
                array_merge(['is_active' => true], $customer)
            );
        }
    }
}
