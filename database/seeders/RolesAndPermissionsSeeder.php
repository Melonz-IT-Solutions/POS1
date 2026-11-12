<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Sales
            'create sales', 'view sales', 'view own sales',
            'void sales', 'refund sales',

            // Products
            'create products', 'view products', 'edit products', 'delete products',
            'view cost prices',

            // Inventory
            'view inventory', 'adjust inventory',

            // Customers
            'create customers', 'view customers', 'edit customers', 'delete customers',

            // Suppliers
            'create suppliers', 'view suppliers', 'edit suppliers', 'delete suppliers',

            // Purchase Orders
            'create purchase orders', 'view purchase orders', 'receive goods',

            // Discounts
            'create discounts', 'view discounts', 'apply discounts',
            'apply discounts above limit',

            // Reports
            'view reports', 'view profit reports',

            // Users
            'create users', 'view users', 'edit users', 'delete users',

            // Categories
            'manage categories',

            // Settings
            'manage settings',

            // Shifts
            'manage shifts', 'view all shifts',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ── Administrator ──────────────────────────────────────────────
        $admin = Role::firstOrCreate(['name' => 'Administrator']);
        $admin->givePermissionTo(Permission::all());

        // ── Manager ───────────────────────────────────────────────────
        $manager = Role::firstOrCreate(['name' => 'Manager']);
        $manager->givePermissionTo([
            'create sales', 'view sales', 'view own sales',
            'void sales', 'refund sales',
            'view products', 'edit products', 'create products',
            'view cost prices',
            'manage categories',
            'view inventory', 'adjust inventory',
            'create customers', 'view customers', 'edit customers',
            'view suppliers', 'create suppliers', 'edit suppliers',
            'create purchase orders', 'view purchase orders', 'receive goods',
            'create discounts', 'view discounts', 'apply discounts', 'apply discounts above limit',
            'view reports', 'view profit reports',
            'manage shifts', 'view all shifts',
        ]);

        // ── Cashier ───────────────────────────────────────────────────
        $cashier = Role::firstOrCreate(['name' => 'Cashier']);
        $cashier->givePermissionTo([
            'create sales', 'view own sales',
            'view products',
            'view customers', 'create customers',
            'apply discounts',
            'manage shifts',
        ]);
    }
}
