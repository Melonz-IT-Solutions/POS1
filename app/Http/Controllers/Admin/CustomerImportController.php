<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomerImportController extends Controller
{
    public function create(): Response
    {
        $this->authorize('create', Customer::class);

        return Inertia::render('customers/Import');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Customer::class);

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

        $required = ['name'];
        $missing  = array_diff($required, $headers);
        if (! empty($missing)) {
            fclose($handle);
            return response()->json([
                'error' => 'Missing required columns: ' . implode(', ', $missing),
            ], 422);
        }

        // At least one contact field should be present for meaningful upsert matching
        $hasPhone = in_array('phone', $headers);
        $hasEmail = in_array('email', $headers);

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

                $name  = trim($data['name'] ?? '');
                $phone = $hasPhone ? trim($data['phone'] ?? '') : null;
                $email = $hasEmail ? strtolower(trim($data['email'] ?? '')) : null;

                if ($name === '') {
                    $rowErrors[] = 'name is required';
                }

                if ($email !== null && $email !== '' && ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $rowErrors[] = 'email is not a valid email address';
                }

                $loyaltyPoints = 0;
                if (isset($data['loyalty_points']) && $data['loyalty_points'] !== '') {
                    $lp = filter_var($data['loyalty_points'], FILTER_VALIDATE_INT);
                    if ($lp === false || $lp < 0) {
                        $rowErrors[] = 'loyalty_points must be a non-negative integer';
                    } else {
                        $loyaltyPoints = $lp;
                    }
                }

                $discountRate = 0;
                if (isset($data['discount_rate']) && $data['discount_rate'] !== '') {
                    // Accepts basis points (500) or percentage string (5%)
                    $raw = trim($data['discount_rate'], '%');
                    if (! is_numeric($raw)) {
                        $rowErrors[] = 'discount_rate must be a number (basis points or %)';
                    } else {
                        // If value looks like a percentage (<= 100), treat as pct → convert to bps
                        $num = (float) $raw;
                        $discountRate = $num <= 100 ? (int) round($num * 100) : (int) $num;
                    }
                }

                if (! empty($rowErrors)) {
                    $errors[] = ['row' => $rowNum, 'identifier' => $email ?: $phone ?: $name, 'messages' => $rowErrors];
                    $skipped++;
                    continue;
                }

                // ── Resolve optional fields ──────────────────────────────────
                $address  = trim($data['address'] ?? '') ?: null;
                $notes    = trim($data['notes'] ?? '') ?: null;
                $isActive = ! in_array(strtolower(trim($data['is_active'] ?? '1')), ['0', 'false', 'no']);

                $customerData = [
                    'name'          => $name,
                    'phone'         => $phone ?: null,
                    'email'         => ($email !== '' ? $email : null),
                    'address'       => $address,
                    'notes'         => $notes,
                    'discount_rate' => $discountRate,
                    'loyalty_points'=> $loyaltyPoints,
                    'is_active'     => $isActive,
                ];

                // ── Identify existing customer ───────────────────────────────
                // Match by email first, then phone
                $existing = null;
                if ($email !== null && $email !== '') {
                    $existing = Customer::withTrashed()->where('email', $email)->first();
                }
                if (! $existing && $phone !== null && $phone !== '') {
                    $existing = Customer::withTrashed()->where('phone', $phone)->first();
                }

                if ($existing && $request->mode === 'upsert') {
                    $existing->restore();
                    $existing->update($customerData);
                    $updated++;
                } elseif (! $existing) {
                    Customer::create($customerData);
                    $created++;
                } else {
                    $errors[] = [
                        'row'        => $rowNum,
                        'identifier' => $email ?: $phone ?: $name,
                        'messages'   => ["Customer already exists (matched by " . ($email ? "email" : "phone") . "); use 'Create + Update' mode to overwrite."],
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

        AuditLog::record('customer.import', null, [], [
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
}
