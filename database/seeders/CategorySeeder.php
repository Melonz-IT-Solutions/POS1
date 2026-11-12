<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Beverages',      'sort_order' => 1],
            ['name' => 'Food',           'sort_order' => 2],
            ['name' => 'Personal Care',  'sort_order' => 3],
            ['name' => 'Household',      'sort_order' => 4],
            ['name' => 'Snacks',         'sort_order' => 5],
            ['name' => 'Dairy',          'sort_order' => 6],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($cat['name'])],
                array_merge($cat, ['is_active' => true])
            );
        }
    }
}
