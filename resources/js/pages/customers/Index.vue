<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    Mail, Phone, Plus, RotateCcw, Search, Star, Trash2, UserRound,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/composables/useCurrency';
import * as CustomerController from '@/actions/App/Http/Controllers/Admin/CustomerController';
import type { Customer } from '@/types/models';

interface PaginatedCustomers {
    data: (Customer & { sales_count?: number })[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

const props = defineProps<{
    customers: PaginatedCustomers;
    filters: { search?: string; status?: string };
}>();

const { format } = useCurrency();

const search = ref(props.filters.search ?? '');
const statusFilter = ref(props.filters.status ?? '');

function applyFilters() {
    router.get(
        CustomerController.index.url(),
        { search: search.value || undefined, status: statusFilter.value || undefined },
        { preserveState: true, replace: true },
    );
}

let timer: ReturnType<typeof setTimeout>;
function onSearch() { clearTimeout(timer); timer = setTimeout(applyFilters, 350); }

const confirmDelete = ref(false);
const target = ref<Customer | null>(null);

function askDelete(c: Customer) { target.value = c; confirmDelete.value = true; }
function doDelete() {
    if (!target.value) return;
    router.delete(CustomerController.destroy.url({ customer: target.value.id }), { preserveScroll: true });
}
function restore(id: number) {
    router.post(CustomerController.restore.url({ id }), {}, { preserveScroll: true });
}

function avatarInitials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Customers', href: CustomerController.index.url() }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Customers</h1>
                    <p class="text-muted-foreground text-sm">{{ customers.total }} customers total</p>
                </div>
                <Button as-child>
                    <a :href="CustomerController.create.url()">
                        <Plus class="mr-2 h-4 w-4" />
                        New Customer
                    </a>
                </Button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input v-model="search" placeholder="Search name, phone, email…" class="pl-9" @input="onSearch" />
                </div>
                <Select v-model="statusFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-36">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
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
                            <th class="px-4 py-3 font-medium">Customer</th>
                            <th class="px-4 py-3 font-medium">Contact</th>
                            <th class="px-4 py-3 font-medium text-center">Purchases</th>
                            <th class="px-4 py-3 font-medium text-center">Discount</th>
                            <th class="px-4 py-3 font-medium text-center">Loyalty Pts</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="customer in customers.data"
                            :key="customer.id"
                            :class="['border-b transition-colors', customer.deleted_at ? 'opacity-50' : 'hover:bg-muted/50']"
                        >
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div class="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                                        {{ avatarInitials(customer.name) }}
                                    </div>
                                    <div>
                                        <a :href="CustomerController.show.url({ customer: customer.id })" class="font-medium hover:underline">
                                            {{ customer.name }}
                                        </a>
                                        <p v-if="customer.notes" class="text-muted-foreground text-xs line-clamp-1">{{ customer.notes }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <div class="space-y-0.5">
                                    <div v-if="customer.phone" class="flex items-center gap-1.5 text-sm">
                                        <Phone class="h-3.5 w-3.5 text-muted-foreground" />
                                        {{ customer.phone }}
                                    </div>
                                    <div v-if="customer.email" class="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Mail class="h-3.5 w-3.5" />
                                        {{ customer.email }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-center text-muted-foreground">{{ customer.sales_count ?? 0 }}</td>
                            <td class="px-4 py-3 text-center">
                                <span v-if="customer.discount_rate > 0" class="font-medium text-green-600">
                                    {{ (customer.discount_rate / 100).toFixed(0) }}%
                                </span>
                                <span v-else class="text-muted-foreground">—</span>
                            </td>
                            <td class="px-4 py-3 text-center">
                                <div v-if="customer.loyalty_points > 0" class="flex items-center justify-center gap-1 text-amber-600 font-medium">
                                    <Star class="h-3.5 w-3.5" />
                                    {{ customer.loyalty_points.toLocaleString() }}
                                </div>
                                <span v-else class="text-muted-foreground">0</span>
                            </td>
                            <td class="px-4 py-3">
                                <Badge v-if="customer.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                                <Badge v-else-if="!customer.is_active" variant="outline" class="text-xs">Inactive</Badge>
                                <Badge v-else variant="secondary" class="bg-green-100 text-green-800 text-xs">Active</Badge>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Button v-if="customer.deleted_at" size="sm" variant="ghost" @click="restore(customer.id)">
                                        <RotateCcw class="h-4 w-4" />
                                    </Button>
                                    <template v-else>
                                        <Button size="sm" variant="ghost" as-child>
                                            <a :href="CustomerController.edit.url({ customer: customer.id })">Edit</a>
                                        </Button>
                                        <Button size="sm" variant="ghost" class="text-destructive" @click="askDelete(customer)">
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!customers.data.length">
                            <td colspan="7" class="text-muted-foreground px-4 py-12 text-center">No customers found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="customers" />
        </div>

        <ConfirmDialog
            v-model:open="confirmDelete"
            title="Archive Customer"
            :description="`Archive &quot;${target?.name}&quot;? Their purchase history will be retained.`"
            confirm-label="Archive"
            @confirm="doDelete"
        />
    </AppLayout>
</template>
