<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import {
    ArrowRight,
    Check,
    Coffee,
    Grid3x3,
    Hammer,
    List,
    Minus,
    Pill,
    Plus,
    Receipt,
    Search,
    ShoppingBasket,
    ShoppingCart,
    Smartphone,
    Store,
    Warehouse,
    WashingMachine,
    X,
    Zap,
} from '@lucide/vue';

// ── Props ─────────────────────────────────────────────────────────────────
interface DemoProduct {
    id: number;
    store_type: string;
    name: string;
    sku: string;
    category: string;
    price_cents: number;
    stock: number;
    image_path: string | null;
}

const props = defineProps<{
    storeType: string;
    products: DemoProduct[];
}>();

// ── Theme config per store type ───────────────────────────────────────────
const themes: Record<string, {
    name: string;
    color: string;
    colorDark: string;
    colorLight: string;
    icon: object;
    layout: 'grid' | 'grid-large' | 'list';
    headerExtra: string;
    receiptLabel: string;
}> = {
    coffeeshop: {
        name: 'POS1 Café',
        color: '#D97706',
        colorDark: '#B45309',
        colorLight: '#FEF3C7',
        icon: Coffee,
        layout: 'grid-large',
        headerExtra: 'Dine In / Take Out',
        receiptLabel: 'Order',
    },
    pharmacy: {
        name: 'POS1 Pharmacy',
        color: '#2563EB',
        colorDark: '#1D4ED8',
        colorLight: '#DBEAFE',
        icon: Pill,
        layout: 'list',
        headerExtra: 'Licensed Pharmacist: M. Reyes',
        receiptLabel: 'Invoice',
    },
    grocery: {
        name: 'POS1 Grocery',
        color: '#16A34A',
        colorDark: '#15803D',
        colorLight: '#DCFCE7',
        icon: ShoppingBasket,
        layout: 'grid',
        headerExtra: 'Now serving #42',
        receiptLabel: 'Receipt',
    },
    laundry: {
        name: 'POS1 Laundry',
        color: '#0284C7',
        colorDark: '#0369A1',
        colorLight: '#E0F2FE',
        icon: WashingMachine,
        layout: 'list',
        headerExtra: 'Pickup: same-day before 6PM',
        receiptLabel: 'Claim Stub',
    },
    minimart: {
        name: 'POS1 Minimart',
        color: '#EA580C',
        colorDark: '#C2410C',
        colorLight: '#FFEDD5',
        icon: Store,
        layout: 'grid',
        headerExtra: '',
        receiptLabel: 'Receipt',
    },
    hardware: {
        name: 'POS1 Hardware',
        color: '#B45309',
        colorDark: '#92400E',
        colorLight: '#FEF3C7',
        icon: Hammer,
        layout: 'list',
        headerExtra: 'Job Ref: —',
        receiptLabel: 'Sales Invoice',
    },
    wholesaler: {
        name: 'POS1 Wholesalers',
        color: '#4F46E5',
        colorDark: '#4338CA',
        colorLight: '#EEF2FF',
        icon: Warehouse,
        layout: 'list',
        headerExtra: 'Min. order: ₱500',
        receiptLabel: 'Invoice',
    },
    electronics: {
        name: 'POS1 Electronics',
        color: '#9333EA',
        colorDark: '#7E22CE',
        colorLight: '#F3E8FF',
        icon: Smartphone,
        layout: 'grid',
        headerExtra: '',
        receiptLabel: 'Sales Receipt',
    },
};

const theme = computed(() => themes[props.storeType] ?? themes['grocery']);

// ── Formatting ────────────────────────────────────────────────────────────
function formatPrice(cents: number): string {
    return '₱' + (cents / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return name.substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}

// ── Categories ────────────────────────────────────────────────────────────
const categories = computed(() => {
    const cats = [...new Set(props.products.map((p) => p.category))];
    return ['All', ...cats];
});

// ── Layout toggle (overrides the theme default) ───────────────────────────
const layoutOverride = ref<'grid' | 'grid-large' | 'list' | null>(null);
const currentLayout = computed(() => layoutOverride.value ?? theme.value.layout);

const activeCategory = ref('All');

// ── Search ────────────────────────────────────────────────────────────────
const searchQuery = ref('');

const filteredProducts = computed(() => {
    let list = props.products;
    if (activeCategory.value !== 'All') {
        list = list.filter((p) => p.category === activeCategory.value);
    }
    if (searchQuery.value.trim()) {
        const q = searchQuery.value.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    return list;
});

// ── Cart ──────────────────────────────────────────────────────────────────
interface CartLine {
    product: DemoProduct;
    qty: number;
}

const cartLines = ref<CartLine[]>([]);

function addToCart(product: DemoProduct) {
    const existing = cartLines.value.find((l) => l.product.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cartLines.value.push({ product, qty: 1 });
    }
}

function setQty(line: CartLine, qty: number) {
    if (qty <= 0) {
        cartLines.value = cartLines.value.filter((l) => l !== line);
    } else {
        line.qty = qty;
    }
}

function removeLine(line: CartLine) {
    cartLines.value = cartLines.value.filter((l) => l !== line);
}

function clearCart() {
    cartLines.value = [];
    cashTendered.value = '';
}

const cartCount = computed(() => cartLines.value.reduce((s, l) => s + l.qty, 0));
const subtotalCents = computed(() => cartLines.value.reduce((s, l) => s + l.product.price_cents * l.qty, 0));
const vatCents = computed(() => Math.round(subtotalCents.value * 12 / 112));
const vatableCents = computed(() => subtotalCents.value - vatCents.value);

// ── Payment modal ─────────────────────────────────────────────────────────
const showPayment = ref(false);
const cashTendered = ref('');
const paymentSuccess = ref(false);

const cashTenderedCents = computed(() => {
    const v = parseFloat(String(cashTendered.value).replace(/,/g, ''));
    return isNaN(v) ? 0 : Math.round(v * 100);
});

const changeCents = computed(() => Math.max(0, cashTenderedCents.value - subtotalCents.value));

function confirmPayment() {
    paymentSuccess.value = true;
    setTimeout(() => {
        paymentSuccess.value = false;
        showPayment.value = false;
        clearCart();
    }, 2500);
}

// ── Time ──────────────────────────────────────────────────────────────────
const currentTime = ref(new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }));
setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
}, 10_000);

// ── Dine-in toggle (coffee shop) ──────────────────────────────────────────
const orderType = ref<'Dine In' | 'Take Out'>('Dine In');

// ── Banner dismiss ────────────────────────────────────────────────────────
const showBanner = ref(true);
</script>

<template>
    <Head :title="`${theme.name} — POS1 Demo`" />

    <div class="bg-background text-foreground flex h-screen flex-col overflow-hidden">

        <!-- ── Demo banner ──────────────────────────────────────────────── -->
        <div
            v-if="showBanner"
            class="flex shrink-0 items-center justify-between gap-3 px-4 py-2 text-sm font-medium text-white"
            :style="{ backgroundColor: theme.color }"
        >
            <div class="flex items-center gap-2">
                <Zap class="h-4 w-4 shrink-0" />
                <span>
                    You're exploring the <strong>Demo Mode</strong> for a {{ storeType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }}.
                    Data is simulated — nothing is saved.
                </span>
            </div>
            <div class="flex shrink-0 items-center gap-3">
                <Link
                    href="/register"
                    class="flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold transition hover:bg-white/30"
                >
                    Sign Up Free <ArrowRight class="h-3.5 w-3.5" />
                </Link>
                <button class="opacity-70 transition hover:opacity-100" @click="showBanner = false">
                    <X class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- ── Top Header Bar ───────────────────────────────────────────── -->
        <header class="flex shrink-0 items-center gap-4 border-b px-4 py-2">
            <div class="flex items-center gap-2">
                <span
                    class="flex h-7 w-7 items-center justify-center rounded-md text-white"
                    :style="{ backgroundColor: theme.color }"
                >
                    <component :is="theme.icon" class="h-4 w-4" />
                </span>
                <span class="text-sm font-bold">{{ theme.name }}</span>
            </div>

            <div class="text-muted-foreground text-xs">
                Cashier: <span class="text-foreground font-medium">Maria Santos</span>
            </div>
            <div class="text-muted-foreground text-xs">Shift #1 · opened 09:00 AM</div>

            <!-- Per-store-type extra -->
            <template v-if="storeType === 'coffee_shop'">
                <div class="ml-2 flex overflow-hidden rounded-lg border text-xs font-medium">
                    <button
                        class="px-3 py-1.5 transition"
                        :style="orderType === 'Dine In' ? { backgroundColor: theme.color, color: 'white' } : {}"
                        @click="orderType = 'Dine In'"
                    >Dine In</button>
                    <button
                        class="border-l px-3 py-1.5 transition"
                        :style="orderType === 'Take Out' ? { backgroundColor: theme.color, color: 'white' } : {}"
                        @click="orderType = 'Take Out'"
                    >Take Out</button>
                </div>
            </template>
            <template v-else-if="theme.headerExtra">
                <div
                    class="rounded-md border px-2 py-1 text-xs font-medium"
                    :style="{ borderColor: theme.color + '50', color: theme.color }"
                >{{ theme.headerExtra }}</div>
            </template>

            <div class="ml-auto flex items-center gap-3">
                <span class="text-muted-foreground text-xs">{{ currentTime }}</span>
                <Link
                    href="/"
                    class="text-muted-foreground hover:text-foreground text-xs transition-colors"
                >← Back to site</Link>
            </div>
        </header>

        <!-- ── Main area ──────────────────────────────────────────────────── -->
        <div class="flex min-h-0 flex-1">

            <!-- ══ Left panel: products ═══════════════════════════════════ -->
            <div class="flex flex-col border-r" style="width: 60%">

                <!-- Search bar -->
                <div class="text-muted-foreground flex shrink-0 items-center gap-2 border-b px-3 py-2.5">
                    <Search class="h-4 w-4 shrink-0" />
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search product or SKU…"
                        class="bg-transparent w-full text-sm focus:outline-none"
                    />
                    <button v-if="searchQuery" @click="searchQuery = ''">
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <!-- Category tabs -->
                <div class="flex shrink-0 gap-1 overflow-x-auto border-b px-3 py-2">
                    <button
                        v-for="cat in categories"
                        :key="cat"
                        class="shrink-0 rounded-lg border px-3 py-1 text-xs font-medium transition"
                        :style="activeCategory === cat
                            ? { backgroundColor: theme.color, color: 'white', borderColor: theme.color }
                            : {}"
                        @click="activeCategory = cat"
                    >{{ cat }}</button>
                </div>

                <!-- Layout toggle -->
                <div class="bg-muted/30 flex shrink-0 items-center justify-end gap-2 border-b px-3 py-1.5 text-xs">
                    <span class="text-muted-foreground">{{ filteredProducts.length }} item{{ filteredProducts.length !== 1 ? 's' : '' }}</span>
                    <div class="ml-2 flex overflow-hidden rounded-md border">
                        <button
                            class="px-2 py-1 transition"
                            :style="currentLayout !== 'list' ? { backgroundColor: theme.color, color: 'white' } : {}"
                            @click="layoutOverride = 'grid'"
                        ><Grid3x3 class="h-3.5 w-3.5" /></button>
                        <button
                            class="border-l px-2 py-1 transition"
                            :style="currentLayout === 'list' ? { backgroundColor: theme.color, color: 'white' } : {}"
                            @click="layoutOverride = 'list'"
                        ><List class="h-3.5 w-3.5" /></button>
                    </div>
                </div>

                <!-- Product grid / list -->
                <div class="min-h-0 flex-1 overflow-y-auto p-3">

                    <!-- GRID layout -->
                    <div
                        v-if="currentLayout !== 'list'"
                        class="grid gap-2"
                        :class="currentLayout === 'grid-large' ? 'grid-cols-3' : 'grid-cols-4'"
                    >
                        <button
                            v-for="product in filteredProducts"
                            :key="product.id"
                            class="group flex flex-col items-center rounded-xl border p-3 text-center transition hover:shadow-md active:scale-95"
                            style="transition: all 0.15s"
                            @click="addToCart(product)"
                            @mouseenter="($event.currentTarget as HTMLElement).style.borderColor = theme.color"
                            @mouseleave="($event.currentTarget as HTMLElement).style.borderColor = ''"
                        >
                            <div
                                class="mb-2 flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border"
                                :style="{ backgroundColor: theme.colorLight }"
                            >
                                <img
                                    v-if="product.image_path"
                                    :src="product.image_path"
                                    :alt="product.name"
                                    class="h-full w-full object-cover"
                                />
                                <span
                                    v-else
                                    class="text-sm font-bold"
                                    :style="{ color: theme.color }"
                                >{{ getInitials(product.name) }}</span>
                            </div>
                            <div class="line-clamp-2 text-xs font-medium leading-tight">{{ product.name }}</div>
                            <div class="text-muted-foreground mt-1 text-[10px]">{{ product.sku }}</div>
                            <div class="mt-2 text-sm font-bold" :style="{ color: theme.color }">
                                {{ formatPrice(product.price_cents) }}
                            </div>
                        </button>
                    </div>

                    <!-- LIST layout -->
                    <div v-else class="space-y-1">
                        <button
                            v-for="product in filteredProducts"
                            :key="product.id"
                            class="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition hover:shadow-sm active:scale-[0.99]"
                            @click="addToCart(product)"
                            @mouseenter="($event.currentTarget as HTMLElement).style.borderColor = theme.color"
                            @mouseleave="($event.currentTarget as HTMLElement).style.borderColor = ''"
                        >
                            <div
                                class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
                                :style="{ backgroundColor: theme.colorLight }"
                            >
                                <img
                                    v-if="product.image_path"
                                    :src="product.image_path"
                                    :alt="product.name"
                                    class="h-full w-full object-cover"
                                />
                                <span
                                    v-else
                                    class="text-xs font-bold"
                                    :style="{ color: theme.color }"
                                >{{ getInitials(product.name) }}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="truncate text-sm font-medium">{{ product.name }}</div>
                                <div class="text-muted-foreground text-xs">{{ product.sku }} · {{ product.category }}</div>
                            </div>
                            <div class="shrink-0 text-sm font-bold" :style="{ color: theme.color }">
                                {{ formatPrice(product.price_cents) }}
                            </div>
                            <Plus class="text-muted-foreground h-4 w-4 shrink-0" />
                        </button>
                    </div>

                    <div v-if="filteredProducts.length === 0" class="text-muted-foreground py-16 text-center text-sm">
                        No products found.
                    </div>
                </div>
            </div>

            <!-- ══ Right panel: cart ═══════════════════════════════════════ -->
            <div class="flex flex-col" style="width: 40%">

                <!-- Cart header -->
                <div class="flex shrink-0 items-center justify-between border-b px-4 py-3">
                    <div class="flex items-center gap-2 text-sm font-semibold">
                        <ShoppingCart class="h-4 w-4" />
                        Cart
                        <span
                            v-if="cartCount > 0"
                            class="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                            :style="{ backgroundColor: theme.color }"
                        >{{ cartCount }}</span>
                    </div>
                    <button
                        v-if="cartLines.length > 0"
                        class="text-muted-foreground hover:text-destructive text-xs transition"
                        @click="clearCart"
                    >Clear all</button>
                </div>

                <!-- Cart items -->
                <div class="min-h-0 flex-1 overflow-y-auto">
                    <div v-if="cartLines.length === 0" class="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-sm">
                        <ShoppingCart class="h-10 w-10 opacity-20" />
                        <span>Cart is empty</span>
                        <span class="text-xs opacity-60">Click a product to add it</span>
                    </div>

                    <div
                        v-for="line in cartLines"
                        :key="line.product.id"
                        class="flex items-center gap-3 border-b px-4 py-3"
                    >
                        <div
                            class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border"
                            :style="{ backgroundColor: theme.colorLight }"
                        >
                            <img
                                v-if="line.product.image_path"
                                :src="line.product.image_path"
                                :alt="line.product.name"
                                class="h-full w-full object-cover"
                            />
                            <span
                                v-else
                                class="text-xs font-bold"
                                :style="{ color: theme.color }"
                            >{{ getInitials(line.product.name) }}</span>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="truncate text-sm font-medium">{{ line.product.name }}</div>
                            <div class="text-muted-foreground text-xs">{{ formatPrice(line.product.price_cents) }} each</div>
                        </div>
                        <div class="flex items-center overflow-hidden rounded-lg border">
                            <button
                                class="bg-muted flex h-8 w-8 items-center justify-center border-r transition hover:bg-red-50"
                                @click="setQty(line, line.qty - 1)"
                            ><Minus class="h-3.5 w-3.5" /></button>
                            <span class="w-10 text-center text-sm font-semibold">{{ line.qty }}</span>
                            <button
                                class="bg-muted flex h-8 w-8 items-center justify-center border-l transition hover:bg-green-50"
                                @click="setQty(line, line.qty + 1)"
                            ><Plus class="h-3.5 w-3.5" /></button>
                        </div>
                        <div class="w-20 text-right text-sm font-semibold">{{ formatPrice(line.product.price_cents * line.qty) }}</div>
                        <button class="text-muted-foreground hover:text-destructive ml-1 transition" @click="removeLine(line)">
                            <X class="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <!-- Totals + actions -->
                <div class="shrink-0 border-t">
                    <div class="space-y-1 px-4 py-3 text-sm">
                        <div class="flex justify-between">
                            <span class="text-muted-foreground">Subtotal</span>
                            <span>{{ formatPrice(subtotalCents) }}</span>
                        </div>
                        <div class="text-muted-foreground space-y-0.5 border-t pt-1 text-xs">
                            <div class="flex justify-between">
                                <span>VATable Sales</span><span>{{ formatPrice(vatableCents) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>VAT (12%)</span><span>{{ formatPrice(vatCents) }}</span>
                            </div>
                        </div>
                        <div class="flex justify-between border-t pt-2 text-base font-bold">
                            <span>TOTAL DUE</span>
                            <span :style="{ color: theme.color }">{{ formatPrice(subtotalCents) }}</span>
                        </div>
                    </div>

                    <div class="space-y-2 px-3 pb-3">
                        <div class="grid grid-cols-2 gap-2">
                            <button class="rounded-lg border py-2 text-center text-xs font-medium transition hover:bg-muted">Hold</button>
                            <button class="rounded-lg border py-2 text-center text-xs font-medium transition hover:bg-muted">Discount</button>
                            <button class="rounded-lg border py-2 text-center text-xs font-medium transition hover:bg-muted">SC / PWD</button>
                            <button class="text-destructive rounded-lg border py-2 text-center text-xs font-medium transition hover:bg-red-50" @click="clearCart">Clear</button>
                        </div>
                        <button
                            class="w-full rounded-xl py-4 text-center text-base font-bold tracking-wide text-white transition disabled:opacity-40"
                            :style="{ backgroundColor: cartLines.length > 0 ? theme.color : '#94A3B8' }"
                            :disabled="cartLines.length === 0"
                            @click="showPayment = true"
                        >
                            CHARGE {{ formatPrice(subtotalCents) }}
                            <span class="ml-1 text-xs opacity-70">F12</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Payment modal ─────────────────────────────────────────────── -->
        <Transition
            enter-active-class="transition duration-150"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showPayment" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

                <!-- Success overlay -->
                <div
                    v-if="paymentSuccess"
                    class="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-10 text-center shadow-2xl dark:bg-zinc-900"
                >
                    <span
                        class="flex h-16 w-16 items-center justify-center rounded-full text-white"
                        :style="{ backgroundColor: theme.color }"
                    >
                        <Check class="h-8 w-8" />
                    </span>
                    <div>
                        <div class="text-xl font-bold">Payment Successful!</div>
                        <div class="text-muted-foreground mt-1 text-sm">{{ theme.receiptLabel }} printed.</div>
                    </div>
                    <div class="rounded-lg border px-4 py-2 font-mono text-xs">
                        {{ theme.receiptLabel.toUpperCase() }}# DEMO-{{ new Date().toISOString().slice(0,10).replace(/-/g,'') }}-00001
                    </div>
                </div>

                <!-- Payment form -->
                <div v-else class="w-full max-w-sm rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
                    <div class="flex items-center justify-between border-b px-5 py-4">
                        <div class="flex items-center gap-2 font-semibold">
                            <Receipt class="h-4 w-4" /> Process Payment
                        </div>
                        <button class="text-muted-foreground hover:text-foreground" @click="showPayment = false">
                            <X class="h-4 w-4" />
                        </button>
                    </div>

                    <div class="space-y-4 p-5">
                        <div class="text-center">
                            <div class="text-muted-foreground text-sm">Total Due</div>
                            <div class="text-3xl font-bold" :style="{ color: theme.color }">
                                {{ formatPrice(subtotalCents) }}
                            </div>
                        </div>

                        <!-- Payment methods -->
                        <div class="grid grid-cols-4 gap-2">
                            <span
                                v-for="m in ['Cash', 'GCash', 'Card', 'Maya']"
                                :key="m"
                                class="rounded-lg border py-2 text-center text-xs font-medium"
                                :class="m === 'Cash' ? 'border-current font-semibold' : 'text-muted-foreground'"
                                :style="m === 'Cash' ? { borderColor: theme.color, color: theme.color, backgroundColor: theme.colorLight } : {}"
                            >{{ m }}</span>
                        </div>

                        <!-- Cash tendered -->
                        <div>
                            <label class="text-muted-foreground mb-1 block text-xs font-medium">Cash Tendered (₱)</label>
                            <input
                                v-model="cashTendered"
                                type="number"
                                min="0"
                                step="0.01"
                                :placeholder="(subtotalCents / 100).toFixed(2)"
                                class="border-input bg-background w-full rounded-lg border px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2"
                                :style="{ '--tw-ring-color': theme.color }"
                            />
                        </div>

                        <!-- Change -->
                        <div
                            v-if="cashTenderedCents > 0"
                            class="rounded-lg p-3 text-sm"
                            :style="{ backgroundColor: theme.colorLight }"
                        >
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">Cash Paid</span>
                                <span class="font-medium">{{ formatPrice(cashTenderedCents) }}</span>
                            </div>
                            <div class="flex justify-between border-t pt-2 font-bold">
                                <span>Change</span>
                                <span :style="{ color: theme.color }">{{ formatPrice(changeCents) }}</span>
                            </div>
                        </div>

                        <button
                            class="w-full rounded-xl py-3 text-center font-semibold text-white transition disabled:opacity-40"
                            :style="{ backgroundColor: theme.color }"
                            :disabled="cashTenderedCents < subtotalCents && cashTendered !== ''"
                            @click="confirmPayment"
                        >
                            Confirm Payment
                        </button>

                        <p class="text-muted-foreground text-center text-xs">
                            This is a demo — no real transaction is recorded.
                        </p>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>
