<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { Building2, Mail, Pencil, Phone, Plus, RotateCcw, Search, Trash2 } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as SupplierController from '@/actions/App/Http/Controllers/Admin/SupplierController';
import type { Supplier } from '@/types/models';

interface SupplierRow extends Supplier {
    products_count: number;
    deleted_at: string | null;
}

interface PaginatedSuppliers {
    data: SupplierRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number; last_page: number;
    from: number | null; to: number | null; total: number;
}

const props = defineProps<{
    suppliers: PaginatedSuppliers;
    filters: { search?: string; status?: string };
}>();

const search = ref(props.filters.search ?? '');
const statusFilter = ref(props.filters.status ?? '');

function applyFilters() {
    router.get(SupplierController.index.url(), {
        search: search.value || undefined,
        status: statusFilter.value || undefined,
    }, { preserveState: true, replace: true });
}

let timer: ReturnType<typeof setTimeout>;
function onSearch() { clearTimeout(timer); timer = setTimeout(applyFilters, 350); }

const confirmDelete = ref(false);
const target = ref<SupplierRow | null>(null);

function askDelete(s: SupplierRow) { target.value = s; confirmDelete.value = true; }
function doDelete() {
    if (!target.value) return;
    router.delete(SupplierController.destroy.url({ supplier: target.value.id }), { preserveScroll: true });
}
function restore(id: number) {
    router.post(SupplierController.restore.url({ id }), {}, { preserveScroll: true });
}

function initials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Suppliers', href: SupplierController.index.url() }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Suppliers</h1>
                    <p class="text-muted-foreground text-sm">{{ suppliers.total }} suppliers</p>
                </div>
                <Button as-child>
                    <a :href="SupplierController.create.url()">
                        <Plus class="mr-2 h-4 w-4" />
                        New Supplier
                    </a>
                </Button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input v-model="search" placeholder="Search company, contact, phone, email…" class="pl-9" @input="onSearch" />
                </div>
                <Select v-model="statusFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-40">
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
                            <th class="px-4 py-3 font-medium">Supplier</th>
                            <th class="px-4 py-3 font-medium">Contact</th>
                            <th class="px-4 py-3 font-medium">TIN</th>
                            <th class="px-4 py-3 font-medium">Products</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="s in suppliers.data"
                            :key="s.id"
                            :class="['border-b transition-colors', s.deleted_at ? 'opacity-50' : 'hover:bg-muted/50']"
                        >
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div class="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                                        {{ initials(s.company_name) }}
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ s.company_name }}</p>
                                        <p v-if="s.contact_person" class="text-muted-foreground text-xs">{{ s.contact_person }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <div class="space-y-0.5">
                                    <div v-if="s.phone" class="text-muted-foreground flex items-center gap-1 text-xs">
                                        <Phone class="h-3 w-3" />{{ s.phone }}
                                    </div>
                                    <div v-if="s.email" class="text-muted-foreground flex items-center gap-1 text-xs">
                                        <Mail class="h-3 w-3" />{{ s.email }}
                                    </div>
                                    <span v-if="!s.phone && !s.email" class="text-muted-foreground text-xs">—</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground font-mono text-xs">
                                {{ s.tin ?? '—' }}
                            </td>
                            <td class="px-4 py-3">
                                <Badge variant="secondary" class="text-xs">
                                    <Building2 class="mr-1 h-3 w-3" />
                                    {{ s.products_count }} {{ s.products_count === 1 ? 'product' : 'products' }}
                                </Badge>
                            </td>
                            <td class="px-4 py-3">
                                <Badge v-if="s.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                                <Badge v-else-if="s.is_active" variant="secondary" class="bg-green-100 text-green-800 text-xs">Active</Badge>
                                <Badge v-else variant="outline" class="text-xs">Inactive</Badge>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Button v-if="s.deleted_at" size="sm" variant="ghost" @click="restore(s.id)" title="Restore">
                                        <RotateCcw class="h-4 w-4" />
                                    </Button>
                                    <template v-else>
                                        <Button size="sm" variant="ghost" as-child title="Edit">
                                            <a :href="SupplierController.edit.url({ supplier: s.id })">
                                                <Pencil class="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost" class="text-destructive" @click="askDelete(s)" title="Delete">
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!suppliers.data.length">
                            <td colspan="6" class="text-muted-foreground px-4 py-12 text-center">No suppliers found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="suppliers" />
        </div>

        <ConfirmDialog
            v-model:open="confirmDelete"
            title="Delete Supplier"
            :description="`Delete supplier &quot;${target?.company_name}&quot;? This cannot be undone.`"
            confirm-label="Delete"
            @confirm="doDelete"
        />
    </AppLayout>
</template>
