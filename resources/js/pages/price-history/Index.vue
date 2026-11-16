<script setup lang="ts">
import { ref, watch } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import * as PriceHistoryController from '@/actions/App/Http/Controllers/Admin/PriceHistoryController';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import type { PaginatedResponse, Product, User } from '@/types/models';

interface PriceHistoryRow {
    id: number;
    product_id: number;
    old_cost_price: number;
    new_cost_price: number;
    old_selling_price: number;
    new_selling_price: number;
    reason: string | null;
    created_at: string;
    product?: Pick<Product, 'id' | 'name' | 'sku'>;
    changed_by?: Pick<User, 'id' | 'name'>;
}

const props = defineProps<{
    histories: PaginatedResponse<PriceHistoryRow>;
    products: Pick<Product, 'id' | 'name' | 'sku'>[];
    users: Pick<User, 'id' | 'name'>[];
    focusProduct: Pick<Product, 'id' | 'name' | 'sku'> | null;
    filters: { product_id?: string; user_id?: string; date_from?: string; date_to?: string };
}>();

const productId = ref(props.filters.product_id ?? 'all');
const userId    = ref(props.filters.user_id ?? 'all');
const dateFrom  = ref(props.filters.date_from ?? '');
const dateTo    = ref(props.filters.date_to ?? '');

function applyFilters() {
    router.get(PriceHistoryController.index.url(), {
        product_id: productId.value === 'all' ? undefined : productId.value,
        user_id:    userId.value === 'all' ? undefined : userId.value,
        date_from:  dateFrom.value || undefined,
        date_to:    dateTo.value || undefined,
    }, { preserveState: true, replace: true });
}

watch([productId, userId, dateFrom, dateTo], applyFilters);

function resetFilters() {
    productId.value = 'all';
    userId.value    = 'all';
    dateFrom.value  = '';
    dateTo.value    = '';
}

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function priceDiff(oldVal: number, newVal: number): { label: string; cls: string } {
    const diff = newVal - oldVal;
    if (diff === 0) return { label: '—', cls: 'text-muted-foreground' };
    const pct = oldVal > 0 ? ((diff / oldVal) * 100).toFixed(1) : '∞';
    return {
        label: `${diff > 0 ? '+' : ''}${peso(diff)} (${diff > 0 ? '+' : ''}${pct}%)`,
        cls:   diff > 0 ? 'text-red-600' : 'text-green-600',
    };
}

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function formatDt(s: string): string { return dtf.format(new Date(s)); }
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Price History', href: PriceHistoryController.index.url() },
        ...(focusProduct ? [{ title: focusProduct.name, href: PriceHistoryController.index.url({ query: { product_id: focusProduct.id } }) }] : []),
    ]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">
                        <template v-if="focusProduct">Price History — {{ focusProduct.name }}</template>
                        <template v-else>Price History</template>
                    </h1>
                    <p class="text-muted-foreground text-sm">{{ histories.total.toLocaleString() }} price changes recorded</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="rounded-xl border p-4">
                <div class="flex flex-wrap gap-3">
                    <Select v-model="productId">
                        <SelectTrigger class="w-56"><SelectValue placeholder="All products" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All products</SelectItem>
                            <SelectItem v-for="p in products" :key="p.id" :value="String(p.id)">
                                {{ p.name }} <span class="text-muted-foreground font-mono text-xs ml-1">{{ p.sku }}</span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Select v-model="userId">
                        <SelectTrigger class="w-44"><SelectValue placeholder="Any user" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Any user</SelectItem>
                            <SelectItem v-for="u in users" :key="u.id" :value="String(u.id)">{{ u.name }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input v-model="dateFrom" type="date" class="w-38" />
                    <span class="self-center text-muted-foreground text-sm">to</span>
                    <Input v-model="dateTo" type="date" class="w-38" />
                    <Button variant="ghost" size="sm" @click="resetFilters">Reset</Button>
                </div>
            </div>

            <!-- Table -->
            <div class="rounded-xl border overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2.5 font-medium">Date</th>
                            <th class="px-4 py-2.5 font-medium">Product</th>
                            <th class="px-4 py-2.5 font-medium">Changed By</th>
                            <th class="px-4 py-2.5 font-medium text-right">Old Cost</th>
                            <th class="px-4 py-2.5 font-medium text-right">New Cost</th>
                            <th class="px-4 py-2.5 font-medium text-right">Old Selling</th>
                            <th class="px-4 py-2.5 font-medium text-right">New Selling</th>
                            <th class="px-4 py-2.5 font-medium text-right">Selling Δ</th>
                            <th class="px-4 py-2.5 font-medium">Reason</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="row in histories.data" :key="row.id" class="hover:bg-muted/30">
                            <td class="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap">{{ formatDt(row.created_at) }}</td>
                            <td class="px-4 py-2.5">
                                <Link
                                    :href="PriceHistoryController.index.url({ query: { product_id: row.product_id } })"
                                    class="font-medium hover:underline"
                                >{{ row.product?.name ?? '—' }}</Link>
                                <div class="text-muted-foreground font-mono text-xs">{{ row.product?.sku }}</div>
                            </td>
                            <td class="px-4 py-2.5">{{ row.changed_by?.name ?? '—' }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{{ peso(row.old_cost_price) }}</td>
                            <td
                                class="px-4 py-2.5 text-right tabular-nums font-medium"
                                :class="row.new_cost_price !== row.old_cost_price ? (row.new_cost_price > row.old_cost_price ? 'text-red-600' : 'text-green-600') : ''"
                            >{{ peso(row.new_cost_price) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{{ peso(row.old_selling_price) }}</td>
                            <td
                                class="px-4 py-2.5 text-right tabular-nums font-medium"
                                :class="row.new_selling_price !== row.old_selling_price ? (row.new_selling_price > row.old_selling_price ? 'text-red-600' : 'text-green-600') : ''"
                            >{{ peso(row.new_selling_price) }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums text-xs" :class="priceDiff(row.old_selling_price, row.new_selling_price).cls">
                                {{ priceDiff(row.old_selling_price, row.new_selling_price).label }}
                            </td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs max-w-40 truncate">{{ row.reason ?? '—' }}</td>
                        </tr>
                        <tr v-if="!histories.data.length">
                            <td colspan="9" class="text-muted-foreground px-4 py-12 text-center">
                                No price changes found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="histories.last_page > 1" class="flex items-center justify-between text-sm">
                <p class="text-muted-foreground">
                    Showing {{ histories.from }}–{{ histories.to }} of {{ histories.total.toLocaleString() }}
                </p>
                <div class="flex gap-1">
                    <template v-for="link in histories.links" :key="link.label">
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
