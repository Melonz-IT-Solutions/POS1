<script setup lang="ts">
import { onMounted } from 'vue';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import type { PurchaseOrder } from '@/types/models';

const props = defineProps<{
    order:            PurchaseOrder;
    business_name:    string;
    business_address: string;
    business_phone:   string;
    business_tin:     string;
    business_email:   string;
}>();

onMounted(() => window.print());

function printPage() { window.print(); }

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const df  = new Intl.DateTimeFormat('en-PH', { dateStyle: 'long' });
const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function formatDate(s: string | null): string { return s ? df.format(new Date(s + 'T00:00:00')) : '—'; }
function formatDt(s: string): string { return dtf.format(new Date(s)); }

const statusLabel: Record<string, string> = {
    draft:              'DRAFT',
    ordered:            'ORDERED',
    partially_received: 'PARTIALLY RECEIVED',
    received:           'RECEIVED',
    cancelled:          'CANCELLED',
};
</script>

<template>
    <!-- Control bar — hidden when printing -->
    <div class="no-print fixed top-0 left-0 right-0 z-50 flex items-center gap-3 bg-background border-b px-6 py-3 shadow-sm">
        <a
            :href="PurchaseOrderController.show.url({ purchase: order.id })"
            class="text-sm text-muted-foreground hover:text-foreground"
        >← Back to PO</a>
        <span class="text-muted-foreground">|</span>
        <button
            class="text-sm font-medium hover:underline"
            @click="printPage()"
        >🖨 Print</button>
        <span class="ml-auto text-xs text-muted-foreground">This page will auto-print on load</span>
    </div>

    <!-- Document -->
    <div class="print-page pt-16 print:pt-0">
        <div class="max-w-3xl mx-auto p-8 print:p-0 print:max-w-none font-sans text-sm text-gray-900">

            <!-- Header: Business + PO title -->
            <div class="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-900">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">{{ business_name }}</h1>
                    <p v-if="business_address" class="text-gray-600 text-xs mt-0.5 whitespace-pre-line">{{ business_address }}</p>
                    <div class="flex flex-wrap gap-x-4 mt-1 text-xs text-gray-600">
                        <span v-if="business_phone">Tel: {{ business_phone }}</span>
                        <span v-if="business_email">{{ business_email }}</span>
                        <span v-if="business_tin">TIN: {{ business_tin }}</span>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Purchase Order</p>
                    <p class="text-3xl font-bold font-mono mt-0.5">{{ order.po_number }}</p>
                    <span
                        class="inline-block mt-1 rounded px-2 py-0.5 text-xs font-bold border"
                        :class="{
                            'border-blue-500 text-blue-700': order.status === 'ordered',
                            'border-orange-500 text-orange-700': order.status === 'partially_received',
                            'border-green-600 text-green-700': order.status === 'received',
                            'border-gray-400 text-gray-600': order.status === 'draft',
                            'border-red-500 text-red-700': order.status === 'cancelled',
                        }"
                    >{{ statusLabel[order.status] ?? order.status }}</span>
                </div>
            </div>

            <!-- Addresses: Bill To + Ship To + PO Details -->
            <div class="grid grid-cols-3 gap-6 mb-8">
                <!-- Vendor / Supplier -->
                <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Vendor</p>
                    <p class="font-semibold">{{ order.supplier?.company_name ?? '—' }}</p>
                    <p v-if="order.supplier?.contact_person" class="text-gray-600 text-xs">Attn: {{ order.supplier.contact_person }}</p>
                    <p v-if="order.supplier?.phone" class="text-gray-600 text-xs">{{ order.supplier.phone }}</p>
                    <p v-if="order.supplier?.email" class="text-gray-600 text-xs">{{ order.supplier.email }}</p>
                </div>

                <!-- Ship To -->
                <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Ship To</p>
                    <p class="font-semibold">{{ business_name }}</p>
                    <p v-if="business_address" class="text-gray-600 text-xs whitespace-pre-line">{{ business_address }}</p>
                </div>

                <!-- PO Details -->
                <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">PO Details</p>
                    <table class="w-full text-xs">
                        <tr>
                            <td class="text-gray-500 pr-2 py-0.5">Date Issued:</td>
                            <td class="font-medium">{{ formatDt(order.created_at) }}</td>
                        </tr>
                        <tr v-if="order.expected_date">
                            <td class="text-gray-500 pr-2 py-0.5">Expected By:</td>
                            <td class="font-medium">{{ formatDate(order.expected_date) }}</td>
                        </tr>
                        <tr v-if="order.orderedBy">
                            <td class="text-gray-500 pr-2 py-0.5">Prepared By:</td>
                            <td class="font-medium">{{ order.orderedBy.name }}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Items table -->
            <table class="w-full mb-8 text-sm border-collapse">
                <thead>
                    <tr class="border-y-2 border-gray-900">
                        <th class="text-left py-2 pr-4 text-xs font-bold uppercase tracking-wide">#</th>
                        <th class="text-left py-2 pr-4 text-xs font-bold uppercase tracking-wide">Product</th>
                        <th class="text-left py-2 pr-4 text-xs font-bold uppercase tracking-wide">SKU</th>
                        <th class="text-right py-2 pr-4 text-xs font-bold uppercase tracking-wide">Qty Ordered</th>
                        <th class="text-right py-2 pr-4 text-xs font-bold uppercase tracking-wide">Qty Received</th>
                        <th class="text-right py-2 pr-4 text-xs font-bold uppercase tracking-wide">Unit Cost</th>
                        <th class="text-right py-2 text-xs font-bold uppercase tracking-wide">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(item, i) in order.items"
                        :key="item.id"
                        class="border-b border-gray-200"
                    >
                        <td class="py-2 pr-4 text-gray-500 text-xs">{{ i + 1 }}</td>
                        <td class="py-2 pr-4 font-medium">{{ item.product?.name ?? '—' }}</td>
                        <td class="py-2 pr-4 font-mono text-xs text-gray-600">{{ item.product?.sku ?? '—' }}</td>
                        <td class="py-2 pr-4 text-right tabular-nums font-semibold">{{ item.quantity_ordered }}</td>
                        <td class="py-2 pr-4 text-right tabular-nums text-gray-600">{{ item.quantity_received }}</td>
                        <td class="py-2 pr-4 text-right tabular-nums">{{ peso(item.unit_cost) }}</td>
                        <td class="py-2 text-right tabular-nums font-semibold">{{ peso(item.total_cost) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="border-t-2 border-gray-900">
                        <td colspan="5" class="py-3 text-right font-bold text-sm uppercase tracking-wide pr-4">
                            Total
                        </td>
                        <td />
                        <td class="py-3 text-right tabular-nums font-bold text-base">{{ peso(order.subtotal) }}</td>
                    </tr>
                </tfoot>
            </table>

            <!-- Notes -->
            <div v-if="order.notes" class="mb-8 rounded border border-gray-300 p-4">
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Notes / Special Instructions</p>
                <p class="text-sm whitespace-pre-line">{{ order.notes }}</p>
            </div>

            <!-- Signature lines -->
            <div class="grid grid-cols-2 gap-12 mt-12 pt-6 border-t border-gray-300">
                <div>
                    <div class="border-b border-gray-900 h-10 mb-1"></div>
                    <p class="text-xs text-gray-600">Prepared / Authorized by</p>
                    <p class="text-xs text-gray-600">Date: _______________</p>
                </div>
                <div>
                    <div class="border-b border-gray-900 h-10 mb-1"></div>
                    <p class="text-xs text-gray-600">Acknowledged by Supplier</p>
                    <p class="text-xs text-gray-600">Date: _______________</p>
                </div>
            </div>

            <!-- Footer -->
            <p class="mt-8 text-center text-[10px] text-gray-400">
                {{ business_name }} · {{ order.po_number }} · Printed {{ new Date().toLocaleDateString('en-PH') }}
            </p>

        </div>
    </div>
</template>

<style>
@media print {
    .no-print { display: none !important; }

    body { margin: 0; }

    @page {
        size: A4;
        margin: 15mm 20mm;
    }
}
</style>
