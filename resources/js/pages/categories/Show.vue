<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    AlertTriangle,
    CheckCircle2,
    FolderOpen,
    Layers,
    Package,
    Pencil,
    Tag,
    TrendingUp,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/composables/useCurrency';
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import type { Category, Product } from '@/types/models';

interface CategoryDetail extends Category {
    parent?: Pick<Category, 'id' | 'name'> | null;
    children?: (Category & { products_count: number })[];
    deleted_at: string | null;
}

interface ProductRow extends Pick<Product, 'id' | 'name' | 'sku' | 'selling_price' | 'stock_quantity' | 'minimum_stock' | 'is_active'> {
    deleted_at: string | null;
}

const props = defineProps<{
    category: CategoryDetail;
    products: ProductRow[];
    stats: {
        total_products: number;
        active_products: number;
        total_stock: number;
        stock_value: number;
    };
    canEdit: boolean;
}>();

const { format } = useCurrency();

const search = ref('');

const filteredProducts = computed(() => {
    const q = search.value.toLowerCase().trim();
    if (!q) return props.products;
    return props.products.filter(p =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
});

function stockClass(p: ProductRow): string {
    if (p.stock_quantity === 0) return 'text-destructive font-semibold';
    if (p.stock_quantity <= p.minimum_stock) return 'text-amber-600 font-semibold';
    return '';
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Categories', href: CategoryController.index.url() },
        { title: category.name, href: CategoryController.show.url({ category: category.id }) },
    ]">
        <div class="p-6 space-y-6 max-w-5xl">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex items-start gap-4">
                    <div class="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-xl">
                        <FolderOpen class="h-7 w-7" />
                    </div>
                    <div>
                        <div class="flex items-center gap-3 flex-wrap">
                            <h1 class="text-2xl font-bold">{{ category.name }}</h1>
                            <Badge v-if="category.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                            <Badge v-else-if="category.is_active" class="text-xs bg-green-100 text-green-800">Active</Badge>
                            <Badge v-else variant="outline" class="text-xs">Inactive</Badge>
                        </div>
                        <div class="flex items-center gap-3 mt-1 flex-wrap">
                            <code class="text-xs bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">{{ category.slug }}</code>
                            <span v-if="category.parent" class="text-muted-foreground text-sm flex items-center gap-1">
                                <Layers class="h-3.5 w-3.5" />
                                Sub-category of
                                <a
                                    :href="CategoryController.show.url({ category: category.parent.id })"
                                    class="text-primary hover:underline font-medium"
                                >{{ category.parent.name }}</a>
                            </span>
                        </div>
                        <p v-if="category.description" class="text-muted-foreground text-sm mt-1">{{ category.description }}</p>
                    </div>
                </div>
                <Button v-if="canEdit && !category.deleted_at" as-child>
                    <a :href="CategoryController.edit.url({ category: category.id })">
                        <Pencil class="mr-2 h-4 w-4" />Edit Category
                    </a>
                </Button>
            </div>

            <!-- Stat cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <Tag class="h-3 w-3" />Total Products
                    </p>
                    <p class="text-2xl font-bold">{{ stats.total_products }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <CheckCircle2 class="h-3 w-3" />Active Products
                    </p>
                    <p class="text-2xl font-bold">{{ stats.active_products }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <Package class="h-3 w-3" />Units in Stock
                    </p>
                    <p class="text-2xl font-bold">{{ stats.total_stock.toLocaleString() }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <TrendingUp class="h-3 w-3" />Stock Value
                    </p>
                    <p class="text-2xl font-bold">{{ format(stats.stock_value) }}</p>
                </div>
            </div>

            <!-- Subcategories -->
            <div v-if="category.children?.length" class="space-y-3">
                <h2 class="font-semibold flex items-center gap-2">
                    <Layers class="h-4 w-4 text-muted-foreground" />Sub-categories
                    <span class="text-muted-foreground text-sm font-normal">({{ category.children.length }})</span>
                </h2>
                <div class="flex flex-wrap gap-2">
                    <a
                        v-for="child in category.children"
                        :key="child.id"
                        :href="CategoryController.show.url({ category: child.id })"
                        class="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                        :class="child.deleted_at ? 'opacity-50' : ''"
                    >
                        <FolderOpen class="h-3.5 w-3.5 text-primary" />
                        <span class="font-medium">{{ child.name }}</span>
                        <span class="text-muted-foreground text-xs">{{ child.products_count ?? 0 }} products</span>
                    </a>
                </div>
            </div>

            <!-- Products -->
            <div class="space-y-3">
                <div class="flex items-center justify-between gap-4">
                    <h2 class="font-semibold flex items-center gap-2">
                        <Tag class="h-4 w-4 text-muted-foreground" />Products
                        <span class="text-muted-foreground text-sm font-normal">({{ products.length }})</span>
                    </h2>
                    <div class="relative w-56">
                        <Input v-model="search" placeholder="Filter products…" class="h-8 text-sm" />
                    </div>
                </div>

                <div v-if="products.length" class="rounded-xl border overflow-hidden">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-4 py-2.5 font-medium">Product</th>
                                <th class="px-4 py-2.5 font-medium">SKU</th>
                                <th class="px-4 py-2.5 font-medium text-right">Price</th>
                                <th class="px-4 py-2.5 font-medium text-right">Stock</th>
                                <th class="px-4 py-2.5 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr
                                v-for="p in filteredProducts"
                                :key="p.id"
                                :class="['hover:bg-muted/20', p.deleted_at ? 'opacity-50' : '']"
                            >
                                <td class="px-4 py-2.5">
                                    <a
                                        :href="ProductController.show.url({ product: p.id })"
                                        class="font-medium hover:underline"
                                    >{{ p.name }}</a>
                                </td>
                                <td class="px-4 py-2.5 font-mono text-xs text-muted-foreground">{{ p.sku }}</td>
                                <td class="px-4 py-2.5 text-right tabular-nums">{{ format(p.selling_price) }}</td>
                                <td class="px-4 py-2.5 text-right tabular-nums" :class="stockClass(p)">
                                    <span class="flex items-center justify-end gap-1">
                                        <AlertTriangle v-if="p.stock_quantity <= p.minimum_stock && !p.deleted_at" class="h-3.5 w-3.5" />
                                        {{ p.stock_quantity }}
                                    </span>
                                </td>
                                <td class="px-4 py-2.5">
                                    <Badge v-if="p.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                                    <Badge v-else-if="p.is_active" class="text-xs bg-green-100 text-green-800">Active</Badge>
                                    <Badge v-else variant="outline" class="text-xs">Inactive</Badge>
                                </td>
                            </tr>
                            <tr v-if="!filteredProducts.length">
                                <td colspan="5" class="text-muted-foreground px-4 py-8 text-center text-sm">
                                    No products match your filter.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-else class="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                    <Tag class="mx-auto h-8 w-8 mb-2 opacity-30" />
                    <p class="text-sm">No products in this category yet.</p>
                    <Button as-child class="mt-4" variant="outline" size="sm">
                        <a :href="ProductController.create.url()">Add Product</a>
                    </Button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
