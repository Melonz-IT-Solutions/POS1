<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            SettingSeeder::class,
            AdminUserSeeder::class,
            PaymentMethodSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            CustomerSeeder::class,
        ]);
    }
}
