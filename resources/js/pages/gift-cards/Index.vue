<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as GiftCardController from '@/actions/App/Http/Controllers/Admin/GiftCardController';
import type { GiftCard, PaginatedResponse } from '@/types/models';

const props = defineProps<{
    giftCards: PaginatedResponse<GiftCard>;
    filters: { status?: string; search?: string };
    summary: {
        active_count: number;
        total_liability: number;
        total_issued: number;
        total_redeemed: number;
    };
}>();

const search = ref(props.filters.search ?? '');
const status = ref(props.filters.status ?? '');

function applyFilters() {
    router.get(GiftCardController.index.url(), {
        search: search.value || undefined,
        status: status.value || undefined,
    }, { preserveState: true, preserveScroll: true });
}

function peso(c: number) {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const statusClasses: Record<string, string> = {
    active:    'bg-green-100 text-green-700',
    depleted:  'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
    expired:   'bg-orange-100 text-orange-700',
};
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Gift Cards' }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Gift Cards</h1>
                    <p class="text-muted-foreground text-sm">Issue and manage store gift cards</p>
                </div>
                <Button as-child>
                    <a :href="GiftCardController.create.url()">Issue Gift Card</a>
                </Button>
            </div>

            <!-- Summary -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Active Cards</p>
                    <p class="text-3xl font-bold mt-1 text-green-600">{{ summary.active_count }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Outstanding Balance</p>
                    <p class="text-3xl font-bold mt-1">{{ peso(summary.total_liability) }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Total Issued</p>
                    <p class="text-3xl font-bold mt-1">{{ peso(summary.total_issued) }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Total Redeemed</p>
                    <p class="text-3xl font-bold mt-1">{{ peso(summary.total_redeemed) }}</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-2">
                <Input v-model="search" placeholder="Search code or recipient..." class="max-w-xs" @keyup.enter="applyFilters" />
                <select v-model="status" @change="applyFilters" class="border rounded-md px-3 py-1.5 text-sm bg-background">
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="depleted">Depleted</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="secondary" size="sm" @click="applyFilters">Search</Button>
            </div>

            <!-- Table -->
            <div class="rounded-xl border overflow-hidden">
                <div v-if="!giftCards.data.length" class="p-8 text-center text-muted-foreground text-sm">
                    No gift cards found.
                </div>
                <table v-else class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="text-left px-4 py-2">Code</th>
                            <th class="text-left px-4 py-2">Issued To</th>
                            <th class="text-right px-4 py-2">Initial</th>
                            <th class="text-right px-4 py-2">Balance</th>
                            <th class="text-left px-4 py-2">Expires</th>
                            <th class="text-left px-4 py-2">Status</th>
                            <th class="text-left px-4 py-2">Issued</th>
                            <th class="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="card in giftCards.data" :key="card.id" class="border-t hover:bg-muted/30">
                            <td class="px-4 py-2 font-mono font-semibold text-xs tracking-wider">{{ card.code }}</td>
                            <td class="px-4 py-2">
                                <p v-if="card.issued_to">{{ card.issued_to }}</p>
                                <p v-if="card.customer" class="text-xs text-muted-foreground">{{ card.customer.name }}</p>
                                <p v-if="!card.issued_to && !card.customer" class="text-muted-foreground">—</p>
                            </td>
                            <td class="px-4 py-2 text-right font-mono">{{ peso(card.initial_value) }}</td>
                            <td class="px-4 py-2 text-right font-mono font-semibold" :class="card.current_balance === 0 ? 'text-muted-foreground' : ''">
                                {{ peso(card.current_balance) }}
                            </td>
                            <td class="px-4 py-2 text-xs text-muted-foreground">{{ card.expires_at ?? 'No expiry' }}</td>
                            <td class="px-4 py-2">
                                <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClasses[card.status]">
                                    {{ card.status }}
                                </span>
                            </td>
                            <td class="px-4 py-2 text-xs text-muted-foreground">{{ card.created_at.slice(0, 10) }}</td>
                            <td class="px-4 py-2">
                                <a :href="GiftCardController.show.url(card.id)" class="text-primary text-xs hover:underline">View</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="giftCards.last_page > 1" class="flex gap-1 justify-center flex-wrap">
                <a
                    v-for="link in giftCards.links"
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
