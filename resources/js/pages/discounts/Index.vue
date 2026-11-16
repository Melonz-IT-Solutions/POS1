<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { Eye, Percent, Plus, RotateCcw, Search, Tag, Trash2, Pencil } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as DiscountController from '@/actions/App/Http/Controllers/Admin/DiscountController';
import type { Discount } from '@/types/models';

interface DiscountRow extends Discount {
    deleted_at: string | null;
}

interface PaginatedDiscounts {
    data: DiscountRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number; last_page: number;
    from: number | null; to: number | null; total: number;
}

const props = defineProps<{
    discounts: PaginatedDiscounts;
    filters: { search?: string; status?: string };
}>();

const search = ref(props.filters.search ?? '');
const statusFilter = ref(props.filters.status ?? 'all');

function applyFilters() {
    router.get(DiscountController.index.url(), {
        search: search.value || undefined,
        status: statusFilter.value === 'all' ? undefined : statusFilter.value,
    }, { preserveState: true, replace: true });
}

let timer: ReturnType<typeof setTimeout>;
function onSearch() { clearTimeout(timer); timer = setTimeout(applyFilters, 350); }

const confirmDelete = ref(false);
const target = ref<DiscountRow | null>(null);

function askDelete(d: DiscountRow) { target.value = d; confirmDelete.value = true; }
function doDelete() {
    if (!target.value) return;
    router.delete(DiscountController.destroy.url({ discount: target.value.id }), { preserveScroll: true });
}
function restore(id: number) {
    router.post(DiscountController.restore.url({ id }), {}, { preserveScroll: true });
}

type DiscountStatus = 'active' | 'scheduled' | 'expired' | 'inactive' | 'deleted';

function discountStatus(d: DiscountRow): DiscountStatus {
    if (d.deleted_at) return 'deleted';
    if (!d.is_active) return 'inactive';
    const now = new Date();
    if (d.start_at && new Date(d.start_at) > now) return 'scheduled';
    if (d.end_at && new Date(d.end_at) < now) return 'expired';
    return 'active';
}

const statusConfig: Record<DiscountStatus, { label: string; class: string }> = {
    active:    { label: 'Active',    class: 'bg-green-100 text-green-800' },
    scheduled: { label: 'Scheduled', class: 'bg-blue-100 text-blue-800' },
    expired:   { label: 'Expired',   class: 'bg-orange-100 text-orange-800' },
    inactive:  { label: 'Inactive',  class: 'bg-gray-100 text-gray-700' },
    deleted:   { label: 'Deleted',   class: '' },
};

function formatValue(d: DiscountRow): string {
    if (d.type === 'percentage') {
        const pct = d.value / 100;
        return `${pct % 1 === 0 ? pct : pct.toFixed(2)}%`;
    }
    return `₱${(d.value / 100).toFixed(2)}`;
}

function formatPeso(centavos: number): string {
    return centavos > 0 ? `₱${(centavos / 100).toFixed(2)}` : '—';
}

const scopeLabels: Record<string, string> = {
    all: 'All items',
    products: 'Products',
    categories: 'Categories',
    customers: 'Customers',
};

const df = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function formatDate(s: string | null): string {
    return s ? df.format(new Date(s)) : '—';
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Discounts', href: DiscountController.index.url() }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Discounts</h1>
                    <p class="text-muted-foreground text-sm">{{ discounts.total }} discount rules</p>
                </div>
                <Button as-child>
                    <a :href="DiscountController.create.url()">
                        <Plus class="mr-2 h-4 w-4" />
                        New Discount
                    </a>
                </Button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input v-model="search" placeholder="Search name or code…" class="pl-9" @input="onSearch" />
                </div>
                <Select v-model="statusFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-40">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Table -->
            <div class="rounded-xl border">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b text-left">
                            <th class="px-4 py-3 font-medium">Name / Code</th>
                            <th class="px-4 py-3 font-medium">Value</th>
                            <th class="px-4 py-3 font-medium">Scope</th>
                            <th class="px-4 py-3 font-medium">Min Purchase</th>
                            <th class="px-4 py-3 font-medium">Date Range</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="d in discounts.data"
                            :key="d.id"
                            :class="['border-b transition-colors', d.deleted_at ? 'opacity-50' : 'hover:bg-muted/50']"
                        >
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <div class="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                                        <Percent class="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ d.name }}</p>
                                        <p v-if="d.code" class="text-muted-foreground font-mono text-xs">{{ d.code }}</p>
                                        <p v-else class="text-muted-foreground text-xs">No code</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 font-semibold tabular-nums">{{ formatValue(d) }}</td>
                            <td class="px-4 py-3">
                                <Badge variant="outline" class="text-xs">
                                    <Tag class="mr-1 h-3 w-3" />
                                    {{ scopeLabels[d.scope] ?? d.scope }}
                                </Badge>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground tabular-nums">{{ formatPeso(d.min_purchase) }}</td>
                            <td class="px-4 py-3 text-muted-foreground text-xs">
                                <span v-if="d.start_at || d.end_at">
                                    {{ formatDate(d.start_at) }} – {{ formatDate(d.end_at) }}
                                </span>
                                <span v-else>Always</span>
                            </td>
                            <td class="px-4 py-3">
                                <Badge
                                    :variant="discountStatus(d) === 'deleted' ? 'destructive' : 'secondary'"
                                    :class="statusConfig[discountStatus(d)].class"
                                    class="text-xs"
                                >
                                    {{ statusConfig[discountStatus(d)].label }}
                                </Badge>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Button v-if="d.deleted_at" size="sm" variant="ghost" @click="restore(d.id)" title="Restore">
                                        <RotateCcw class="h-4 w-4" />
                                    </Button>
                                    <template v-else>
                                        <Button size="sm" variant="ghost" as-child title="View">
                                            <a :href="DiscountController.show.url({ discount: d.id })">
                                                <Eye class="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost" as-child title="Edit">
                                            <a :href="DiscountController.edit.url({ discount: d.id })">
                                                <Pencil class="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost" class="text-destructive" @click="askDelete(d)" title="Delete">
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!discounts.data.length">
                            <td colspan="7" class="text-muted-foreground px-4 py-12 text-center">No discounts found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="discounts" />
        </div>

        <ConfirmDialog
            v-model:open="confirmDelete"
            title="Delete Discount"
            :description="`Delete discount &quot;${target?.name}&quot;? This cannot be undone.`"
            confirm-label="Delete"
            @confirm="doDelete"
        />
    </AppLayout>
</template>
