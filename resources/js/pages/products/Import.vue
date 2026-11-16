<script setup lang="ts">
import { ref, computed } from 'vue';
import { AlertCircle, CheckCircle2, Download, FileUp, Upload, X } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import * as ProductImportController from '@/actions/App/Http/Controllers/Admin/ProductImportController';

// ── CSV column reference ────────────────────────────────────────────────────
const csvColumns = [
    { name: 'name',            req: true,  note: 'Product display name' },
    { name: 'sku',             req: true,  note: 'Unique stock-keeping unit code' },
    { name: 'selling_price',   req: true,  note: 'In pesos, e.g. 149.75' },
    { name: 'cost_price',      req: true,  note: 'In pesos, e.g. 80.00' },
    { name: 'vat_type',        req: true,  note: 'vatable · vat_exempt · zero_rated' },
    { name: 'stock_quantity',  req: false, note: 'Default 0' },
    { name: 'minimum_stock',   req: false, note: 'Default 0' },
    { name: 'unit_of_measure', req: false, note: 'Default "pcs"' },
    { name: 'barcode',         req: false, note: 'EAN-13 or any barcode' },
    { name: 'description',     req: false, note: 'Short product description' },
    { name: 'category',        req: false, note: 'Must match an existing category name exactly' },
    { name: 'is_active',       req: false, note: '1 = active, 0 = inactive (default 1)' },
];

// ── Mode ───────────────────────────────────────────────────────────────────
type ImportMode = 'create' | 'upsert';
const mode = ref<ImportMode>('create');

// ── File state ─────────────────────────────────────────────────────────────
const file        = ref<File | null>(null);
const isDragging  = ref(false);
const fileInput   = ref<HTMLInputElement | null>(null);

function onDrop(e: DragEvent) {
    isDragging.value = false;
    const dropped = e.dataTransfer?.files[0];
    if (dropped && (dropped.name.endsWith('.csv') || dropped.type === 'text/csv' || dropped.type === 'text/plain')) {
        file.value = dropped;
        result.value = null;
    }
}

function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
        file.value = input.files[0];
        result.value = null;
    }
}

function clearFile() {
    file.value = null;
    result.value = null;
    if (fileInput.value) fileInput.value.value = '';
}

// ── Import result ──────────────────────────────────────────────────────────
interface ImportError {
    row:      number;
    sku:      string;
    messages: string[];
}

interface ImportResult {
    created: number;
    updated: number;
    skipped: number;
    errors:  ImportError[];
}

const result  = ref<ImportResult | null>(null);
const loading = ref(false);
const serverError = ref('');

async function runImport() {
    if (!file.value) return;
    loading.value     = true;
    serverError.value = '';
    result.value      = null;

    const form = new FormData();
    form.append('file', file.value);
    form.append('mode', mode.value);

    try {
        const res = await fetch(ProductImportController.store.url(), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''
                ),
            },
            body: form,
        });

        const data = await res.json();

        if (!res.ok) {
            serverError.value = data.error ?? data.message ?? 'Import failed.';
            return;
        }

        result.value = data as ImportResult;
    } catch {
        serverError.value = 'Network error. Please try again.';
    } finally {
        loading.value = false;
    }
}

const isSuccess = computed(() =>
    result.value !== null && (result.value.created + result.value.updated) > 0
);

// ── CSV template download (client-side) ───────────────────────────────────
function downloadTemplate() {
    const headers = [
        'name', 'sku', 'selling_price', 'cost_price', 'vat_type',
        'stock_quantity', 'minimum_stock', 'unit_of_measure',
        'barcode', 'description', 'category', 'is_active',
    ];
    const example1 = [
        'Sample Product A', 'SKU-001', '149.75', '80.00', 'vatable',
        '100', '10', 'pcs',
        '', 'A sample product', 'Electronics', '1',
    ];
    const example2 = [
        'Sample Product B', 'SKU-002', '45.00', '20.00', 'vat_exempt',
        '50', '5', 'pcs',
        '8991234567890', '', 'Beverages', '1',
    ];
    const rows = [headers, example1, example2]
        .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'product-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Products', href: ProductController.index.url() },
        { title: 'Import', href: ProductImportController.create.url() },
    ]">
        <div class="p-6 space-y-6 max-w-3xl">

            <!-- Header -->
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Import Products</h1>
                    <p class="text-muted-foreground text-sm mt-0.5">
                        Upload a CSV file to create or update products in bulk.
                    </p>
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" class="gap-2" @click="downloadTemplate">
                        <Download class="h-4 w-4" />
                        Download Template
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="ProductController.index.url()">← Back</a>
                    </Button>
                </div>
            </div>

            <!-- Import mode -->
            <div class="rounded-xl border p-5 space-y-3">
                <h2 class="font-semibold text-sm">Import Mode</h2>
                <div class="grid grid-cols-2 gap-3">
                    <button
                        class="rounded-lg border p-3 text-left transition-colors"
                        :class="mode === 'create'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'hover:bg-muted'"
                        @click="mode = 'create'"
                    >
                        <p class="font-semibold text-sm">Create Only</p>
                        <p class="text-muted-foreground text-xs mt-0.5">
                            Skip rows where the SKU already exists. Safe for first-time imports.
                        </p>
                    </button>
                    <button
                        class="rounded-lg border p-3 text-left transition-colors"
                        :class="mode === 'upsert'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                            : 'hover:bg-muted'"
                        @click="mode = 'upsert'"
                    >
                        <p class="font-semibold text-sm">Create + Update</p>
                        <p class="text-muted-foreground text-xs mt-0.5">
                            Create new products and overwrite existing ones matched by SKU.
                        </p>
                    </button>
                </div>
            </div>

            <!-- CSV format guide -->
            <div class="rounded-xl border p-5 space-y-2">
                <h2 class="font-semibold text-sm">CSV Format</h2>
                <div class="overflow-x-auto">
                    <table class="text-xs w-full">
                        <thead>
                            <tr class="border-b">
                                <th class="py-1.5 pr-4 text-left font-semibold">Column</th>
                                <th class="py-1.5 pr-4 text-left font-semibold">Required</th>
                                <th class="py-1.5 text-left font-semibold">Notes</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y text-muted-foreground">
                            <tr v-for="col in csvColumns" :key="col.name">
                                <td class="py-1.5 pr-4 font-mono font-semibold text-foreground">{{ col.name }}</td>
                                <td class="py-1.5 pr-4">
                                    <span v-if="col.req" class="rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-semibold">Required</span>
                                    <span v-else class="text-muted-foreground text-[10px]">Optional</span>
                                </td>
                                <td class="py-1.5">{{ col.note }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Drop zone -->
            <div
                class="rounded-xl border-2 border-dashed transition-colors cursor-pointer"
                :class="isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="onDrop"
                @click="fileInput?.click()"
            >
                <div v-if="!file" class="flex flex-col items-center gap-3 py-10 text-muted-foreground">
                    <FileUp class="h-10 w-10 opacity-40" />
                    <div class="text-center">
                        <p class="font-medium">Drop your CSV file here</p>
                        <p class="text-sm">or click to browse</p>
                    </div>
                    <p class="text-xs opacity-60">CSV files only · max 5 MB</p>
                </div>

                <div v-else class="flex items-center gap-3 px-5 py-4">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">
                        CSV
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-medium truncate">{{ file.name }}</p>
                        <p class="text-xs text-muted-foreground">{{ (file.size / 1024).toFixed(1) }} KB</p>
                    </div>
                    <button
                        class="text-muted-foreground hover:text-destructive transition-colors p-1"
                        @click.stop="clearFile"
                    >
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <input
                    ref="fileInput"
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    class="hidden"
                    @change="onFileChange"
                />
            </div>

            <!-- Error banner -->
            <div v-if="serverError" class="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle class="h-4 w-4 shrink-0 mt-0.5" />
                {{ serverError }}
            </div>

            <!-- Import button -->
            <div class="flex justify-end">
                <Button
                    :disabled="!file || loading"
                    class="gap-2 min-w-32"
                    @click="runImport"
                >
                    <Upload v-if="!loading" class="h-4 w-4" />
                    <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {{ loading ? 'Importing…' : 'Import Products' }}
                </Button>
            </div>

            <!-- Results panel -->
            <div v-if="result" class="space-y-4">

                <!-- Summary cards -->
                <div class="grid grid-cols-3 gap-3">
                    <div class="rounded-xl border p-4 text-center space-y-1"
                        :class="result.created > 0 ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30' : ''">
                        <p class="text-muted-foreground text-xs">Created</p>
                        <p class="text-3xl font-bold" :class="result.created > 0 ? 'text-green-700 dark:text-green-300' : ''">
                            {{ result.created }}
                        </p>
                    </div>
                    <div class="rounded-xl border p-4 text-center space-y-1"
                        :class="result.updated > 0 ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30' : ''">
                        <p class="text-muted-foreground text-xs">Updated</p>
                        <p class="text-3xl font-bold" :class="result.updated > 0 ? 'text-blue-700 dark:text-blue-300' : ''">
                            {{ result.updated }}
                        </p>
                    </div>
                    <div class="rounded-xl border p-4 text-center space-y-1"
                        :class="result.skipped > 0 ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' : ''">
                        <p class="text-muted-foreground text-xs">Skipped / Errors</p>
                        <p class="text-3xl font-bold" :class="result.skipped > 0 ? 'text-amber-700 dark:text-amber-300' : ''">
                            {{ result.skipped }}
                        </p>
                    </div>
                </div>

                <!-- Success message -->
                <div v-if="isSuccess" class="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 px-4 py-3 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle2 class="h-4 w-4 shrink-0" />
                    Import complete.
                    <span v-if="result.created > 0">{{ result.created }} product{{ result.created !== 1 ? 's' : '' }} created.</span>
                    <span v-if="result.updated > 0">{{ result.updated }} product{{ result.updated !== 1 ? 's' : '' }} updated.</span>
                    <a :href="ProductController.index.url()" class="ml-auto font-semibold underline">View Products →</a>
                </div>

                <!-- Error detail table -->
                <div v-if="result.errors.length > 0" class="space-y-2">
                    <h3 class="font-semibold text-sm flex items-center gap-2">
                        <AlertCircle class="h-4 w-4 text-amber-500" />
                        Row Errors ({{ result.errors.length }})
                    </h3>
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2.5 font-medium w-16">Row</th>
                                    <th class="px-3 py-2.5 font-medium w-32">SKU</th>
                                    <th class="px-3 py-2.5 font-medium">Issue</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="err in result.errors" :key="err.row" class="hover:bg-muted/20">
                                    <td class="px-3 py-2 tabular-nums text-muted-foreground">{{ err.row }}</td>
                                    <td class="px-3 py-2 font-mono text-xs">{{ err.sku }}</td>
                                    <td class="px-3 py-2 text-xs text-destructive">
                                        {{ err.messages.join(' · ') }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
