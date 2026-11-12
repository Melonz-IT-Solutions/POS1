<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { usePosStore } from '@/stores/pos';
import { useCurrency } from '@/composables/useCurrency';
import type { Sale } from '@/types/models';

const cart   = useCartStore();
const pos    = usePosStore();
const { format } = useCurrency();

const heldSales = ref<Sale[]>([]);
const loading   = ref(false);
const saving    = ref(false);

async function loadHeld() {
    loading.value = true;
    try {
        const res = await fetch('/pos/sales/held', {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        const data = await res.json();
        heldSales.value = data.held_sales ?? [];
    } finally {
        loading.value = false;
    }
}

async function holdCurrent() {
    if (cart.isEmpty) return;
    saving.value = true;

    const payload = {
        items: cart.computedItems.map((item) => ({
            product_id:      item.product_id,
            product_name:    item.product_name,
            product_sku:     item.product_sku,
            product_barcode: item.product_barcode,
            unit_price:      item.unit_price,
            cost_price:      item.cost_price,
            vat_type:        item.vat_type,
            quantity:        item.quantity,
        })),
        payments:    [],
        customer_id: cart.customer?.id ?? null,
    };

    try {
        await fetch('/pos/sales/hold', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
            },
            body: JSON.stringify(payload),
        });
        cart.clearCart();
        await loadHeld();
    } finally {
        saving.value = false;
    }
}

async function resume(sale: Sale) {
    const res  = await fetch(`/pos/sales/${sale.id}/resume`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
        },
    });
    const data = await res.json();
    if (data.sale) {
        cart.restoreFromHeld(
            data.sale.items ?? [],
            data.sale.customer ?? null,
        );
        pos.closeModal();
    }
}

onMounted(loadHeld);
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div class="bg-background flex w-full max-w-lg flex-col rounded-xl border shadow-2xl" style="max-height: 85vh">
            <div class="flex items-center justify-between border-b px-5 py-4">
                <h2 class="font-semibold">Held Transactions</h2>
                <button @click="pos.closeModal" class="text-muted-foreground hover:text-foreground">×</button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-3">
                <!-- Hold current cart -->
                <div v-if="!cart.isEmpty" class="border rounded-lg p-3 bg-muted/30">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-medium">Current Cart</div>
                        <div class="text-sm">{{ format(cart.summary.total_amount) }}</div>
                    </div>
                    <div class="text-muted-foreground text-xs mt-0.5">
                        {{ cart.summary.item_count }} item(s)
                    </div>
                    <button
                        :disabled="saving"
                        class="mt-2 w-full rounded-lg border py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
                        @click="holdCurrent">
                        {{ saving ? 'Saving...' : 'Hold This Transaction' }}
                    </button>
                </div>

                <!-- Held list -->
                <div v-if="loading" class="text-muted-foreground py-8 text-center text-sm">Loading...</div>
                <div v-else-if="heldSales.length === 0" class="text-muted-foreground py-8 text-center text-sm">
                    No held transactions.
                </div>
                <div
                    v-for="sale in heldSales"
                    :key="sale.id"
                    class="border rounded-lg p-3 hover:bg-muted/30 transition-colors">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="font-medium text-sm">{{ sale.receipt_number }}</div>
                            <div class="text-muted-foreground text-xs">
                                {{ sale.customer?.name ?? 'Walk-in' }}
                                · {{ (sale.items?.length ?? 0) }} item(s)
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-semibold">{{ format(sale.total_amount) }}</div>
                            <button
                                class="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 rounded-md px-3 py-1 text-xs font-medium"
                                @click="resume(sale)">
                                Resume
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
