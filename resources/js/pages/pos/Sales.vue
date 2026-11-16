<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import { Download } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as SaleController from '@/actions/App/Http/Controllers/POS/SaleController';
import type { PaginatedResponse, Sale, User } from '@/types/models';

const props = defineProps<{
    sales: PaginatedResponse<Sale>;
    filters: {
        search?: string;
        status?: string;
        cashier_id?: string;
        date_from?: string;
        date_to?: string;
        payment_method?: string;
    };
    cashiers: Pick<User, 'id' | 'name'>[];
    canVoid: boolean;
}>();

const search        = ref(props.filters.search ?? '');
const status        = ref(props.filters.status ?? 'all');
const cashierId     = ref(props.filters.cashier_id ?? 'all');
const dateFrom      = ref(props.filters.date_from ?? '');
const dateTo        = ref(props.filters.date_to ?? '');
const paymentMethod = ref(props.filters.payment_method ?? 'all');

let debounceTimer: ReturnType<typeof setTimeout>;

function applyFilters() {
    router.get(SaleController.index.url(), {
        search:         search.value || undefined,
        status:         status.value === 'all' ? undefined : status.value,
        cashier_id:     cashierId.value === 'all' ? undefined : cashierId.value,
        date_from:      dateFrom.value || undefined,
        date_to:        dateTo.value || undefined,
        payment_method: paymentMethod.value === 'all' ? undefined : paymentMethod.value,
    }, { preserveState: true, replace: true });
}

watch(search, () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 400);
});

watch([status, cashierId, dateFrom, dateTo, paymentMethod], applyFilters);

const statusOptions = [
    { value: 'completed',          label: 'Completed' },
    { value: 'void',               label: 'Voided' },
    { value: 'refunded',           label: 'Refunded' },
    { value: 'partially_refunded', label: 'Partial Refund' },
];

const paymentOptions = [
    { value: 'cash',  label: 'Cash' },
    { value: 'card',  label: 'Card' },
    { value: 'gcash', label: 'GCash' },
    { value: 'maya',  label: 'Maya' },
];

const statusClasses: Record<string, string> = {
    completed:          'bg-green-100 text-green-700',
    void:               'bg-red-100 text-red-700',
    refunded:           'bg-orange-100 text-orange-700',
    partially_refunded: 'bg-amber-100 text-amber-700',
    held:               'bg-yellow-100 text-yellow-700',
};

const statusLabels: Record<string, string> = {
    completed:          'Completed',
    void:               'Voided',
    refunded:           'Refunded',
    partially_refunded: 'Partial Refund',
    held:               'On Hold',
};

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function formatDt(s: string): string { return dtf.format(new Date(s)); }

const exportUrl = computed(() => {
    const params = new URLSearchParams();
    if (search.value)                        params.set('search', search.value);
    if (status.value !== 'all')              params.set('status', status.value);
    if (cashierId.value !== 'all')           params.set('cashier_id', cashierId.value);
    if (dateFrom.value)                      params.set('date_from', dateFrom.value);
    if (dateTo.value)                        params.set('date_to', dateTo.value);
    if (paymentMethod.value !== 'all')       params.set('payment_method', paymentMethod.value);
    const qs = params.toString();
    return SaleController.export?.url() + (qs ? '?' + qs : '');
});

function resetFilters() {
    search.value        = '';
    status.value        = 'all';
    cashierId.value     = 'all';
    dateFrom.value      = '';
    dateTo.value        = '';
    paymentMethod.value = 'all';
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Sales History', href: SaleController.index.url() }]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">Sales History</h1>
                    <p class="text-muted-foreground text-sm">{{ sales.total.toLocaleString() }} transactions</p>
                </div>
                <Button variant="outline" size="sm" as-child>
                    <a :href="exportUrl" download>
                        <Download class="mr-1.5 h-4 w-4" />
                        Export CSV
                    </a>
                </Button>
            </div>

            <!-- Filters -->
            <div class="rounded-xl border p-4 space-y-3">
                <div class="flex flex-wrap gap-3">
                    <Input
                        v-model="search"
                        placeholder="Search receipt #..."
                        class="w-52"
                    />
                    <Select v-model="status">
                        <SelectTrigger class="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select v-model="cashierId">
                        <SelectTrigger class="w-44"><SelectValue placeholder="All cashiers" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All cashiers</SelectItem>
                            <SelectItem v-for="c in cashiers" :key="c.id" :value="String(c.id)">{{ c.name }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select v-model="paymentMethod">
                        <SelectTrigger class="w-36"><SelectValue placeholder="Any payment" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any payment</SelectItem>
                            <SelectItem v-for="p in paymentOptions" :key="p.value" :value="p.value">{{ p.label }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input v-model="dateFrom" type="date" class="w-38" />
                    <span class="text-muted-foreground self-center text-sm">to</span>
                    <Input v-model="dateTo" type="date" class="w-38" />
                    <Button variant="ghost" size="sm" @click="resetFilters">Reset</Button>
                </div>
            </div>

            <!-- Table -->
            <div class="rounded-xl border overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2.5 font-medium">Receipt #</th>
                            <th class="px-4 py-2.5 font-medium">Date &amp; Time</th>
                            <th class="px-4 py-2.5 font-medium">Cashier</th>
                            <th class="px-4 py-2.5 font-medium">Customer</th>
                            <th class="px-4 py-2.5 font-medium text-right">Total</th>
                            <th class="px-4 py-2.5 font-medium">Status</th>
                            <th class="px-4 py-2.5 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="sale in sales.data" :key="sale.id" class="hover:bg-muted/30">
                            <td class="px-4 py-2.5 font-mono text-xs font-medium">{{ sale.receipt_number }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ formatDt(sale.created_at) }}</td>
                            <td class="px-4 py-2.5">{{ sale.cashier?.name ?? '—' }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground">{{ sale.customer?.name ?? 'Walk-in' }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-medium">{{ peso(sale.total_amount) }}</td>
                            <td class="px-4 py-2.5">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="statusClasses[sale.status] ?? 'bg-muted text-muted-foreground'"
                                >{{ statusLabels[sale.status] ?? sale.status }}</span>
                            </td>
                            <td class="px-4 py-2.5 text-right">
                                <Link
                                    :href="SaleController.show.url(sale.id)"
                                    class="text-primary hover:underline text-xs"
                                >View</Link>
                            </td>
                        </tr>
                        <tr v-if="!sales.data.length">
                            <td colspan="7" class="text-muted-foreground px-4 py-12 text-center">
                                No transactions found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="sales.last_page > 1" class="flex items-center justify-between text-sm">
                <p class="text-muted-foreground">
                    Showing {{ sales.from }}–{{ sales.to }} of {{ sales.total.toLocaleString() }}
                </p>
                <div class="flex gap-1">
                    <template v-for="link in sales.links" :key="link.label">
                        <Link
                            v-if="link.url"
                            :href="link.url"
                            preserve-state
                            class="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs"
                            :class="link.active ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'"
                            v-html="link.label"
                        />
                        <span
                            v-else
                            class="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs opacity-40"
                            v-html="link.label"
                        />
                    </template>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
