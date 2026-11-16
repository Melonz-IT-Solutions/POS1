<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useCurrency } from '@/composables/useCurrency';
import type { Category } from '@/types/models';
import type { ProductSearchResult } from '@/types/pos';
import ProductThumb from '@/components/pos/ProductThumb.vue';

const props = defineProps<{
    categories: Category[];
}>();

const cart = useCartStore();
const { format } = useCurrency();

// ── Category selection ─────────────────────────────────────────────────────
// Flatten category tree: roots first, then their children indented
interface FlatCategory {
    id: number;
    name: string;
    depth: number;
}

const flatCategories = (() => {
    const list: FlatCategory[] = [];
    for (const cat of props.categories) {
        list.push({ id: cat.id, name: cat.name, depth: 0 });
        for (const child of cat.children ?? []) {
            list.push({ id: child.id, name: child.name, depth: 1 });
        }
    }
    return list;
})();

const selectedCategoryId = ref<number | null>(null); // null = All

// ── Product data ───────────────────────────────────────────────────────────
const products = ref<ProductSearchResult[]>([]);
const loading  = ref(false);

async function loadProducts(categoryId: number | null) {
    loading.value = true;
    try {
        const url = categoryId
            ? `/pos/products/browse?category_id=${categoryId}`
            : '/pos/products/browse';
        const res = await fetch(url, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        const data = await res.json();
        products.value = data.products ?? [];
    } catch {
        products.value = [];
    } finally {
        loading.value = false;
    }
}

watch(selectedCategoryId, (id) => loadProducts(id));
onMounted(() => loadProducts(null));

// ── Add to cart with flash feedback ───────────────────────────────────────
const flashId = ref<number | null>(null);

function addToCart(product: ProductSearchResult) {
    if (product.stock_quantity <= 0) return;
    cart.addItem(product);
    flashId.value = product.id;
    setTimeout(() => { if (flashId.value === product.id) flashId.value = null; }, 400);
}

// ── Search within browse ───────────────────────────────────────────────────
const gridSearch = ref('');

const filteredProducts = (() => {
    return () => {
        const q = gridSearch.value.trim().toLowerCase();
        if (!q) return products.value;
        return products.value.filter(
            p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        );
    };
})();
</script>

<template>
    <div class="flex flex-col h-full overflow-hidden">

        <!-- Category tab bar -->
        <div class="border-b bg-muted/30 overflow-x-auto shrink-0">
            <div class="flex items-center gap-1 px-2 py-2 min-w-max">
                <button
                    class="rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap"
                    :class="selectedCategoryId === null
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'"
                    @click="selectedCategoryId = null"
                >
                    All
                </button>
                <button
                    v-for="cat in flatCategories"
                    :key="cat.id"
                    class="rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap"
                    :class="[
                        selectedCategoryId === cat.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-muted-foreground',
                        cat.depth === 1 ? 'ml-1 opacity-80' : '',
                    ]"
                    @click="selectedCategoryId = cat.id"
                >
                    {{ cat.depth === 1 ? '· ' : '' }}{{ cat.name }}
                </button>
            </div>
        </div>

        <!-- Grid search filter -->
        <div class="border-b px-3 py-1.5 shrink-0">
            <input
                v-model="gridSearch"
                type="text"
                placeholder="Filter products…"
                class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
        </div>

        <!-- Product grid -->
        <div class="flex-1 overflow-y-auto p-2">

            <!-- Loading skeleton -->
            <div v-if="loading" class="grid grid-cols-3 gap-2">
                <div
                    v-for="n in 9"
                    :key="n"
                    class="animate-pulse rounded-xl border bg-muted h-40"
                />
            </div>

            <!-- Empty state -->
            <div
                v-else-if="filteredProducts().length === 0"
                class="flex flex-col items-center justify-center h-full py-16 text-muted-foreground text-sm"
            >
                <div class="text-3xl mb-2 opacity-30">📦</div>
                <p>No products found</p>
            </div>

            <!-- Cards -->
            <div v-else class="grid grid-cols-3 gap-2">
                <button
                    v-for="product in filteredProducts()"
                    :key="product.id"
                    type="button"
                    :disabled="product.stock_quantity <= 0"
                    class="relative rounded-xl border p-2.5 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary"
                    :class="[
                        product.stock_quantity <= 0
                            ? 'opacity-40 cursor-not-allowed bg-muted/40'
                            : flashId === product.id
                                ? 'bg-primary/15 border-primary scale-95'
                                : 'hover:border-primary/50 hover:bg-muted/40 active:scale-95',
                    ]"
                    @click="addToCart(product)"
                >
                    <!-- Image -->
                    <ProductThumb
                        :image-path="product.image_path"
                        :alt="product.name"
                        icon-class="h-8 w-8"
                        class="mb-2 aspect-square w-full rounded-lg" />

                    <!-- Stock badge -->
                    <div class="absolute top-1.5 right-1.5 z-10">
                        <span
                            v-if="product.stock_quantity <= 0"
                            class="text-[9px] font-bold uppercase rounded-full px-1.5 py-0.5 bg-destructive/20 text-destructive"
                        >Out</span>
                        <span
                            v-else-if="product.stock_quantity <= product.minimum_stock"
                            class="text-[9px] font-bold rounded-full px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                        >{{ product.stock_quantity }}</span>
                    </div>

                    <!-- Flash check -->
                    <div
                        v-if="flashId === product.id"
                        class="absolute inset-0 flex items-center justify-center rounded-xl bg-primary/10"
                    >
                        <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <!-- Product info -->
                    <div>
                        <p class="text-xs font-semibold leading-snug line-clamp-2 mb-1">{{ product.name }}</p>
                        <p class="text-[10px] text-muted-foreground">{{ product.sku }}</p>
                    </div>
                    <p class="mt-1.5 text-sm font-bold text-primary tabular-nums">{{ format(product.selling_price) }}</p>
                </button>
            </div>
        </div>
    </div>
</template>
