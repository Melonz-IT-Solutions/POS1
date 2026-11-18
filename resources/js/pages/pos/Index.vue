<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { usePosStore } from '@/stores/pos';
import { useSettingsStore } from '@/stores/settings';
import { useCurrency } from '@/composables/useCurrency';

import ProductSearch from '@/components/pos/ProductSearch.vue';
import ProductGrid from '@/components/pos/ProductGrid.vue';
import CartItem from '@/components/pos/CartItem.vue';
import CartSummary from '@/components/pos/CartSummary.vue';
import PaymentModal from '@/components/pos/PaymentModal.vue';
import DiscountModal from '@/components/pos/DiscountModal.vue';
import HoldTransactionPanel from '@/components/pos/HoldTransactionPanel.vue';
import SupervisorAuthModal from '@/components/pos/SupervisorAuthModal.vue';
import CloseShiftModal from '@/components/pos/CloseShiftModal.vue';
import SeniorPwdModal from '@/components/pos/SeniorPwdModal.vue';

import {
    ShoppingCart,
    Search,
    Grid3x3,
    PhilippinePeso
} from '@lucide/vue';

import type { Category, PaymentMethod, Shift } from '@/types/models';
import type { POSSettings } from '@/types/pos';

// ── Props (from Inertia server) ───────────────────────────────────────────
const props = defineProps<{
    shift: Shift | null;
    settings: POSSettings;
    categories: Category[];
    paymentMethods: PaymentMethod[];
}>();

// ── Stores ────────────────────────────────────────────────────────────────
const cart     = useCartStore();
const pos      = usePosStore();
const settings = useSettingsStore();
const { format } = useCurrency();

// ── Init ──────────────────────────────────────────────────────────────────
onMounted(() => {
    settings.initialize(props.settings);
    pos.paymentMethods = props.paymentMethods;
    pos.setShift(props.shift);
});

// ── Shift modal ───────────────────────────────────────────────────────────
const showShiftModal    = ref(!props.shift);
const openingFloat      = ref(0);
const shiftLoading      = ref(false);

async function openShift() {
    shiftLoading.value = true;
    try {
        const res = await fetch('/pos/shifts/open', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''),
            },
            body: JSON.stringify({ opening_float: openingFloat.value }),
        });
        const data = await res.json();
        if (res.ok) {
            pos.setShift(data.shift);
            showShiftModal.value = false;
        }
    } finally {
        shiftLoading.value = false;
    }
}

// ── Customer lookup ───────────────────────────────────────────────────────
const customerQuery   = ref('');
const customerResults = ref<any[]>([]);
const showCustomerDd  = ref(false);

async function searchCustomers(term: string) {
    if (!term.trim()) {
        customerResults.value = [];
        return;
    }
    const res  = await fetch(`/pos/customers/search?q=${encodeURIComponent(term)}`, {
        headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    });
    const data = await res.json();
    customerResults.value = data.customers ?? [];
    showCustomerDd.value  = true;
}

function selectCustomer(c: any) {
    cart.setCustomer(c);
    customerQuery.value  = c.name;
    showCustomerDd.value = false;
}

function clearCustomer() {
    cart.setCustomer(null);
    customerQuery.value = '';
}

function backToDashboard() {
    window.location.href = '/dashboard';
}

// ── Time display ─────────────────────────────────────────────────────────
const currentTime = ref(new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }));
setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
}, 10000);

// ── Keyboard shortcuts ────────────────────────────────────────────────────
function handleGlobalKey(e: KeyboardEvent) {
    if (pos.activeModal) return;
    if (e.key === 'F2') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.barcode-search')?.focus();
    }
    if (e.key === 'F12' || (e.ctrlKey && e.key === 'Enter')) {
        e.preventDefault();
        if (!cart.isEmpty) pos.openModal('payment');
    }
    if (e.key === 'Escape') {
        cart.clearCart();
    }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKey));

const hasActiveShift = computed(() => pos.shift !== null);

// ── Panel mode: search vs browse ──────────────────────────────────────────
const panelMode = ref<'search' | 'browse'>('search');
</script>

<template>
    <div class="bg-background flex h-screen flex-col overflow-hidden">

        <!-- ── Shift Open Modal ─────────────────────────────────────────── -->
        <div v-if="showShiftModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div class="bg-background w-full max-w-sm rounded-xl border p-6 shadow-2xl">
                <div class="mb-4 text-center">
                    <div class="bg-primary/10 text-primary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-xl">
                        <PhilippinePeso class="h-6 w-6" />
                    </div>
                    <h2 class="text-lg font-semibold">Open Shift</h2>
                    <p class="text-muted-foreground mt-1 text-sm">Enter your opening cash float to begin.</p>
                </div>

                <!-- <label class="text-muted-foreground mb-1 block text-xs font-medium uppercase tracking-wider">
                    Opening Float (₱)
                </label> -->
                <input
                    v-model.number="openingFloat"
                    class="border-input bg-background mb-4 w-full rounded-lg border px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00" />

                <button
                    :disabled="shiftLoading"
                    class="bg-primary text-primary-foreground dark:text-white hover:bg-primary/90 w-full rounded-lg py-3 font-semibold disabled:opacity-50"
                    @click="openShift">
                    {{ shiftLoading ? 'Opening...' : 'Open Shift' }}
                </button>
                <button
                    class="text-primary outline-2 mt-4 dark:text-white w-full rounded-lg py-3 font-semibold disabled:opacity-50"
                    @click="backToDashboard">
                    Cancel
                </button>
            </div>
        </div>

        <!-- ── Top Header Bar ──────────────────────────────────────────────── -->
        <header class="border-b px-4 py-2 flex items-center gap-4 shrink-0">
            <div class="font-bold text-sm">{{ settings.businessName }}</div>
            <div class="text-muted-foreground text-xs">
                Cashier: <span class="font-medium text-foreground">{{ $page.props.auth?.user?.name ?? '—' }}</span>
            </div>
            <div v-if="pos.shift" class="text-muted-foreground text-xs">
                Shift #{{ pos.shift.id }} opened {{ new Date(pos.shift.opened_at).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) }}
            </div>
            <div class="ml-auto flex items-center gap-3">
                <span class="text-muted-foreground text-xs">{{ currentTime }}</span>
                <button
                    v-if="hasActiveShift"
                    class="rounded-lg border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    @click="pos.openModal('close-shift')">
                    Close Shift
                </button>
                <a
                    class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    href="/dashboard">
                    ← Back
                </a>
            </div>
        </header>

        <!-- ── Main Area ───────────────────────────────────────────────────── -->
        <div class="flex flex-1 overflow-hidden">

            <!-- ── LEFT PANEL: Search/Browse + Cart ───────────────────── -->
            <div class="flex flex-col border-r" style="width: 60%">

                <!-- Mode toggle -->
                <div class="flex border-b shrink-0">
                    <button
                        class="flex flex-1 items-center justify-center gap-1.5 py-2 text-lg font-medium transition-colors"
                        :class="panelMode === 'search'
                            ? 'border-b-2 border-primary text-primary bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'"
                        @click="panelMode = 'search'"
                    >
                        <Search class="h-4 w-4" />
                        Search
                    </button>
                    <button
                        class="flex flex-1 items-center justify-center gap-1.5 py-2 text-lg font-medium transition-colors"
                        :class="panelMode === 'browse'
                            ? 'border-b-2 border-primary text-primary bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'"
                        @click="panelMode = 'browse'"
                    >
                        <Grid3x3 class="h-4 w-4" />
                        Browse
                    </button>
                </div>

                <!-- Search bar (search mode) -->
                <div v-if="panelMode === 'search'" class="border-b shrink-0">
                    <ProductSearch />
                </div>

                <!-- Browse mode: product grid -->
                <div v-if="panelMode === 'browse'" class="flex-1 overflow-hidden">
                    <ProductGrid :categories="props.categories" />
                </div>

                <!-- Search mode: cart items -->
                <div v-else class="flex-1 overflow-y-auto">
                    <div v-if="cart.isEmpty" class="flex h-full flex-col items-center justify-center text-center p-8">
                        <ShoppingCart class="text-muted-foreground/30 mb-4 h-16 w-16" />
                        <div class="text-muted-foreground font-medium">Cart is empty</div>
                        <div class="text-muted-foreground mt-1 text-sm">Search or scan a product to add it</div>
                        <div class="text-muted-foreground mt-4 text-xs">
                            F2 = Focus search · F12 = Pay · Esc = Clear cart
                        </div>
                    </div>

                    <!-- Cart header -->
                    <div v-if="!cart.isEmpty" class="border-b bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground grid" style="grid-template-columns: 1fr 60px 90px 100px 32px">
                        <span>Product</span>
                        <span class="hidden sm:block text-center">Price</span>
                        <span class="text-center">Quantity</span>
                        <span class="text-right">Total</span>
                        <span />
                    </div>

                    <CartItem
                        v-for="item in cart.computedItems"
                        :key="item.product_id"
                        :item="item" />
                </div>
            </div>

            <!-- ── RIGHT PANEL: Customer + Summary + Actions ──────────── -->
            <div class="flex flex-col" style="width: 40%">

                <!-- Customer section -->
                <div class="border-b p-3">
                    <div v-if="cart.customer" class="flex items-center gap-2">
                        <div class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                            {{ cart.customer.name.charAt(0) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="truncate text-sm font-medium">{{ cart.customer.name }}</div>
                            <div class="text-muted-foreground text-xs">
                                {{ cart.customer.phone }}
                                <span v-if="cart.customer.loyalty_points > 0">· {{ cart.customer.loyalty_points }} pts</span>
                            </div>
                        </div>
                        <button
                            class="text-muted-foreground hover:text-destructive text-xs"
                            @click="clearCustomer">
                            Remove
                        </button>
                    </div>

                    <div v-else class="relative">
                        <input
                            v-model="customerQuery"
                            class="border-input bg-background w-full rounded-lg border px-3 py-2 text-lg focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search customer or walk-in..."
                            @input="searchCustomers(customerQuery)"
                            @blur="() => setTimeout(() => showCustomerDd = false, 200)" />
                        <div
                            v-if="showCustomerDd && customerResults.length > 0"
                            class="bg-popover border-border absolute top-full left-0 right-0 z-10 rounded-b-lg border border-t-0 shadow-lg">
                            <button
                                v-for="c in customerResults"
                                :key="c.id"
                                class="hover:bg-accent w-full px-3 py-2 text-left text-sm"
                                @click="selectCustomer(c)">
                                <div class="font-medium">{{ c.name }}</div>
                                <div class="text-muted-foreground text-xs">{{ c.phone }}</div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Cart Summary (scrollable area) -->
                <div class="flex-1 overflow-y-auto">
                    <div v-if="!cart.isEmpty">
                        <CartSummary />
                    </div>
                    <div v-else class="text-muted-foreground p-4 text-sm text-center">
                        No items in cart
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="border-t p-3 space-y-2">
                    <!-- Secondary actions -->
                    <div class="grid grid-cols-2 gap-2">
                        <button
                            :disabled="cart.isEmpty"
                            class="rounded-lg border py-2 text-xs font-medium hover:bg-muted disabled:opacity-40 transition-colors"
                            @click="pos.openModal('hold')">
                            Hold
                        </button>
                        <button
                            :disabled="cart.isEmpty"
                            class="rounded-lg border py-2 text-xs font-medium hover:bg-muted disabled:opacity-40 transition-colors"
                            @click="pos.openModal('discount')">
                            Discount
                        </button>
                        <button
                            :disabled="cart.isEmpty"
                            class="rounded-lg border py-2 text-xs font-medium hover:bg-muted disabled:opacity-40 transition-colors"
                            :class="cart.isSeniorPwd ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : ''"
                            @click="pos.openModal('senior-pwd')">
                            {{ cart.isSeniorPwd ? 'SC/PWD ✓' : 'SC / PWD' }}
                        </button>
                        <button
                            :disabled="cart.isEmpty"
                            class="rounded-lg border py-2 text-xs font-medium hover:bg-muted text-destructive disabled:opacity-40 transition-colors"
                            @click="pos.requireSupervisor(() => cart.clearCart(), 'Supervisor required to clear cart.')">
                            Clear
                        </button>
                    </div>

                    <!-- CHARGE button -->
                    <button
                        :disabled="cart.isEmpty || !hasActiveShift"
                        class="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl py-4 text-base font-bold tracking-wide disabled:opacity-40 transition-colors"
                        @click="pos.openModal('payment')">
                        <span v-if="!hasActiveShift">Open Shift First</span>
                        <span v-else-if="cart.isEmpty">Add Items to Cart</span>
                        <span v-else>
                            CHARGE {{ format(cart.summary.total_amount) }}
                            <span class="text-primary-foreground/70 text-xs ml-1">F12</span>
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ── Modals ──────────────────────────────────────────────────────── -->
        <PaymentModal v-if="pos.activeModal === 'payment'" />
        <DiscountModal v-if="pos.activeModal === 'discount'" />
        <HoldTransactionPanel v-if="pos.activeModal === 'hold'" />
        <SupervisorAuthModal v-if="pos.activeModal === 'supervisor'" />
        <CloseShiftModal v-if="pos.activeModal === 'close-shift'" />
        <SeniorPwdModal v-if="pos.activeModal === 'senior-pwd'" />
    </div>
</template>
