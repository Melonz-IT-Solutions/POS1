<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $beverages = Category::where('slug', 'beverages')->first();
        $food      = Category::where('slug', 'food')->first();
        $snacks    = Category::where('slug', 'snacks')->first();
        $dairy     = Category::where('slug', 'dairy')->first();

        $products = [
            // Beverages
            [
                'category_id'   => $beverages?->id,
                'name'          => 'Coca-Cola 1.5L',
                'sku'           => 'BEV-001',
                'barcode'       => '4800888000003',
                'unit_of_measure' => 'bottle',
                'cost_price'    => 4500,   // ₱45.00
                'selling_price' => 6500,   // ₱65.00
                'stock_quantity'=> 50,
                'minimum_stock' => 10,
            ],
            [
                'category_id'   => $beverages?->id,
                'name'          => 'Mineral Water 500ml',
                'sku'           => 'BEV-002',
                'barcode'       => '4800888000010',
                'unit_of_measure' => 'bottle',
                'cost_price'    => 1500,
                'selling_price' => 2500,
                'stock_quantity'=> 100,
                'minimum_stock' => 20,
            ],
            [
                'category_id'   => $beverages?->id,
                'name'          => 'Milo 300ml',
                'sku'           => 'BEV-003',
                'barcode'       => '4800888000027',
                'unit_of_measure' => 'can',
                'cost_price'    => 2000,
                'selling_price' => 3500,
                'stock_quantity'=> 60,
                'minimum_stock' => 15,
            ],
            // Food
            [
                'category_id'   => $food?->id,
                'name'          => 'Pandesal (pack of 10)',
                'sku'           => 'FOD-001',
                'barcode'       => '4800888000034',
                'unit_of_measure' => 'pack',
                'cost_price'    => 2000,
                'selling_price' => 3000,
                'stock_quantity'=> 30,
                'minimum_stock' => 10,
                'vat_type'      => 'vat_exempt', // Basic food items are VAT-exempt in PH
            ],
            [
                'category_id'   => $food?->id,
                'name'          => 'Lucky Me Noodles',
                'sku'           => 'FOD-002',
                'barcode'       => '4800888000041',
                'unit_of_measure' => 'pack',
                'cost_price'    => 800,
                'selling_price' => 1500,
                'stock_quantity'=> 150,
                'minimum_stock' => 30,
                'vat_type'      => 'vat_exempt',
            ],
            // Snacks
            [
                'category_id'   => $snacks?->id,
                'name'          => "Piattos 85g",
                'sku'           => 'SNK-001',
                'barcode'       => '4800888000058',
                'unit_of_measure' => 'bag',
                'cost_price'    => 3500,
                'selling_price' => 5500,
                'stock_quantity'=> 80,
                'minimum_stock' => 20,
            ],
            [
                'category_id'   => $snacks?->id,
                'name'          => 'Nova 78g',
                'sku'           => 'SNK-002',
                'barcode'       => '4800888000065',
                'unit_of_measure' => 'bag',
                'cost_price'    => 2500,
                'selling_price' => 4000,
                'stock_quantity'=> 90,
                'minimum_stock' => 20,
            ],
            // Dairy
            [
                'category_id'   => $dairy?->id,
                'name'          => 'Bear Brand 300ml',
                'sku'           => 'DAI-001',
                'barcode'       => '4800888000072',
                'unit_of_measure' => 'can',
                'cost_price'    => 3200,
                'selling_price' => 4500,
                'stock_quantity'=> 40,
                'minimum_stock' => 10,
                'vat_type'      => 'vat_exempt',
            ],
            [
                'category_id'   => $dairy?->id,
                'name'          => 'Eden Cheese 165g',
                'sku'           => 'DAI-002',
                'barcode'       => '4800888000089',
                'unit_of_measure' => 'pack',
                'cost_price'    => 6500,
                'selling_price' => 8500,
                'stock_quantity'=> 25,
                'minimum_stock' => 8,
                'vat_type'      => 'vat_exempt',
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['sku' => $product['sku']],
                array_merge(['is_active' => true, 'vat_type' => 'vatable'], $product)
            );
        }
    }
}
