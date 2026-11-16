<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as LayawayController from '@/actions/App/Http/Controllers/Admin/LayawayController';
import type { Layaway, PaginatedResponse } from '@/types/models';

const props = defineProps<{
    layaways: PaginatedResponse<Layaway & { customer?: { id: number; name: string; phone: string | null } }>;
    filters: { status?: string; search?: string };
    summary: { active: number; overdue: number; total_outstanding: number };
}>();

const search = ref(props.filters.search ?? '');
const status = ref(props.filters.status ?? '');

function applyFilters() {
    router.get(LayawayController.index.url(), {
        search: search.value || undefined,
        status: status.value || undefined,
    }, { preserveState: true, preserveScroll: true });
}

function peso(c: number) {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const statusClasses: Record<string, string> = {
    active:    'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Layaway' }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Layaway</h1>
                    <p class="text-muted-foreground text-sm">Manage layaway contracts and payments</p>
                </div>
                <Button as-child>
                    <a :href="LayawayController.create.url()">New Layaway</a>
                </Button>
            </div>

            <!-- Summary -->
            <div class="grid grid-cols-3 gap-4">
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Active</p>
                    <p class="text-3xl font-bold mt-1">{{ summary.active }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Overdue</p>
                    <p class="text-3xl font-bold mt-1 text-red-600">{{ summary.overdue }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Outstanding</p>
                    <p class="text-3xl font-bold mt-1">{{ peso(summary.total_outstanding) }}</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-2">
                <Input
                    v-model="search"
                    placeholder="Search layaway # or customer..."
                    class="max-w-xs"
                    @keyup.enter="applyFilters"
                />
                <select
                    v-model="status"
                    @change="applyFilters"
                    class="border rounded-md px-3 py-1.5 text-sm bg-background"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="secondary" size="sm" @click="applyFilters">Search</Button>
            </div>

            <!-- Table -->
            <div class="rounded-xl border overflow-hidden">
                <div v-if="!layaways.data.length" class="p-8 text-center text-muted-foreground text-sm">
                    No layaway records found.
                </div>
                <table v-else class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="text-left px-4 py-2">Layaway #</th>
                            <th class="text-left px-4 py-2">Customer</th>
                            <th class="text-right px-4 py-2">Total</th>
                            <th class="text-right px-4 py-2">Paid</th>
                            <th class="text-right px-4 py-2">Balance</th>
                            <th class="text-left px-4 py-2">Due</th>
                            <th class="text-left px-4 py-2">Status</th>
                            <th class="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="lay in layaways.data" :key="lay.id" class="border-t hover:bg-muted/30">
                            <td class="px-4 py-2 font-mono text-xs">{{ lay.layaway_number }}</td>
                            <td class="px-4 py-2">
                                <p class="font-medium">{{ lay.customer?.name }}</p>
                                <p class="text-muted-foreground text-xs">{{ lay.customer?.phone }}</p>
                            </td>
                            <td class="px-4 py-2 text-right font-mono">{{ peso(lay.total_amount) }}</td>
                            <td class="px-4 py-2 text-right font-mono text-green-600">{{ peso(lay.deposit_paid) }}</td>
                            <td class="px-4 py-2 text-right font-mono font-semibold">{{ peso(lay.balance) }}</td>
                            <td class="px-4 py-2 text-xs" :class="lay.due_date && lay.due_date < new Date().toISOString().slice(0,10) && lay.status === 'active' ? 'text-red-600 font-semibold' : 'text-muted-foreground'">
                                {{ lay.due_date ?? '—' }}
                            </td>
                            <td class="px-4 py-2">
                                <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClasses[lay.status]">
                                    {{ lay.status }}
                                </span>
                            </td>
                            <td class="px-4 py-2">
                                <a :href="LayawayController.show.url(lay.id)" class="text-primary text-xs hover:underline">View</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="layaways.last_page > 1" class="flex gap-1 justify-center flex-wrap">
                <a
                    v-for="link in layaways.links"
                    :key="link.label"
                    :href="link.url ?? '#'"
                    class="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs"
                    :class="link.active ? 'bg-primary text-primary-foreground border-primary' : link.url ? 'hover:bg-muted' : 'opacity-40 pointer-events-none'"
                    v-html="link.label"
                />
            </div>
        </div>
    </AppLayout>
</template>
