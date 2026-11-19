<?php

namespace Database\Seeders;

use App\Models\DemoProduct;
use Illuminate\Database\Seeder;

class DemoProductSeeder extends Seeder
{
    private const BASE = '/images/demo_products';

    private function img(string $folder, string $file): string
    {
        return self::BASE . '/' . $folder . '/' . $file;
    }

    public function run(): void
    {
        DemoProduct::truncate();

        $data = [

            /* ── Coffee Shop ─────────────────────────────────────────────── */
            ['store_type' => 'coffeeshop', 'name' => 'Espresso',               'sku' => 'COF-001', 'category' => 'Hot Drinks',   'price_cents' => 8000,  'stock' => 999, 'image_path' => $this->img('coffeeshop', 'espresso.webp')],
            ['store_type' => 'coffeeshop', 'name' => 'Americano',              'sku' => 'COF-002', 'category' => 'Hot Drinks',   'price_cents' => 9000,  'stock' => 999, 'image_path' => $this->img('coffeeshop', 'americano.jpeg')],
            ['store_type' => 'coffeeshop', 'name' => 'Cappuccino',             'sku' => 'COF-003', 'category' => 'Hot Drinks',   'price_cents' => 12000, 'stock' => 999, 'image_path' => $this->img('coffeeshop', 'cappucino.jpeg')],
            ['store_type' => 'coffeeshop', 'name' => 'Café Latte',             'sku' => 'COF-004', 'category' => 'Hot Drinks',   'price_cents' => 13000, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'coffeeshop', 'name' => 'Mocha',                  'sku' => 'COF-005', 'category' => 'Hot Drinks',   'price_cents' => 14000, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'coffeeshop', 'name' => 'Matcha Latte',           'sku' => 'COF-006', 'category' => 'Hot Drinks',   'price_cents' => 14500, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'coffeeshop', 'name' => 'Iced Americano',         'sku' => 'COF-007', 'category' => 'Cold Drinks',  'price_cents' => 11000, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'coffeeshop', 'name' => 'Iced Latte',             'sku' => 'COF-008', 'category' => 'Cold Drinks',  'price_cents' => 14000, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'coffeeshop', 'name' => 'Croissant',              'sku' => 'FOD-001', 'category' => 'Food',         'price_cents' => 8500,  'stock' => 20,  'image_path' => null],
            ['store_type' => 'coffeeshop', 'name' => 'Blueberry Muffin',       'sku' => 'FOD-002', 'category' => 'Food',         'price_cents' => 7500,  'stock' => 15,  'image_path' => null],
            ['store_type' => 'coffeeshop', 'name' => 'Club Sandwich',          'sku' => 'FOD-003', 'category' => 'Food',         'price_cents' => 18500, 'stock' => 10,  'image_path' => null],
            ['store_type' => 'coffeeshop', 'name' => 'Bottled Water 500ml',    'sku' => 'DRK-001', 'category' => 'Others',       'price_cents' => 2500,  'stock' => 50,  'image_path' => null],

            /* ── Pharmacy ─────────────────────────────────────────────── */
            ['store_type' => 'pharmacy', 'name' => 'Biogesic 500mg (10s)',       'sku' => 'RX-0001', 'category' => 'Analgesic',   'price_cents' => 1400,  'stock' => 200, 'image_path' => $this->img('pharmacy', 'biogseic.webp')],
            ['store_type' => 'pharmacy', 'name' => 'Alaxan FR (10s)',            'sku' => 'RX-0002', 'category' => 'Analgesic',   'price_cents' => 1350,  'stock' => 150, 'image_path' => $this->img('pharmacy', 'alaxan_fr.webp')],
            ['store_type' => 'pharmacy', 'name' => 'Neozep Forte (10s)',         'sku' => 'RX-0003', 'category' => 'Cold & Flu',  'price_cents' => 1300,  'stock' => 180, 'image_path' => null],
            ['store_type' => 'pharmacy', 'name' => 'Decolgen (10s)',             'sku' => 'RX-0004', 'category' => 'Cold & Flu',  'price_cents' => 1300,  'stock' => 180, 'image_path' => null],
            ['store_type' => 'pharmacy', 'name' => 'Diatabs (4s)',               'sku' => 'RX-0005', 'category' => 'GI',          'price_cents' => 1200,  'stock' => 120, 'image_path' => $this->img('pharmacy', 'diatabs.webp')],
            ['store_type' => 'pharmacy', 'name' => 'Kremil-S (10s)',             'sku' => 'RX-0006', 'category' => 'GI',          'price_cents' => 1200,  'stock' => 100, 'image_path' => null],
            ['store_type' => 'pharmacy', 'name' => 'Mefenamic Acid 500mg (10s)', 'sku' => 'RX-0007', 'category' => 'Analgesic',   'price_cents' => 1500,  'stock' => 150, 'image_path' => null],
            ['store_type' => 'pharmacy', 'name' => 'Betadine Solution 60ml',     'sku' => 'RX-0008', 'category' => 'Wound Care',  'price_cents' => 7500,  'stock' => 60,  'image_path' => null],
            ['store_type' => 'pharmacy', 'name' => 'Efficascent Oil 50ml',       'sku' => 'RX-0009', 'category' => 'Topical',     'price_cents' => 4500,  'stock' => 80,  'image_path' => null],
            ['store_type' => 'pharmacy', 'name' => 'Vicks VapoRub 25g',          'sku' => 'RX-0010', 'category' => 'Topical',     'price_cents' => 7500,  'stock' => 70,  'image_path' => null],

            /* ── Grocery ──────────────────────────────────────────────── */
            ['store_type' => 'grocery', 'name' => 'Jasmine Rice 2kg',            'sku' => 'GRO-001', 'category' => 'Staples',     'price_cents' => 11000, 'stock' => 300, 'image_path' => $this->img('wholesaler', 'jasmine_rice.jpg')],
            ['store_type' => 'grocery', 'name' => 'Lucky Me Pancit Canton',      'sku' => 'GRO-002', 'category' => 'Noodles',     'price_cents' => 1850,  'stock' => 500, 'image_path' => null],
            ['store_type' => 'grocery', 'name' => 'Bear Brand Pwdr. Milk 300g',  'sku' => 'GRO-003', 'category' => 'Dairy',       'price_cents' => 11000, 'stock' => 150, 'image_path' => null],
            ['store_type' => 'grocery', 'name' => 'Coca-Cola 1.5L',              'sku' => 'GRO-004', 'category' => 'Beverages',   'price_cents' => 8000,  'stock' => 200, 'image_path' => null],
            ['store_type' => 'grocery', 'name' => 'Gardenia Classic Loaf',       'sku' => 'GRO-005', 'category' => 'Bakery',      'price_cents' => 7800,  'stock' => 80,  'image_path' => $this->img('grocery', 'gardenia.png')],
            ['store_type' => 'grocery', 'name' => 'Century Tuna 155g',           'sku' => 'GRO-006', 'category' => 'Canned Goods','price_cents' => 3800,  'stock' => 400, 'image_path' => $this->img('grocery', 'centurytuna.jpg')],
            ['store_type' => 'grocery', 'name' => 'Surf Powder 1kg',             'sku' => 'GRO-007', 'category' => 'Household',   'price_cents' => 9500,  'stock' => 120, 'image_path' => null],
            ['store_type' => 'grocery', 'name' => 'Golden Fiesta Canola Oil 1L', 'sku' => 'GRO-008', 'category' => 'Staples',     'price_cents' => 11500, 'stock' => 150, 'image_path' => null],
            ['store_type' => 'grocery', 'name' => 'Del Monte Tomato Sauce 250g', 'sku' => 'GRO-009', 'category' => 'Canned Goods','price_cents' => 2600,  'stock' => 300, 'image_path' => $this->img('grocery', 'del_monte.png')],
            ['store_type' => 'grocery', 'name' => 'Magnolia Choco Milk 230ml',   'sku' => 'GRO-010', 'category' => 'Dairy',       'price_cents' => 2500,  'stock' => 180, 'image_path' => null],
            ['store_type' => 'grocery', 'name' => 'Purefoods Hotdog 1kg',        'sku' => 'GRO-011', 'category' => 'Deli',        'price_cents' => 18500, 'stock' => 60,  'image_path' => null],
            ['store_type' => 'grocery', 'name' => 'Rebisco Crackers (10s)',       'sku' => 'GRO-012', 'category' => 'Snacks',      'price_cents' => 2500,  'stock' => 300, 'image_path' => null],

            /* ── Laundry ──────────────────────────────────────────── (no images yet) */
            ['store_type' => 'laundry', 'name' => 'Wash & Dry (per kg)',          'sku' => 'LAU-001', 'category' => 'Self-Service','price_cents' => 6500,  'stock' => 999, 'image_path' => null],
            ['store_type' => 'laundry', 'name' => 'Wash, Dry & Fold (per kg)',    'sku' => 'LAU-002', 'category' => 'Full-Service','price_cents' => 8000,  'stock' => 999, 'image_path' => null],
            ['store_type' => 'laundry', 'name' => 'Dry Cleaning — Polo',          'sku' => 'LAU-003', 'category' => 'Dry Clean',   'price_cents' => 15000, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'laundry', 'name' => 'Dry Cleaning — Pants',         'sku' => 'LAU-004', 'category' => 'Dry Clean',   'price_cents' => 15000, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'laundry', 'name' => 'Dry Cleaning — Blazer',        'sku' => 'LAU-005', 'category' => 'Dry Clean',   'price_cents' => 25000, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'laundry', 'name' => 'Steam Press (per piece)',       'sku' => 'LAU-006', 'category' => 'Pressing',    'price_cents' => 3500,  'stock' => 999, 'image_path' => null],
            ['store_type' => 'laundry', 'name' => 'Blanket Wash',                 'sku' => 'LAU-007', 'category' => 'Bedding',     'price_cents' => 25000, 'stock' => 999, 'image_path' => null],
            ['store_type' => 'laundry', 'name' => 'Comforter Wash',               'sku' => 'LAU-008', 'category' => 'Bedding',     'price_cents' => 35000, 'stock' => 999, 'image_path' => null],

            /* ── Minimart ─────────────────── (updated to match available images) */
            ['store_type' => 'minimart', 'name' => 'Argentina Corned Beef 150g',  'sku' => 'MM-001', 'category' => 'Canned Goods', 'price_cents' => 4500,  'stock' => 200, 'image_path' => $this->img('minimart', 'argentina.png')],
            ['store_type' => 'minimart', 'name' => 'Samyang Buldak Spicy 140g',   'sku' => 'MM-002', 'category' => 'Noodles',      'price_cents' => 5500,  'stock' => 150, 'image_path' => $this->img('minimart', 'buldak.jpeg')],
            ['store_type' => 'minimart', 'name' => 'Oishi Prawn Crackers 50g',    'sku' => 'MM-003', 'category' => 'Snacks',       'price_cents' => 1800,  'stock' => 300, 'image_path' => $this->img('minimart', 'chip.jpg')],
            ['store_type' => 'minimart', 'name' => 'Nova Country Cheddar 78g',    'sku' => 'MM-004', 'category' => 'Snacks',       'price_cents' => 2000,  'stock' => 250, 'image_path' => $this->img('minimart', 'nova.jpg')],
            ['store_type' => 'minimart', 'name' => 'S-26 Gold Stage 3 1.2kg',     'sku' => 'MM-005', 'category' => 'Milk Formula', 'price_cents' => 48500, 'stock' => 30,  'image_path' => $this->img('minimart', 's36.avif')],
            ['store_type' => 'minimart', 'name' => 'Mie Sedap Chicken 85g',       'sku' => 'MM-006', 'category' => 'Noodles',      'price_cents' => 1800,  'stock' => 300, 'image_path' => $this->img('minimart', 'sedap.jpg')],
            ['store_type' => 'minimart', 'name' => 'Silka Papaya Soap 90g',       'sku' => 'MM-007', 'category' => 'Personal Care','price_cents' => 3500,  'stock' => 150, 'image_path' => $this->img('minimart', 'silka.webp')],
            ['store_type' => 'minimart', 'name' => 'Wafello Hazelnut 125g',       'sku' => 'MM-008', 'category' => 'Snacks',       'price_cents' => 4500,  'stock' => 120, 'image_path' => $this->img('minimart', 'wafello.webp')],
            ['store_type' => 'minimart', 'name' => 'Kopiko Brown 3-in-1',         'sku' => 'MM-009', 'category' => 'Beverages',    'price_cents' => 1200,  'stock' => 500, 'image_path' => null],
            ['store_type' => 'minimart', 'name' => 'C2 Apple Juice 350ml',        'sku' => 'MM-010', 'category' => 'Beverages',    'price_cents' => 2200,  'stock' => 250, 'image_path' => null],

            /* ── Hardware ─────────────────────────────────────────────── */
            ['store_type' => 'hardware', 'name' => 'CW Nails Assorted 1kg',      'sku' => 'HW-001', 'category' => 'Fasteners',    'price_cents' => 6500,  'stock' => 80,  'image_path' => null],
            ['store_type' => 'hardware', 'name' => 'PVC Pipe 1/2" x 6m',         'sku' => 'HW-002', 'category' => 'Plumbing',     'price_cents' => 18500, 'stock' => 50,  'image_path' => null],
            ['store_type' => 'hardware', 'name' => 'PVC Elbow 1/2"',             'sku' => 'HW-003', 'category' => 'Plumbing',     'price_cents' => 1200,  'stock' => 200, 'image_path' => null],
            ['store_type' => 'hardware', 'name' => 'G.I. Wire #16 1kg',          'sku' => 'HW-004', 'category' => 'Fasteners',    'price_cents' => 7500,  'stock' => 60,  'image_path' => null],
            ['store_type' => 'hardware', 'name' => 'Vulca Seal 250ml',           'sku' => 'HW-005', 'category' => 'Sealants',     'price_cents' => 12000, 'stock' => 40,  'image_path' => null],
            ['store_type' => 'hardware', 'name' => 'Sandpaper P80',              'sku' => 'HW-006', 'category' => 'Abrasives',    'price_cents' => 1500,  'stock' => 150, 'image_path' => $this->img('hardware', 'sandpaper.jpg')],
            ['store_type' => 'hardware', 'name' => 'Paint Brush 2"',             'sku' => 'HW-007', 'category' => 'Paint',        'price_cents' => 4500,  'stock' => 70,  'image_path' => $this->img('hardware', 'paint_brush.jpeg')],
            ['store_type' => 'hardware', 'name' => 'Hacksaw Blade (12")',         'sku' => 'HW-008', 'category' => 'Tools',        'price_cents' => 2500,  'stock' => 100, 'image_path' => null],
            ['store_type' => 'hardware', 'name' => 'Tape Measure 5m',            'sku' => 'HW-009', 'category' => 'Tools',        'price_cents' => 18500, 'stock' => 30,  'image_path' => null],
            ['store_type' => 'hardware', 'name' => 'Electrical Tape (black)',    'sku' => 'HW-010', 'category' => 'Electrical',   'price_cents' => 2500,  'stock' => 120, 'image_path' => $this->img('hardware', 'electrical_tape.jpg')],

            /* ── Wholesaler ───────────────────────────────────────────── */
            ['store_type' => 'wholesaler', 'name' => 'Lucky Me Noodles (case/48)', 'sku' => 'WHL-001', 'category' => 'Noodles',    'price_cents' => 72000,  'stock' => 50, 'image_path' => $this->img('wholesaler', 'lucky_me_noodles.jpg')],
            ['store_type' => 'wholesaler', 'name' => 'Jasmine Rice 1 sack',   'sku' => 'WHL-002', 'category' => 'Beverages',  'price_cents' => 96000,  'stock' => 40, 'image_path' => $this->img('wholesaler', 'jasmine_rice.jpg')],
            ['store_type' => 'wholesaler', 'name' => 'Blue Harvest Rice 1 sack',   'sku' => 'WHL-003', 'category' => 'Beverages',    'price_cents' => 125000, 'stock' => 30, 'image_path' => $this->img('wholesaler', 'blue_harvest.jpeg')],
            ['store_type' => 'wholesaler', 'name' => 'Dried Danggit 5KG','sku' => 'WHL-004', 'category' => 'Beverages',  'price_cents' => 25000, 'stock' => 25, 'image_path' => $this->img('wholesaler', 'DriedDanggit.jpg')],
            ['store_type' => 'wholesaler', 'name' => 'Century Tuna 155g (case/48)','sku' => 'WHL-005', 'category' => 'Canned',     'price_cents' => 172800, 'stock' => 20, 'image_path' => null],
            ['store_type' => 'wholesaler', 'name' => 'Del Monte Sauce (case/24)',   'sku' => 'WHL-006', 'category' => 'Canned',     'price_cents' => 62400,  'stock' => 35, 'image_path' => null],
            ['store_type' => 'wholesaler', 'name' => 'Rebisco Crackers (case/100)','sku' => 'WHL-007', 'category' => 'Snacks',     'price_cents' => 150000, 'stock' => 20, 'image_path' => null],
            ['store_type' => 'wholesaler', 'name' => 'Chuckie Choco (case/24)',     'sku' => 'WHL-008', 'category' => 'Beverages',  'price_cents' => 48000,  'stock' => 30, 'image_path' => null],

            /* ── Electronics ──────────────────────────────────────────── */
            ['store_type' => 'electronics', 'name' => 'USB-C Cable 1m',            'sku' => 'ELC-001', 'category' => 'Cables',     'price_cents' => 15000, 'stock' => 100, 'image_path' => $this->img('electronicshop', 'usb_c.jpg')],
            ['store_type' => 'electronics', 'name' => 'Power Bank 10000mAh',        'sku' => 'ELC-002', 'category' => 'Power',      'price_cents' => 65000, 'stock' => 30,  'image_path' => null],
            ['store_type' => 'electronics', 'name' => 'Wireless Earphones',         'sku' => 'ELC-003', 'category' => 'Audio',      'price_cents' => 35000, 'stock' => 25,  'image_path' => null],
            ['store_type' => 'electronics', 'name' => 'Phone Case (Generic)',       'sku' => 'ELC-004', 'category' => 'Accessories','price_cents' => 8500,  'stock' => 80,  'image_path' => null],
            ['store_type' => 'electronics', 'name' => 'Tempered Screen Protector',  'sku' => 'ELC-005', 'category' => 'Accessories','price_cents' => 7500,  'stock' => 100, 'image_path' => null],
            ['store_type' => 'electronics', 'name' => 'USB Hub 4-Port',             'sku' => 'ELC-006', 'category' => 'Accessories','price_cents' => 35000, 'stock' => 20,  'image_path' => $this->img('electronicshop', 'usb_hub.jpg')],
            ['store_type' => 'electronics', 'name' => 'SD Card 32GB',               'sku' => 'ELC-007', 'category' => 'Storage',    'price_cents' => 18500, 'stock' => 50,  'image_path' => $this->img('electronicshop', 'sd_card.jpeg')],
            ['store_type' => 'electronics', 'name' => 'OTG Adapter',                'sku' => 'ELC-008', 'category' => 'Cables',     'price_cents' => 4500,  'stock' => 70,  'image_path' => null],
            ['store_type' => 'electronics', 'name' => 'Bluetooth Speaker',          'sku' => 'ELC-009', 'category' => 'Audio',      'price_cents' => 55000, 'stock' => 15,  'image_path' => null],
            ['store_type' => 'electronics', 'name' => 'LED Selfie Ring Light',      'sku' => 'ELC-010', 'category' => 'Photo',      'price_cents' => 25000, 'stock' => 20,  'image_path' => null],
        ];

        DemoProduct::insert($data);
    }
}
