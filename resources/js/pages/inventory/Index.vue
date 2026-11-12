<script setup lang="ts">
import { ref } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import {
    AlertTriangle,
    BarChart3,
    Box,
    ClipboardList,
    PackageOpen,
    Search,
    TrendingDown,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/composables/useCurrency';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';
import type { Category, Product } from '@/types/models';

interface Stats {
    total_products: number;
    low_stock_count: number;
    out_of_stock: number;
    total_value: number;
}

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
    stats: Stats;
    categories: Pick<Category, 'id' | 'name'>[];
    filters: { search?: string; category_id?: string; stock_status?: string };
}>();

const { format } = useCurrency();

const search = ref(props.filters.search ?? '');
const categoryFilter = ref(props.filters.category_id ?? '');
const stockStatus = ref(props.filters.stock_status ?? '');

function applyFilters() {
    router.get(
        InventoryController.index.url(),
        {
            search: search.value || undefined,
            category_id: categoryFilter.value || undefined,
            stock_status: stockStatus.value || undefined,
        },
        { preserveState: true, replace: true },
    );
}

let searchTimer: ReturnType<typeof setTimeout>;
function onSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 350);
}

// Adjustment modal
const adjustOpen = ref(false);
const adjustProduct = ref<Product | null>(null);

const adjustForm = useForm({
    new_quantity: 0,
    reason: '',
});

function openAdjust(product: Product) {
    adjustProduct.value = product;
    adjustForm.new_quantity = product.stock_quantity;
    adjustForm.reason = '';
    adjustOpen.value = true;
}

function submitAdjust() {
    if (!adjustProduct.value) return;
    adjustForm.post(InventoryController.adjust.url({ product: adjustProduct.value.id }), {
        preserveScroll: true,
        onSuccess: () => { adjustOpen.value = false; },
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Inventory', href: InventoryController.index.url() }]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Stock Overview</h1>
                    <p class="text-muted-foreground text-sm">Monitor and adjust inventory levels</p>
                </div>
                <Button variant="outline" as-child>
                    <a :href="InventoryController.allMovements.url()">
                        <ClipboardList class="mr-2 h-4 w-4" />
                        All Movements
                    </a>
                </Button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-4 gap-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-2 text-muted-foreground text-sm">
                        <Box class="h-4 w-4" />
                        Total Products
                    </div>
                    <p class="text-2xl font-bold">{{ stats.total_products }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-2 text-orange-600 text-sm">
                        <AlertTriangle class="h-4 w-4" />
                        Low Stock
                    </div>
                    <p class="text-2xl font-bold text-orange-600">{{ stats.low_stock_count }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-2 text-destructive text-sm">
                        <PackageOpen class="h-4 w-4" />
                        Out of Stock
                    </div>
                    <p class="text-2xl font-bold text-destructive">{{ stats.out_of_stock }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-2 text-muted-foreground text-sm">
                        <BarChart3 class="h-4 w-4" />
                        Inventory Value
                    </div>
                    <p class="text-2xl font-bold">{{ format(stats.total_value) }}</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                        v-model="search"
                        placeholder="Search products…"
                        class="pl-9"
                        @input="onSearch"
                    />
                </div>
                <Select v-model="categoryFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-44">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        <SelectItem v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
                            {{ cat.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select v-model="stockStatus" @update:model-value="applyFilters">
                    <SelectTrigger class="w-36">
                        <SelectValue placeholder="All stock" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All stock</SelectItem>
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="low">Low Stock</SelectItem>
                        <SelectItem value="out">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Table -->
            <div class="rounded-xl border">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b text-left">
                            <th class="px-4 py-3 font-medium">Product</th>
                            <th class="px-4 py-3 font-medium">SKU</th>
                            <th class="px-4 py-3 font-medium text-center">On Hand</th>
                            <th class="px-4 py-3 font-medium text-center">Min Stock</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium text-right">Cost Value</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="product in products.data"
                            :key="product.id"
                            class="border-b transition-colors hover:bg-muted/50"
                        >
                            <td class="px-4 py-3">
                                <p class="font-medium">{{ product.name }}</p>
                                <p class="text-muted-foreground text-xs">{{ product.category?.name }}</p>
                            </td>
                            <td class="px-4 py-3 font-mono text-xs text-muted-foreground">{{ product.sku }}</td>
                            <td class="px-4 py-3 text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <span
                                        :class="[
                                            'text-lg font-bold',
                                            product.stock_quantity === 0 ? 'text-destructive' :
                                            product.stock_quantity <= product.minimum_stock && product.minimum_stock > 0 ? 'text-orange-600' : ''
                                        ]"
                                    >
                                        {{ product.stock_quantity }}
                                    </span>
                                    <span class="text-muted-foreground text-xs">{{ product.unit_of_measure }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-center text-muted-foreground">{{ product.minimum_stock }}</td>
                            <td class="px-4 py-3">
                                <Badge
                                    v-if="product.stock_quantity === 0"
                                    variant="destructive"
                                    class="text-xs"
                                >
                                    Out of Stock
                                </Badge>
                                <Badge
                                    v-else-if="product.stock_quantity <= product.minimum_stock && product.minimum_stock > 0"
                                    class="bg-orange-100 text-orange-800 text-xs"
                                >
                                    <AlertTriangle class="mr-1 h-3 w-3" />
                                    Low Stock
                                </Badge>
                                <Badge v-else variant="secondary" class="bg-green-100 text-green-800 text-xs">
                                    OK
                                </Badge>
                            </td>
                            <td class="px-4 py-3 text-right font-mono text-sm">
                                {{ format(product.cost_price * product.stock_quantity) }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Button size="sm" variant="outline" @click="openAdjust(product)">
                                        Adjust
                                    </Button>
                                    <Button size="sm" variant="ghost" as-child>
                                        <a :href="InventoryController.movements.url({ product: product.id })" title="View movements">
                                            <ClipboardList class="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!products.data.length">
                            <td colspan="7" class="text-muted-foreground px-4 py-12 text-center">
                                No products found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="products" />
        </div>

        <!-- Adjust Stock Modal -->
        <Dialog v-model:open="adjustOpen">
            <DialogContent class="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Adjust Stock</DialogTitle>
                </DialogHeader>

                <div class="space-y-4 py-2">
                    <p class="text-sm font-medium">{{ adjustProduct?.name }}</p>
                    <p class="text-muted-foreground text-sm">
                        Current: <strong>{{ adjustProduct?.stock_quantity }} {{ adjustProduct?.unit_of_measure }}</strong>
                    </p>

                    <div class="space-y-1.5">
                        <Label for="new_qty">New Quantity</Label>
                        <Input
                            id="new_qty"
                            v-model.number="adjustForm.new_quantity"
                            type="number"
                            min="0"
                            autofocus
                        />
                        <p v-if="adjustProduct && adjustForm.new_quantity !== adjustProduct.stock_quantity"
                            :class="[
                                'text-xs font-medium',
                                adjustForm.new_quantity > (adjustProduct?.stock_quantity ?? 0) ? 'text-green-600' : 'text-orange-600'
                            ]"
                        >
                            {{ adjustForm.new_quantity > (adjustProduct?.stock_quantity ?? 0) ? '+' : '' }}{{ adjustForm.new_quantity - (adjustProduct?.stock_quantity ?? 0) }} units
                        </p>
                    </div>

                    <div class="space-y-1.5">
                        <Label for="reason">Reason <span class="text-destructive">*</span></Label>
                        <Input
                            id="reason"
                            v-model="adjustForm.reason"
                            placeholder="e.g. Physical count correction"
                        />
                        <p v-if="adjustForm.errors.reason" class="text-destructive text-xs">{{ adjustForm.errors.reason }}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="adjustOpen = false">Cancel</Button>
                    <Button @click="submitAdjust" :disabled="adjustForm.processing">
                        {{ adjustForm.processing ? 'Adjusting…' : 'Apply Adjustment' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
