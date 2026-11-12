<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';
import { BarChart3, CreditCard, TrendingUp } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';

interface DailyRow {
    date: string;
    transactions: number;
    revenue: number;
    vat: number;
    discounts: number;
    vatable: number;
    vat_exempt: number;
}

interface PaymentRow {
    payment_method: string;
    transactions: number;
    total_amount: number;
}

interface Summary {
    total_revenue: number;
    transaction_count: number;
    total_vat: number;
    total_discounts: number;
    avg_sale: number;
    vatable_sales: number;
    vat_exempt_sales: number;
    zero_rated_sales: number;
}

const props = defineProps<{
    summary: Summary;
    daily: DailyRow[];
    payments: PaymentRow[];
    filters: { preset?: string; date_from?: string; date_to?: string };
    dateFrom: string;
    dateTo: string;
}>();

const preset    = ref(props.filters.preset ?? 'today');
const dateFrom  = ref(props.filters.date_from ?? props.dateFrom);
const dateTo    = ref(props.filters.date_to ?? props.dateTo);

const presets = [
    { value: 'today',      label: 'Today' },
    { value: 'yesterday',  label: 'Yesterday' },
    { value: 'this_week',  label: 'This Week' },
    { value: 'last_week',  label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'custom',     label: 'Custom Range' },
];

function applyFilters() {
    router.get(ReportController.sales.url(), {
        preset:    preset.value,
        date_from: preset.value === 'custom' ? dateFrom.value : undefined,
        date_to:   preset.value === 'custom' ? dateTo.value   : undefined,
    }, { preserveState: true, replace: true });
}

watch(preset, (val) => { if (val !== 'custom') applyFilters(); });

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const df = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function formatDate(s: string): string { return df.format(new Date(s + 'T00:00:00')); }

const paymentLabels: Record<string, string> = {
    cash: 'Cash', card: 'Card', gcash: 'GCash', maya: 'Maya',
};

const maxRevenue = computed(() => Math.max(...props.daily.map(d => d.revenue), 1));
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Reports', href: ReportController.sales.url() },
        { title: 'Sales Report', href: ReportController.sales.url() },
    ]">
        <div class="p-6 space-y-6">
            <!-- Header + Filter -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Sales Report</h1>
                    <p class="text-muted-foreground text-sm">{{ formatDate(dateFrom) }} — {{ formatDate(dateTo) }}</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <Select v-model="preset">
                        <SelectTrigger class="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="p in presets" :key="p.value" :value="p.value">{{ p.label }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <template v-if="preset === 'custom'">
                        <Input v-model="dateFrom" type="date" class="w-38" />
                        <span class="text-muted-foreground text-sm">to</span>
                        <Input v-model="dateTo" type="date" class="w-38" />
                        <Button size="sm" @click="applyFilters">Apply</Button>
                    </template>
                </div>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1.5">
                        <TrendingUp class="h-3.5 w-3.5" />Total Revenue
                    </p>
                    <p class="text-2xl font-bold tabular-nums">{{ peso(summary.total_revenue) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1.5">
                        <BarChart3 class="h-3.5 w-3.5" />Transactions
                    </p>
                    <p class="text-2xl font-bold tabular-nums">{{ summary.transaction_count.toLocaleString() }}</p>
                    <p class="text-muted-foreground text-xs">Avg {{ peso(summary.avg_sale) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">VAT Collected</p>
                    <p class="text-2xl font-bold tabular-nums">{{ peso(summary.total_vat) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Total Discounts</p>
                    <p class="text-2xl font-bold tabular-nums">{{ peso(summary.total_discounts) }}</p>
                </div>
            </div>

            <!-- Daily breakdown + payment split -->
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- Daily table with mini bar chart -->
                <div class="lg:col-span-2 rounded-xl border">
                    <div class="border-b px-4 py-3">
                        <h2 class="font-semibold text-sm">Daily Breakdown</h2>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-4 py-2 font-medium">Date</th>
                                    <th class="px-4 py-2 font-medium text-right">Txns</th>
                                    <th class="px-4 py-2 font-medium text-right">Revenue</th>
                                    <th class="px-4 py-2 font-medium text-right">VAT</th>
                                    <th class="px-4 py-2 font-medium text-right">Discounts</th>
                                    <th class="px-4 py-2 font-medium w-24">Bar</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr v-for="row in daily" :key="row.date" class="hover:bg-muted/30">
                                    <td class="px-4 py-2">{{ formatDate(row.date) }}</td>
                                    <td class="px-4 py-2 text-right tabular-nums">{{ row.transactions }}</td>
                                    <td class="px-4 py-2 text-right tabular-nums font-medium">{{ peso(row.revenue) }}</td>
                                    <td class="px-4 py-2 text-right tabular-nums text-muted-foreground">{{ peso(row.vat) }}</td>
                                    <td class="px-4 py-2 text-right tabular-nums text-muted-foreground">{{ peso(row.discounts) }}</td>
                                    <td class="px-4 py-2">
                                        <div class="h-2 rounded-full bg-muted overflow-hidden">
                                            <div
                                                class="h-full bg-primary rounded-full"
                                                :style="{ width: `${(row.revenue / maxRevenue * 100).toFixed(1)}%` }"
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="!daily.length">
                                    <td colspan="6" class="text-muted-foreground px-4 py-8 text-center">No sales in this period.</td>
                                </tr>
                            </tbody>
                            <tfoot v-if="daily.length">
                                <tr class="border-t bg-muted/20 font-semibold">
                                    <td class="px-4 py-2">Total</td>
                                    <td class="px-4 py-2 text-right tabular-nums">{{ summary.transaction_count }}</td>
                                    <td class="px-4 py-2 text-right tabular-nums">{{ peso(summary.total_revenue) }}</td>
                                    <td class="px-4 py-2 text-right tabular-nums">{{ peso(summary.total_vat) }}</td>
                                    <td class="px-4 py-2 text-right tabular-nums">{{ peso(summary.total_discounts) }}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <!-- Right column: payments + VAT summary -->
                <div class="space-y-6">
                    <!-- Payments -->
                    <div class="rounded-xl border">
                        <div class="border-b px-4 py-3 flex items-center gap-2">
                            <CreditCard class="h-4 w-4 text-muted-foreground" />
                            <h2 class="font-semibold text-sm">Payment Methods</h2>
                        </div>
                        <div class="p-4 space-y-3">
                            <div v-for="pm in payments" :key="pm.payment_method" class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span class="font-medium capitalize">{{ paymentLabels[pm.payment_method] ?? pm.payment_method }}</span>
                                    <span class="tabular-nums">{{ peso(pm.total_amount) }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            class="h-full bg-primary/70 rounded-full"
                                            :style="{ width: `${(pm.total_amount / (summary.total_revenue || 1) * 100).toFixed(1)}%` }"
                                        />
                                    </div>
                                    <span class="text-muted-foreground text-xs w-10 text-right">
                                        {{ (pm.total_amount / (summary.total_revenue || 1) * 100).toFixed(0) }}%
                                    </span>
                                </div>
                            </div>
                            <p v-if="!payments.length" class="text-muted-foreground text-sm text-center py-4">No data.</p>
                        </div>
                    </div>

                    <!-- VAT Summary (BIR) -->
                    <div class="rounded-xl border">
                        <div class="border-b px-4 py-3">
                            <h2 class="font-semibold text-sm">VAT Summary</h2>
                            <p class="text-muted-foreground text-xs">BIR reporting breakdown</p>
                        </div>
                        <div class="divide-y text-sm">
                            <div class="flex justify-between px-4 py-2.5">
                                <span class="text-muted-foreground">Vatable Sales</span>
                                <span class="tabular-nums font-medium">{{ peso(summary.vatable_sales) }}</span>
                            </div>
                            <div class="flex justify-between px-4 py-2.5">
                                <span class="text-muted-foreground">VAT-Exempt Sales</span>
                                <span class="tabular-nums font-medium">{{ peso(summary.vat_exempt_sales) }}</span>
                            </div>
                            <div class="flex justify-between px-4 py-2.5">
                                <span class="text-muted-foreground">Zero-Rated Sales</span>
                                <span class="tabular-nums font-medium">{{ peso(summary.zero_rated_sales) }}</span>
                            </div>
                            <div class="flex justify-between px-4 py-2.5 font-semibold">
                                <span>Output VAT (12%)</span>
                                <span class="tabular-nums">{{ peso(summary.total_vat) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
