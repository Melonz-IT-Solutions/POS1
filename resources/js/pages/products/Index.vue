<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    AlertTriangle,
    Archive,
    Eye,
    Pencil,
    Plus,
    Printer,
    RotateCcw,
    Search,
    Trash2,
    Upload,
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
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import * as ProductImportController from '@/actions/App/Http/Controllers/Admin/ProductImportController';
import type { Category, Product } from '@/types/models';

interface PaginatedProducts {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

const props = defineProps<{
    products: PaginatedProducts;
    categories: Pick<Category, 'id' | 'name'>[];
    filters: { search?: string; category_id?: string; status?: string };
}>();

const { format } = useCurrency();

const search = ref(props.filters.search ?? '');
const categoryFilter = ref(props.filters.category_id ?? 'all');
const statusFilter = ref(props.filters.status ?? 'all');

function applyFilters() {
    router.get(
        ProductController.index.url(),
        {
            search: search.value || undefined,
            category_id: categoryFilter.value === 'all' ? undefined : categoryFilter.value,
            status: statusFilter.value === 'all' ? undefined : statusFilter.value,
        },
        { preserveState: true, replace: true },
    );
}

let searchTimer: ReturnType<typeof setTimeout>;
function onSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 350);
}

const confirmDelete = ref(false);
const targetProduct = ref<Product | null>(null);

function askDelete(p: Product) {
    targetProduct.value = p;
    confirmDelete.value = true;
}

function doDelete() {
    if (!targetProduct.value) return;
    router.delete(ProductController.destroy.url({ product: targetProduct.value.id }), {
        preserveScroll: true,
    });
}

function restore(id: number) {
    router.post(ProductController.restore.url({ id }), {}, { preserveScroll: true });
}

const vatLabel: Record<string, string> = {
    vatable: 'VATable',
    vat_exempt: 'Exempt',
    zero_rated: '0%',
};

// ── Label selection ───────────────────────────────────────────────────────
const selectedIds = ref<number[]>([]);

const allPageIds = computed(() =>
    props.products.data.filter(p => !p.deleted_at).map(p => p.id)
);
const allSelected = computed(() =>
    allPageIds.value.length > 0 && allPageIds.value.every(id => selectedIds.value.includes(id))
);

function toggleAll() {
    if (allSelected.value) {
        selectedIds.value = selectedIds.value.filter(id => !allPageIds.value.includes(id));
    } else {
        selectedIds.value = [...new Set([...selectedIds.value, ...allPageIds.value])];
    }
}

function toggleOne(id: number) {
    if (selectedIds.value.includes(id)) {
        selectedIds.value = selectedIds.value.filter(i => i !== id);
    } else {
        selectedIds.value = [...selectedIds.value, id];
    }
}

function printLabelsUrl(): string {
    const params = selectedIds.value.map(id => `ids[]=${id}`).join('&');
    return ProductController.labels.url() + '?' + params;
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Products', href: ProductController.index.url() }]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Products</h1>
                    <p class="text-muted-foreground text-sm">{{ products.total }} products total</p>
                </div>
                <div class="flex gap-2">
                    <Button v-if="selectedIds.length > 0" variant="outline" as-child>
                        <a :href="printLabelsUrl()" target="_blank">
                            <Printer class="mr-2 h-4 w-4" />
                            Print Labels ({{ selectedIds.length }})
                        </a>
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="ProductImportController.create.url()">
                            <Upload class="mr-2 h-4 w-4" />
                            Import CSV
                        </a>
                    </Button>
                    <Button as-child>
                        <a :href="ProductController.create.url()">
                            <Plus class="mr-2 h-4 w-4" />
                            New Product
                        </a>
                    </Button>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                        v-model="search"
                        placeholder="Search name, SKU, barcode…"
                        class="pl-9"
                        @input="onSearch"
                    />
                </div>
                <Select v-model="categoryFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-44">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        <SelectItem v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
                            {{ cat.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select v-model="statusFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-36">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Table -->
            <div class="rounded-xl border">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b text-left">
                            <th class="px-4 py-3 w-8">
                                <input
                                    type="checkbox"
                                    :checked="allSelected"
                                    class="rounded"
                                    @change="toggleAll"
                                />
                            </th>
                            <th class="px-4 py-3 font-medium">Product</th>
                            <th class="px-4 py-3 font-medium">Category</th>
                            <th class="px-4 py-3 font-medium">SKU / Barcode</th>
                            <th class="px-4 py-3 font-medium text-right">Cost</th>
                            <th class="px-4 py-3 font-medium text-right">Price</th>
                            <th class="px-4 py-3 font-medium text-center">Stock</th>
                            <th class="px-4 py-3 font-medium">VAT</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="product in products.data"
                            :key="product.id"
                            :class="[
                                'border-b transition-colors',
                                product.deleted_at ? 'opacity-50' : 'hover:bg-muted/50',
                            ]"
                        >
                            <td class="px-4 py-3 w-8">
                                <input
                                    v-if="!product.deleted_at"
                                    type="checkbox"
                                    :checked="selectedIds.includes(product.id)"
                                    class="rounded"
                                    @change="toggleOne(product.id)"
                                />
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div v-if="product.image_path" class="h-10 w-10 rounded-md overflow-hidden shrink-0">
                                        <img :src="`/storage/${product.image_path}`" :alt="product.name" class="h-full w-full object-cover" />
                                    </div>
                                    <div v-else class="bg-muted h-10 w-10 rounded-md shrink-0 flex items-center justify-center text-muted-foreground text-xs">
                                        IMG
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ product.name }}</p>
                                        <p v-if="product.description" class="text-muted-foreground text-xs line-clamp-1">{{ product.description }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground">{{ product.category?.name ?? '—' }}</td>
                            <td class="px-4 py-3">
                                <p class="font-mono text-xs">{{ product.sku }}</p>
                                <p v-if="product.barcode" class="font-mono text-xs text-muted-foreground">{{ product.barcode }}</p>
                            </td>
                            <td class="px-4 py-3 text-right font-mono">{{ format(product.cost_price) }}</td>
                            <td class="px-4 py-3 text-right font-mono font-medium">{{ format(product.selling_price) }}</td>
                            <td class="px-4 py-3 text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <span :class="product.stock_quantity <= product.minimum_stock && product.minimum_stock > 0 ? 'text-orange-600 font-semibold' : ''">
                                        {{ product.stock_quantity }}
                                    </span>
                                    <AlertTriangle
                                        v-if="product.stock_quantity <= product.minimum_stock && product.minimum_stock > 0"
                                        class="h-3.5 w-3.5 text-orange-500"
                                    />
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <Badge variant="outline" class="text-xs">{{ vatLabel[product.vat_type] ?? product.vat_type }}</Badge>
                            </td>
                            <td class="px-4 py-3">
                                <Badge v-if="product.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                                <Badge v-else-if="!product.is_active" variant="outline" class="text-xs">Inactive</Badge>
                                <Badge v-else variant="secondary" class="bg-green-100 text-green-800 text-xs">Active</Badge>
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Button v-if="product.deleted_at" size="sm" variant="ghost" @click="restore(product.id)" title="Restore">
                                        <RotateCcw class="h-4 w-4" />
                                    </Button>
                                    <template v-else>
                                        <Button size="sm" variant="ghost" as-child>
                                            <a :href="ProductController.show.url({ product: product.id })" title="View">
                                                <Eye class="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost" as-child>
                                            <a :href="ProductController.edit.url({ product: product.id })" title="Edit">
                                                <Pencil class="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost" class="text-destructive" @click="askDelete(product)" title="Archive">
                                            <Archive class="h-4 w-4" />
                                        </Button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!products.data.length">
                            <td colspan="10" class="text-muted-foreground px-4 py-12 text-center">
                                No products found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="products" />
        </div>

        <ConfirmDialog
            v-model:open="confirmDelete"
            title="Archive Product"
            :description="`Archive &quot;${targetProduct?.name}&quot;? It will be hidden from the POS but can be restored later.`"
            confirm-label="Archive"
            @confirm="doDelete"
        />
    </AppLayout>
</template>
