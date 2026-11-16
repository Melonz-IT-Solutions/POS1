<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useCartStore } from '@/stores/cart';
import { useBarcode } from '@/composables/useBarcode';
import type { ProductSearchResult } from '@/types/pos';
import { useCurrency } from '@/composables/useCurrency';
import ProductThumb from '@/components/pos/ProductThumb.vue';

const cartStore = useCartStore();
const { format } = useCurrency();

const query    = ref('');
const results  = ref<ProductSearchResult[]>([]);
const loading  = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

async function fetchProducts(term: string) {
    if (!term.trim()) {
        results.value = [];
        return;
    }
    loading.value = true;
    try {
        const res = await fetch(`/pos/products/search?q=${encodeURIComponent(term)}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
        });
        const data = await res.json();
        results.value = data.products ?? [];
    } catch {
        results.value = [];
    } finally {
        loading.value = false;
    }
}

async function fetchByBarcode(barcode: string) {
    loading.value = true;
    try {
        const res = await fetch(`/pos/products/barcode?barcode=${encodeURIComponent(barcode)}`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' },
        });
        if (res.ok) {
            const data = await res.json();
            if (data.product) {
                cartStore.addItem(data.product);
                query.value  = '';
                results.value = [];
            }
        }
    } finally {
        loading.value = false;
    }
}

const debouncedSearch = useDebounceFn(fetchProducts, 250);

watch(query, (val) => debouncedSearch(val));

function selectProduct(product: ProductSearchResult) {
    cartStore.addItem(product);
    query.value   = '';
    results.value = [];
    inputRef.value?.focus();
}

// Listen for barcode scans via keyboard
useBarcode({
    onScan: (barcode) => {
        fetchByBarcode(barcode);
    },
});

function onEnter() {
    if (results.value.length === 1) {
        selectProduct(results.value[0]);
    } else if (query.value.length >= 3) {
        fetchByBarcode(query.value);
    }
}
</script>

<template>
    <div class="relative">
        <div class="flex items-center gap-2 px-3 py-2">
            <svg
                class="text-muted-foreground h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                ref="inputRef"
                v-model="query"
                v-focus
                class="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                placeholder="Search product, scan barcode or enter SKU... (F2)"
                autocomplete="off"
                @keydown.enter.prevent="onEnter"
                @keydown.escape="() => { query = ''; results = []; }" />
            <div v-if="loading" class="text-muted-foreground text-sm">...</div>
        </div>

        <!-- Results dropdown -->
        <div
            v-if="results.length > 0"
            class="bg-popover border-border absolute top-full right-0 left-0 z-50 max-h-80 overflow-y-auto rounded-b-lg border border-t-0 shadow-lg">
            <button
                v-for="product in results"
                :key="product.id"
                class="hover:bg-accent flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
                type="button"
                @click="selectProduct(product)">
                <ProductThumb
                    :image-path="product.image_path"
                    :alt="product.name"
                    class="h-10 w-10 rounded-md border" />
                <div class="flex-1 min-w-0">
                    <div class="truncate font-medium">{{ product.name }}</div>
                    <div class="text-muted-foreground flex gap-2 text-xs">
                        <span>{{ product.sku }}</span>
                        <span v-if="product.barcode">· {{ product.barcode }}</span>
                        <span v-if="product.category">· {{ product.category.name }}</span>
                    </div>
                </div>
                <div class="text-right shrink-0">
                    <div class="font-semibold">{{ format(product.selling_price) }}</div>
                    <div
                        :class="product.stock_quantity <= product.minimum_stock ? 'text-destructive' : 'text-muted-foreground'"
                        class="text-xs">
                        Stock: {{ product.stock_quantity }}
                    </div>
                </div>
            </button>
        </div>
    </div>
</template>
