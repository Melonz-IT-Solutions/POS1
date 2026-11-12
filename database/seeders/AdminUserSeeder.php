<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@pos.com'],
            [
                'name'              => 'Administrator',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'status'            => 'active',
            ]
        );
        $admin->assignRole('Administrator');

        $manager = User::firstOrCreate(
            ['email' => 'manager@pos.com'],
            [
                'name'              => 'Store Manager',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'status'            => 'active',
            ]
        );
        $manager->assignRole('Manager');

        $cashier = User::firstOrCreate(
            ['email' => 'cashier@pos.com'],
            [
                'name'              => 'Cashier One',
                'password'          => Hash::make('password'),
                'email_verified_at' => now(),
                'status'            => 'active',
            ]
        );
        $cashier->assignRole('Cashier');
    }
}
