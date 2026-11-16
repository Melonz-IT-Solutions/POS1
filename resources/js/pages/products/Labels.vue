<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import type { Product } from '@/types/models';

const props = defineProps<{
    products:         Pick<Product, 'id' | 'name' | 'sku' | 'barcode' | 'selling_price'>[];
    business_name:    string;
    business_address: string;
}>();

// Per-product copy count — editable in the control bar before printing
const copies = reactive<Record<number, number>>(
    Object.fromEntries(props.products.map(p => [p.id, 1]))
);

// Build the flat list of labels (each product × copies[id])
function labelList(): typeof props.products[number][] {
    const out: typeof props.products[number][] = [];
    for (const p of props.products) {
        const n = Math.max(1, copies[p.id] ?? 1);
        for (let i = 0; i < n; i++) out.push(p);
    }
    return out;
}

function printPage() { window.print(); }

onMounted(() => window.print());

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

// Simple visual barcode from barcode/sku string
// Encodes each character as a pattern of alternating narrow/wide bars
function barPattern(str: string): { width: number; black: boolean }[] {
    const bars: { width: number; black: boolean }[] = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        // narrow bar = 1, wide bar = 2  (alternating black/white)
        bars.push({ width: (code % 2 === 0) ? 2 : 1, black: i % 2 === 0 });
        bars.push({ width: (code % 3 === 0) ? 2 : 1, black: false });
    }
    return bars;
}
</script>

<template>
    <!-- Control bar — hidden when printing -->
    <div class="no-print fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
        <div class="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-start gap-4">
            <div class="flex items-center gap-3 shrink-0">
                <a
                    :href="ProductController.index.url()"
                    class="text-sm text-muted-foreground hover:text-foreground"
                >← Back to Products</a>
                <span class="text-muted-foreground">|</span>
                <button
                    class="text-sm font-medium hover:underline"
                    @click="printPage()"
                >🖨 Print Labels</button>
                <span class="text-xs text-muted-foreground">Auto-prints on load</span>
            </div>

            <!-- Per-product copy counts -->
            <div class="flex flex-wrap gap-3 ml-auto">
                <div
                    v-for="p in products"
                    :key="p.id"
                    class="flex items-center gap-2 text-sm"
                >
                    <span class="text-muted-foreground max-w-[120px] truncate" :title="p.name">{{ p.name }}</span>
                    <div class="flex items-center gap-1">
                        <button
                            class="rounded border w-6 h-6 text-xs font-bold hover:bg-muted"
                            @click="copies[p.id] = Math.max(1, (copies[p.id] ?? 1) - 1)"
                        >−</button>
                        <input
                            v-model.number="copies[p.id]"
                            type="number"
                            min="1"
                            max="50"
                            class="w-10 text-center rounded border bg-background text-xs py-0.5"
                        />
                        <button
                            class="rounded border w-6 h-6 text-xs font-bold hover:bg-muted"
                            @click="copies[p.id] = Math.min(50, (copies[p.id] ?? 1) + 1)"
                        >+</button>
                    </div>
                    <span class="text-muted-foreground text-xs">×</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Label sheet -->
    <div class="labels-page pt-24 print:pt-0 bg-white min-h-screen">
        <div class="labels-grid max-w-[210mm] mx-auto p-6 print:p-4 print:mx-0">
            <div
                v-for="(p, i) in labelList()"
                :key="`${p.id}-${i}`"
                class="label"
            >
                <!-- Store name -->
                <div class="label-store">{{ business_name }}</div>

                <!-- Product name -->
                <div class="label-name">{{ p.name }}</div>

                <!-- Visual barcode bars from SKU/barcode -->
                <div class="label-barcode-bars">
                    <div
                        v-for="(bar, bi) in barPattern(p.barcode ?? p.sku)"
                        :key="bi"
                        class="label-bar"
                        :style="{
                            width: `${bar.width * 2}px`,
                            background: bar.black ? '#000' : '#fff',
                        }"
                    />
                </div>

                <!-- Barcode / SKU value -->
                <div class="label-sku">{{ p.barcode ?? p.sku }}</div>

                <!-- Price -->
                <div class="label-price">{{ peso(p.selling_price) }}</div>
            </div>

            <!-- Empty state -->
            <div v-if="labelList().length === 0" class="col-span-3 py-12 text-center text-muted-foreground text-sm">
                No labels to print.
            </div>
        </div>
    </div>
</template>

<style>
/* Label grid — 3 per row, A4 optimized */
.labels-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4mm;
}

.label {
    border: 0.5pt solid #ccc;
    border-radius: 3px;
    padding: 5mm 4mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    page-break-inside: avoid;
    break-inside: avoid;
    min-height: 36mm;
    background: #fff;
}

.label-store {
    font-size: 7pt;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 2mm;
}

.label-name {
    font-size: 10pt;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 2.5mm;
    max-height: 2.4em;
    overflow: hidden;
}

.label-barcode-bars {
    display: flex;
    align-items: flex-end;
    height: 10mm;
    gap: 0;
    margin-bottom: 1mm;
}

.label-bar {
    height: 10mm;
    display: inline-block;
    flex-shrink: 0;
}

.label-sku {
    font-family: 'Courier New', monospace;
    font-size: 7pt;
    color: #555;
    letter-spacing: 0.08em;
    margin-bottom: 1.5mm;
}

.label-price {
    font-size: 15pt;
    font-weight: 900;
    letter-spacing: -0.02em;
    margin-top: auto;
}

@media print {
    .no-print { display: none !important; }

    body { margin: 0; background: #fff; }

    .labels-page { padding: 0 !important; }

    .labels-grid {
        max-width: none !important;
        padding: 10mm !important;
        gap: 3mm;
    }

    @page {
        size: A4 portrait;
        margin: 0;
    }
}
</style>
