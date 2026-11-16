<script setup lang="ts">
import { computed } from 'vue';
import { Minus, Plus } from '@lucide/vue';
import { useCartStore } from '@/stores/cart';
import { useCurrency } from '@/composables/useCurrency';
import type { CartItem } from '@/types/pos';
import ProductThumb from '@/components/pos/ProductThumb.vue';

const props = defineProps<{ item: CartItem }>();
const cartStore = useCartStore();
const { format } = useCurrency();

const lineTotal = computed(() => {
    const gross = props.item.unit_price * props.item.quantity;
    const disc  = props.item.discount_amount;
    return gross - disc;
});

function decrement() {
    cartStore.updateQuantity(props.item.product_id, props.item.quantity - 1);
}

function increment() {
    cartStore.updateQuantity(props.item.product_id, props.item.quantity + 1);
}

function remove() {
    cartStore.removeItem(props.item.product_id);
}

function updateQty(e: Event) {
    const val = parseInt((e.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) cartStore.updateQuantity(props.item.product_id, val);
}
</script>

<template>
    <div class="hover:bg-muted/30 flex items-center gap-3 border-b px-4 py-3 transition-colors last:border-b-0">
        <!-- Thumbnail -->
        <ProductThumb
            :image-path="item.product_image"
            :alt="item.product_name"
            icon-class="h-4 w-4"
            class="h-10 w-10 rounded-md border" />

        <!-- Product info -->
        <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium">{{ item.product_name }}</div>
            <div class="text-muted-foreground text-xs">
                {{ item.product_sku }}
                <span v-if="item.vat_type !== 'vatable'" class="ml-1 font-medium text-orange-500">
                    {{ item.vat_type === 'vat_exempt' ? 'VAT-Exempt' : 'Zero-Rated' }}
                </span>
            </div>
            <div v-if="item.discount_amount > 0" class="text-xs text-green-600">
                -{{ format(item.discount_amount) }} discount
            </div>
        </div>

        <!-- Unit price -->
        <div class="text-muted-foreground hidden text-sm sm:block">
            {{ format(item.unit_price) }}
        </div>

        <!-- Quantity controls -->
        <div class="flex items-center rounded-lg border overflow-hidden">
            <button
                class="flex h-9 w-9 shrink-0 items-center justify-center bg-muted hover:bg-muted/70 active:bg-muted/90 transition-colors border-r"
                type="button"
                @click="decrement">
                <Minus class="h-3.5 w-3.5" />
            </button>
            <input
                :value="item.quantity"
                class="h-9 w-12 bg-background text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                min="1"
                type="number"
                @change="updateQty" />
            <button
                class="flex h-9 w-9 shrink-0 items-center justify-center bg-muted hover:bg-muted/70 active:bg-muted/90 transition-colors border-l"
                type="button"
                @click="increment">
                <Plus class="h-3.5 w-3.5" />
            </button>
        </div>

        <!-- Line total -->
        <div class="w-24 text-right text-sm font-semibold">
            {{ format(lineTotal) }}
        </div>

        <!-- Remove -->
        <button
            class="text-muted-foreground hover:text-destructive ml-1 p-1 transition-colors"
            type="button"
            @click="remove">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>
