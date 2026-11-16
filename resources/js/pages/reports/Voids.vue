<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps<{
    summary: {
        total_voids: number;
        total_amount: number;
        void_rate: number;
        total_sales: number;
    };
    byCashier: { cashier_id: number | null; name: string; count: number; total_amount: number }[];
    recentVoids: {
        id: number;
        receipt_number: string;
        total_amount: number;
        notes: string | null;
        cashier: string;
        voided_at: string;
        item_count: number;
    }[];
    filters: Record<string, string>;
    dateFrom: string;
    dateTo: string;
}>();

const presetOptions = [
    { value: 'today',      label: 'Today' },
    { value: 'yesterday',  label: 'Yesterday' },
    { value: 'this_week',  label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_year',  label: 'This Year' },
];

const preset    = ref(props.filters.preset ?? 'today');
const dateFrom  = ref(props.dateFrom);
const dateTo    = ref(props.dateTo);

function applyFilter() {
    router.get(ReportController.voids.url(), {
        preset: preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true });
}

function peso(c: number) {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function formatDt(s: string) {
    return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(s));
}

function exportCsv() {
    const rows = [
        ['Receipt', 'Cashier', 'Items', 'Amount', 'Voided At', 'Notes'],
        ...props.recentVoids.map(v => [
            v.receipt_number, v.cashier, v.item_count,
            (v.total_amount / 100).toFixed(2), v.voided_at, v.notes ?? '',
        ]),
    ];
    const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `void-report-${props.dateFrom}-to-${props.dateTo}.csv`;
    a.click();
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Reports' }, { title: 'Void Report' }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Void Report</h1>
                    <p class="text-muted-foreground text-sm">{{ dateFrom }} to {{ dateTo }}</p>
                </div>
                <div class="flex flex-wrap gap-2 items-center">
                    <select
                        v-model="preset"
                        @change="applyFilter"
                        class="border rounded-md px-3 py-1.5 text-sm bg-background"
                    >
                        <option v-for="p in presetOptions" :key="p.value" :value="p.value">{{ p.label }}</option>
                        <option value="custom">Custom Range</option>
                    </select>
                    <template v-if="preset === 'custom'">
                        <input v-model="dateFrom" type="date" class="border rounded-md px-3 py-1.5 text-sm bg-background" />
                        <input v-model="dateTo"   type="date" class="border rounded-md px-3 py-1.5 text-sm bg-background" />
                        <button @click="applyFilter" class="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm">Apply</button>
                    </template>
                    <button
                        @click="exportCsv"
                        class="border rounded-md px-3 py-1.5 text-sm hover:bg-muted"
                    >Export CSV</button>
                </div>
            </div>

            <!-- KPI cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Total Voids</p>
                    <p class="text-3xl font-bold mt-1 text-red-600">{{ summary.total_voids }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Voided Value</p>
                    <p class="text-3xl font-bold mt-1 text-red-600">{{ peso(summary.total_amount) }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Void Rate</p>
                    <p class="text-3xl font-bold mt-1" :class="summary.void_rate > 5 ? 'text-red-600' : 'text-green-600'">
                        {{ summary.void_rate }}%
                    </p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Completed Sales</p>
                    <p class="text-3xl font-bold mt-1">{{ summary.total_sales }}</p>
                </div>
            </div>

            <!-- By cashier -->
            <div v-if="byCashier.length" class="rounded-xl border overflow-hidden">
                <div class="p-4 border-b">
                    <h2 class="font-semibold">By Cashier</h2>
                </div>
                <table class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="text-left px-4 py-2">Cashier</th>
                            <th class="text-right px-4 py-2">Voids</th>
                            <th class="text-right px-4 py-2">Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in byCashier" :key="row.cashier_id ?? 'unknown'" class="border-t hover:bg-muted/30">
                            <td class="px-4 py-2">{{ row.name }}</td>
                            <td class="px-4 py-2 text-right font-mono text-red-600">{{ row.count }}</td>
                            <td class="px-4 py-2 text-right font-mono text-red-600">{{ peso(row.total_amount) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Recent voids list -->
            <div class="rounded-xl border overflow-hidden">
                <div class="p-4 border-b">
                    <h2 class="font-semibold">Recent Voids <span class="text-muted-foreground font-normal text-sm">(last 50)</span></h2>
                </div>
                <div v-if="!recentVoids.length" class="p-8 text-center text-muted-foreground text-sm">
                    No voided transactions in this period.
                </div>
                <table v-else class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="text-left px-4 py-2">Receipt</th>
                            <th class="text-left px-4 py-2">Cashier</th>
                            <th class="text-right px-4 py-2">Items</th>
                            <th class="text-right px-4 py-2">Amount</th>
                            <th class="text-left px-4 py-2">Voided</th>
                            <th class="text-left px-4 py-2">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="v in recentVoids" :key="v.id" class="border-t hover:bg-muted/30">
                            <td class="px-4 py-2 font-mono text-xs">{{ v.receipt_number }}</td>
                            <td class="px-4 py-2">{{ v.cashier }}</td>
                            <td class="px-4 py-2 text-right">{{ v.item_count }}</td>
                            <td class="px-4 py-2 text-right font-mono text-red-600">{{ peso(v.total_amount) }}</td>
                            <td class="px-4 py-2 text-xs text-muted-foreground">{{ formatDt(v.voided_at) }}</td>
                            <td class="px-4 py-2 text-xs text-muted-foreground max-w-xs truncate">{{ v.notes ?? '—' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AppLayout>
</template>
