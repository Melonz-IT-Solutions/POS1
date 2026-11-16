<script setup lang="ts">
import { ref, watch } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as ShiftController from '@/actions/App/Http/Controllers/Admin/ShiftController';
import type { PaginatedResponse, Shift, User } from '@/types/models';

type ShiftRow = Shift & {
    sales_count: number;
    total_sales: number | null;
};

const props = defineProps<{
    shifts: PaginatedResponse<ShiftRow>;
    cashiers: Pick<User, 'id' | 'name'>[];
    filters: { cashier_id?: string; status?: string; date_from?: string; date_to?: string };
}>();

const cashierId = ref(props.filters.cashier_id ?? 'all');
const status    = ref(props.filters.status ?? 'all');
const dateFrom  = ref(props.filters.date_from ?? '');
const dateTo    = ref(props.filters.date_to ?? '');

function applyFilters() {
    router.get(ShiftController.index.url(), {
        cashier_id: cashierId.value === 'all' ? undefined : cashierId.value,
        status:     status.value === 'all' ? undefined : status.value,
        date_from:  dateFrom.value || undefined,
        date_to:    dateTo.value || undefined,
    }, { preserveState: true, replace: true });
}

watch([cashierId, status, dateFrom, dateTo], applyFilters);

function peso(c: number | null): string {
    if (!c) return '₱0.00';
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function formatDt(s: string | null): string {
    return s ? dtf.format(new Date(s)) : '—';
}

function durationLabel(shift: ShiftRow): string {
    if (!shift.opened_at) return '—';
    const end   = shift.closed_at ? new Date(shift.closed_at) : new Date();
    const start = new Date(shift.opened_at);
    const mins  = Math.round((end.getTime() - start.getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const overShortClass = (shift: ShiftRow) => {
    const v = shift.over_short ?? 0;
    if (v > 0) return 'text-green-600';
    if (v < 0) return 'text-red-600';
    return 'text-muted-foreground';
};

function overShortLabel(shift: ShiftRow): string {
    const v = shift.over_short ?? 0;
    if (v === 0) return '—';
    return (v > 0 ? '+' : '') + peso(v);
}

function resetFilters() {
    cashierId.value = '';
    status.value    = '';
    dateFrom.value  = '';
    dateTo.value    = '';
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Shifts', href: ShiftController.index.url() }]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Shift History</h1>
                    <p class="text-muted-foreground text-sm">{{ shifts.total.toLocaleString() }} shifts</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="rounded-xl border p-4">
                <div class="flex flex-wrap gap-3">
                    <Select v-model="cashierId">
                        <SelectTrigger class="w-44"><SelectValue placeholder="All cashiers" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All cashiers</SelectItem>
                            <SelectItem v-for="c in cashiers" :key="c.id" :value="String(c.id)">{{ c.name }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select v-model="status">
                        <SelectTrigger class="w-36"><SelectValue placeholder="All statuses" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
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
                            <th class="px-4 py-2.5 font-medium">Cashier</th>
                            <th class="px-4 py-2.5 font-medium">Opened</th>
                            <th class="px-4 py-2.5 font-medium">Closed</th>
                            <th class="px-4 py-2.5 font-medium">Duration</th>
                            <th class="px-4 py-2.5 font-medium text-right">Float</th>
                            <th class="px-4 py-2.5 font-medium text-right">Sales</th>
                            <th class="px-4 py-2.5 font-medium text-right">Revenue</th>
                            <th class="px-4 py-2.5 font-medium text-right">Over/Short</th>
                            <th class="px-4 py-2.5 font-medium">Status</th>
                            <th class="px-4 py-2.5 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="shift in shifts.data" :key="shift.id" class="hover:bg-muted/30">
                            <td class="px-4 py-2.5 font-medium">{{ shift.cashier?.name ?? '—' }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ formatDt(shift.opened_at) }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ formatDt(shift.closed_at) }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ durationLabel(shift) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums">{{ peso(shift.opening_float) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums">{{ shift.sales_count }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-medium">{{ peso(shift.total_sales) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-medium" :class="overShortClass(shift)">
                                {{ overShortLabel(shift) }}
                            </td>
                            <td class="px-4 py-2.5">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="shift.status === 'open'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-muted text-muted-foreground'"
                                >{{ shift.status === 'open' ? 'Open' : 'Closed' }}</span>
                            </td>
                            <td class="px-4 py-2.5 text-right">
                                <Link
                                    :href="ShiftController.show.url(shift.id)"
                                    class="text-primary hover:underline text-xs"
                                >View</Link>
                            </td>
                        </tr>
                        <tr v-if="!shifts.data.length">
                            <td colspan="10" class="text-muted-foreground px-4 py-12 text-center">
                                No shifts found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="shifts.last_page > 1" class="flex items-center justify-between text-sm">
                <p class="text-muted-foreground">
                    Showing {{ shifts.from }}–{{ shifts.to }} of {{ shifts.total.toLocaleString() }}
                </p>
                <div class="flex gap-1">
                    <template v-for="link in shifts.links" :key="link.label">
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
