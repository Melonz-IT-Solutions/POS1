<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps<{
    sales: {
        id: number;
        receipt_number: string;
        date: string;
        customer_name: string;
        customer_tin: string;
        vatable_sales: number;
        vat_amount: number;
        vat_exempt: number;
        zero_rated: number;
        discount: number;
        total_amount: number;
    }[];
    summary: {
        total_transactions: number;
        gross_sales: number;
        vatable_sales: number;
        vat_amount: number;
        vat_exempt: number;
        zero_rated: number;
        discounts: number;
    };
    filters: Record<string, string>;
    dateFrom: string;
    dateTo: string;
}>();

const presetOptions = [
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year',  label: 'This Year' },
    { value: 'custom',     label: 'Custom Range' },
];

const preset   = ref(props.filters.preset ?? 'this_month');
const dateFrom = ref(props.dateFrom);
const dateTo   = ref(props.dateTo);

function applyFilter() {
    router.get(ReportController.birExport.url(), {
        preset: preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true });
}

function peso(c: number) {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function exportCsv() {
    const headers = [
        'Date', 'Receipt No.', 'Customer Name', 'Customer TIN',
        'Vatable Sales', 'VAT Amount', 'VAT Exempt', 'Zero Rated', 'Discount', 'Total Amount',
    ];
    const rows = props.sales.map(s => [
        s.date,
        s.receipt_number,
        s.customer_name,
        s.customer_tin,
        (s.vatable_sales / 100).toFixed(2),
        (s.vat_amount / 100).toFixed(2),
        (s.vat_exempt / 100).toFixed(2),
        (s.zero_rated / 100).toFixed(2),
        (s.discount / 100).toFixed(2),
        (s.total_amount / 100).toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' }));
    a.download = `BIR-SLS-${props.dateFrom}-to-${props.dateTo}.csv`;
    a.click();
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Reports' }, { title: 'BIR Sales Export' }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">BIR Sales Invoice List</h1>
                    <p class="text-muted-foreground text-sm">{{ dateFrom }} to {{ dateTo }}</p>
                </div>
                <div class="flex flex-wrap gap-2 items-center">
                    <select
                        v-model="preset"
                        @change="applyFilter"
                        class="border rounded-md px-3 py-1.5 text-sm bg-background"
                    >
                        <option v-for="p in presetOptions" :key="p.value" :value="p.value">{{ p.label }}</option>
                    </select>
                    <template v-if="preset === 'custom'">
                        <input v-model="dateFrom" type="date" class="border rounded-md px-3 py-1.5 text-sm bg-background" />
                        <input v-model="dateTo"   type="date" class="border rounded-md px-3 py-1.5 text-sm bg-background" />
                        <button @click="applyFilter" class="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm">Apply</button>
                    </template>
                    <button
                        @click="exportCsv"
                        class="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm hover:bg-primary/90"
                    >Export CSV (BIR Format)</button>
                </div>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Transactions</p>
                    <p class="text-3xl font-bold mt-1">{{ summary.total_transactions }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Gross Sales</p>
                    <p class="text-3xl font-bold mt-1">{{ peso(summary.gross_sales) }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">VATable Sales</p>
                    <p class="text-2xl font-bold mt-1">{{ peso(summary.vatable_sales) }}</p>
                    <p class="text-xs text-muted-foreground">VAT: {{ peso(summary.vat_amount) }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Exempt / Zero Rated</p>
                    <p class="text-2xl font-bold mt-1">{{ peso(summary.vat_exempt + summary.zero_rated) }}</p>
                    <p class="text-xs text-muted-foreground">Discounts: {{ peso(summary.discounts) }}</p>
                </div>
            </div>

            <!-- BIR info banner -->
            <div class="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                <p class="font-semibold">BIR Compliance Note</p>
                <p class="mt-1 text-blue-700 text-xs">
                    This export follows the BIR Sales Invoice/Receipt format. The CSV is UTF-8 BOM encoded for Excel compatibility.
                    Review with your accountant before filing.
                </p>
            </div>

            <!-- Sales table -->
            <div class="rounded-xl border overflow-x-auto">
                <div v-if="!sales.length" class="p-8 text-center text-muted-foreground text-sm">
                    No completed transactions in this period.
                </div>
                <table v-else class="w-full text-xs">
                    <thead class="bg-muted/50 text-muted-foreground">
                        <tr>
                            <th class="text-left px-3 py-2">Date</th>
                            <th class="text-left px-3 py-2">Receipt No.</th>
                            <th class="text-left px-3 py-2">Customer</th>
                            <th class="text-left px-3 py-2">TIN</th>
                            <th class="text-right px-3 py-2">Vatable</th>
                            <th class="text-right px-3 py-2">VAT</th>
                            <th class="text-right px-3 py-2">Exempt</th>
                            <th class="text-right px-3 py-2">Zero Rated</th>
                            <th class="text-right px-3 py-2">Discount</th>
                            <th class="text-right px-3 py-2 font-semibold">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="s in sales" :key="s.id" class="border-t hover:bg-muted/30">
                            <td class="px-3 py-1.5 text-muted-foreground whitespace-nowrap">{{ s.date.slice(0, 10) }}</td>
                            <td class="px-3 py-1.5 font-mono">{{ s.receipt_number }}</td>
                            <td class="px-3 py-1.5">{{ s.customer_name }}</td>
                            <td class="px-3 py-1.5 font-mono text-muted-foreground">{{ s.customer_tin || '—' }}</td>
                            <td class="px-3 py-1.5 text-right font-mono">{{ (s.vatable_sales / 100).toFixed(2) }}</td>
                            <td class="px-3 py-1.5 text-right font-mono">{{ (s.vat_amount / 100).toFixed(2) }}</td>
                            <td class="px-3 py-1.5 text-right font-mono">{{ (s.vat_exempt / 100).toFixed(2) }}</td>
                            <td class="px-3 py-1.5 text-right font-mono">{{ (s.zero_rated / 100).toFixed(2) }}</td>
                            <td class="px-3 py-1.5 text-right font-mono text-green-600">
                                {{ s.discount > 0 ? (s.discount / 100).toFixed(2) : '' }}
                            </td>
                            <td class="px-3 py-1.5 text-right font-mono font-semibold">{{ (s.total_amount / 100).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                    <tfoot class="bg-muted/50 font-semibold border-t-2">
                        <tr>
                            <td colspan="4" class="px-3 py-2">Totals ({{ summary.total_transactions }} records)</td>
                            <td class="px-3 py-2 text-right font-mono">{{ (summary.vatable_sales / 100).toFixed(2) }}</td>
                            <td class="px-3 py-2 text-right font-mono">{{ (summary.vat_amount / 100).toFixed(2) }}</td>
                            <td class="px-3 py-2 text-right font-mono">{{ (summary.vat_exempt / 100).toFixed(2) }}</td>
                            <td class="px-3 py-2 text-right font-mono">{{ (summary.zero_rated / 100).toFixed(2) }}</td>
                            <td class="px-3 py-2 text-right font-mono">{{ (summary.discounts / 100).toFixed(2) }}</td>
                            <td class="px-3 py-2 text-right font-mono">{{ (summary.gross_sales / 100).toFixed(2) }}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </AppLayout>
</template>
