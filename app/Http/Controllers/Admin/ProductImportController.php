<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductImportController extends Controller
{
    public function create(): Response
    {
        $this->authorize('create', Product::class);

        return Inertia::render('products/Import');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Product::class);

        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
            'mode' => ['required', 'in:create,upsert'],
        ]);

        $handle = fopen($request->file('file')->getPathname(), 'r');

        // ── Parse header row ─────────────────────────────────────────────────
        $rawHeaders = fgetcsv($handle);
        if ($rawHeaders === false) {
            fclose($handle);
            return response()->json(['error' => 'The file appears to be empty.'], 422);
        }

        $headers = array_map(fn ($h) => strtolower(trim((string) $h)), $rawHeaders);

        $required = ['name', 'sku', 'selling_price', 'cost_price', 'vat_type'];
        $missing  = array_diff($required, $headers);
        if (! empty($missing)) {
            fclose($handle);
            return response()->json([
                'error' => 'Missing required columns: ' . implode(', ', $missing),
            ], 422);
        }

        // ── Build category lookup (name → id) ─────────────────────────────────
        $categoryMap = Category::active()->pluck('id', 'name')->mapWithKeys(
            fn ($id, $name) => [strtolower(trim($name)) => $id]
        )->all();

        $validVatTypes = ['vatable', 'vat_exempt', 'zero_rated'];

        $created = 0;
        $updated = 0;
        $skipped = 0;
        $errors  = [];
        $rowNum  = 1;

        DB::beginTransaction();

        try {
            while (($row = fgetcsv($handle)) !== false) {
                $rowNum++;

                // Skip blank rows
                if (empty(array_filter($row))) {
                    continue;
                }

                // Pad short rows to header count
                while (count($row) < count($headers)) {
                    $row[] = '';
                }

                $data = array_combine($headers, array_slice($row, 0, count($headers)));

                // ── Row validation ───────────────────────────────────────────
                $rowErrors = [];

                $name = trim($data['name'] ?? '');
                $sku  = trim($data['sku'] ?? '');

                if ($name === '') $rowErrors[] = 'name is required';
                if ($sku  === '') $rowErrors[] = 'sku is required';

                $sellingPeso  = $this->parsePeso($data['selling_price'] ?? '');
                $costPeso     = $this->parsePeso($data['cost_price'] ?? '');
                $vatType      = strtolower(trim($data['vat_type'] ?? ''));

                if ($sellingPeso === null) $rowErrors[] = 'selling_price must be a valid number';
                if ($costPeso    === null) $rowErrors[] = 'cost_price must be a valid number';
                if (! in_array($vatType, $validVatTypes)) {
                    $rowErrors[] = "vat_type must be one of: " . implode(', ', $validVatTypes);
                }

                if (! empty($rowErrors)) {
                    $errors[] = ['row' => $rowNum, 'sku' => $sku ?: '—', 'messages' => $rowErrors];
                    $skipped++;
                    continue;
                }

                // ── Resolve optional fields ──────────────────────────────────
                $stockQty    = max(0, (int) ($data['stock_quantity'] ?? 0));
                $minStock    = max(0, (int) ($data['minimum_stock'] ?? 0));
                $uom         = trim($data['unit_of_measure'] ?? '') ?: 'pcs';
                $barcode     = trim($data['barcode'] ?? '') ?: null;
                $description = trim($data['description'] ?? '') ?: null;
                $isActive    = ! in_array(strtolower(trim($data['is_active'] ?? '1')), ['0', 'false', 'no']);

                $categoryName = strtolower(trim($data['category'] ?? ''));
                $categoryId   = $categoryName !== '' ? ($categoryMap[$categoryName] ?? null) : null;

                $productData = [
                    'name'            => $name,
                    'sku'             => $sku,
                    'selling_price'   => $sellingPeso,
                    'cost_price'      => $costPeso,
                    'vat_type'        => $vatType,
                    'stock_quantity'  => $stockQty,
                    'minimum_stock'   => $minStock,
                    'unit_of_measure' => $uom,
                    'barcode'         => $barcode,
                    'description'     => $description,
                    'is_active'       => $isActive,
                    'category_id'     => $categoryId,
                ];

                // ── Create or upsert ─────────────────────────────────────────
                $existing = Product::withTrashed()->where('sku', $sku)->first();

                if ($existing && $request->mode === 'upsert') {
                    $existing->restore();
                    $existing->update($productData);
                    $updated++;
                } elseif (! $existing) {
                    Product::create($productData);
                    $created++;
                } else {
                    $errors[] = [
                        'row'      => $rowNum,
                        'sku'      => $sku,
                        'messages' => ["SKU already exists; use 'Create + Update' mode to overwrite."],
                    ];
                    $skipped++;
                }
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            fclose($handle);
            return response()->json(['error' => 'Import failed: ' . $e->getMessage()], 500);
        }

        fclose($handle);

        AuditLog::record('product.import', null, [], [
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
        ]);

        return response()->json([
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
            'errors'  => $errors,
        ]);
    }

    // Convert "99.75" or "9975" peso string → centavos int; null on failure
    private function parsePeso(string $raw): ?int
    {
        $clean = preg_replace('/[^0-9.]/', '', trim($raw));
        if ($clean === '' || $clean === '.') {
            return null;
        }
        return (int) round((float) $clean * 100);
    }
}
