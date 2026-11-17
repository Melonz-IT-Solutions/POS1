<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    AlertTriangle,
    CalendarCheck,
    Banknote,
    Monitor,
    Printer,
    ScanBarcode,
    Wrench,
    Globe,
    Coffee,
    Hammer,
    Pill,
    ShoppingBasket,
    Smartphone,
    Store,
    Warehouse,
    ArrowRight,
    Building2,
    Check,
    Layers,
    Mail,
    PackageOpen,
    Phone,
    ScrollText,
    Star,
    Upload,
    Gift,
    BarChart3,
    ChevronDown,
    ChevronRight,
    ChevronsUpDown,
    ClipboardList,
    Clock,
    CreditCard,
    FileText,
    Grid3x3,
    HeartHandshake,
    History,
    LayoutGrid,
    Minus,
    Package,
    PanelLeft,
    Plus,
    Receipt,
    Search,
    ShieldCheck,
    ShoppingCart,
    TrendingUp,
    Users,
    X,
    Zap,
} from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { Component } from 'vue';
import { dashboard, login, register } from '@/routes';

type Peek = 'dashboard' | 'pos' | 'reports';

const active = ref<Peek>('dashboard');

const peeks: { key: Peek; label: string; caption: string; icon: Component }[] = [
    { key: 'dashboard', label: 'Dashboard', caption: 'See today’s revenue, transactions and best-sellers at a glance.', icon: LayoutGrid },
    { key: 'pos', label: 'POS Terminal', caption: 'A full-screen checkout built for speed: scan, charge, print.', icon: ShoppingCart },
    { key: 'reports', label: 'Sales Report', caption: 'Daily breakdowns, payment mix and a BIR-ready VAT summary.', icon: TrendingUp },
];

const activePeek = computed(() => peeks.find((p) => p.key === active.value)!);

/* ── Mockup scaling: designed at 1200×740, scaled to fit the frame ── */
const MOCK_W = 1200;
const MOCK_H = 740;
const frame = ref<HTMLElement | null>(null);
const scale = ref(1);
let observer: ResizeObserver | null = null;

onMounted(() => {
    observer = new ResizeObserver(([entry]) => {
        scale.value = Math.min(1, entry.contentRect.width / MOCK_W);
    });

    if (frame.value) {
        observer.observe(frame.value);
    }
});

onBeforeUnmount(() => observer?.disconnect());

/* ── Hero: store-type marquee ── */
const storeTypes: { name: string; icon: Component }[] = [
    { name: 'Coffee Shop', icon: Coffee },
    { name: 'Pharmacy', icon: Pill },
    { name: 'Grocery', icon: ShoppingBasket },
    { name: 'Minimart', icon: Store },
    { name: 'Hardware', icon: Hammer },
    { name: 'Wholesaler', icon: Warehouse },
    { name: 'Electronics Shop', icon: Smartphone },
];

/* ── Sidebar (mirrors AppSidebar.vue) ── */
type SideItem = { title: string; icon: Component; badge?: number };
type SideSection = { label: string; items: SideItem[]; collapsible?: boolean; open?: boolean };

const sidebar = computed((): SideSection[] => [
    { label: 'Overview', items: [{ title: 'Dashboard', icon: LayoutGrid }] },
    {
        label: 'Sales',
        items: [
            { title: 'POS Terminal', icon: ShoppingCart },
            { title: 'Sales History', icon: History },
            { title: 'Shifts', icon: Clock },
            { title: 'Customers', icon: Users },
        ],
    },
    { label: 'Catalog', items: [], collapsible: true },
    { label: 'Inventory', items: [], collapsible: true },
    { label: 'Procurement', items: [], collapsible: true },
    {
        label: 'Reports',
        collapsible: true,
        open: true,
        items: [
            { title: 'Sales', icon: TrendingUp },
            { title: 'Profit & Loss', icon: BarChart3 },
            { title: 'Products', icon: Package },
            { title: 'Cashiers', icon: Users },
            { title: 'VAT Summary', icon: Receipt },
            { title: 'BIR Export', icon: FileText },
        ],
    },
]);

function isActiveItem(section: string, title: string): boolean {
    return (
        (active.value === 'dashboard' && title === 'Dashboard') ||
        (active.value === 'reports' && section === 'Reports' && title === 'Sales')
    );
}

/* ── Dashboard sample data ── */
const kpis = [
    { label: "Today's Revenue", value: '₱48,215.00', sub: '+12.4% vs yesterday', icon: TrendingUp, chip: 'bg-primary/10 text-primary', subClass: 'text-emerald-600' },
    { label: 'Transactions', value: '326', sub: '+8.1% vs yesterday', icon: ShoppingCart, chip: 'bg-sky-50 text-sky-600', subClass: 'text-emerald-600' },
    { label: 'Avg Sale', value: '₱147.90', sub: '₱5,166 VAT · ₱1,240 discounts', icon: BarChart3, chip: 'bg-violet-50 text-violet-600', subClass: 'text-muted-foreground' },
    { label: 'This Month', value: '₱812,430.00', sub: '5,492 transactions', icon: TrendingUp, chip: 'bg-emerald-50 text-emerald-600', subClass: 'text-muted-foreground' },
];

const quickActions = [
    { label: 'Open POS Terminal', icon: ShoppingCart, primary: true },
    { label: 'New Product', icon: Package },
    { label: 'New Purchase Order', icon: ClipboardList },
    { label: 'Sales Report', icon: BarChart3 },
    { label: 'Cashier Report', icon: Users },
];

const week = [
    { day: 'Wed', value: 36.4, pct: 55 },
    { day: 'Thu', value: 38.2, pct: 58 },
    { day: 'Fri', value: 41.5, pct: 63 },
    { day: 'Sat', value: 52.8, pct: 80 },
    { day: 'Sun', value: 61.3, pct: 93 },
    { day: 'Mon', value: 65.9, pct: 100 },
    { day: 'Today', value: 48.2, pct: 73 },
];

/* ── POS sample data (VAT-inclusive, total ₱434.00) ── */
const cartItems = [
    { name: 'Coca-Cola 1.5L', sku: 'BEV-0012', price: '₱85.00', qty: 2, total: '₱170.00', tint: 'bg-red-50 text-red-500' },
    { name: 'Bear Brand 320g', sku: 'DRY-0045', price: '₱112.00', qty: 1, total: '₱112.00', tint: 'bg-sky-50 text-sky-500' },
    { name: 'Lucky Me Pancit Canton', sku: 'NDL-0003', price: '₱18.50', qty: 4, total: '₱74.00', tint: 'bg-amber-50 text-amber-500' },
    { name: 'Gardenia Classic Loaf', sku: 'BAK-0101', price: '₱78.00', qty: 1, total: '₱78.00', tint: 'bg-emerald-50 text-emerald-500' },
];

/* ── Sales report sample data ── */
const reportKpis = [
    { label: 'Total Revenue', value: '₱344,322.50', icon: TrendingUp },
    { label: 'Transactions', value: '2,297', sub: 'Avg ₱149.90', icon: BarChart3 },
    { label: 'VAT Collected', value: '₱36,891.70' },
    { label: 'Total Discounts', value: '₱8,000.00' },
];

const daily = [
    { date: 'Nov 17', txns: 326, revenue: '₱48,215.00', vat: '₱5,165.89', disc: '₱1,240.00', pct: 73 },
    { date: 'Nov 16', txns: 402, revenue: '₱65,910.50', vat: '₱7,061.84', disc: '₱1,580.00', pct: 100 },
    { date: 'Nov 15', txns: 381, revenue: '₱61,304.25', vat: '₱6,568.31', disc: '₱1,415.00', pct: 93 },
    { date: 'Nov 14', txns: 344, revenue: '₱52,780.00', vat: '₱5,655.00', disc: '₱1,120.00', pct: 80 },
    { date: 'Nov 13', txns: 297, revenue: '₱41,520.75', vat: '₱4,448.65', disc: '₱960.00', pct: 63 },
    { date: 'Nov 12', txns: 281, revenue: '₱38,190.00', vat: '₱4,091.79', disc: '₱875.00', pct: 58 },
    { date: 'Nov 11', txns: 266, revenue: '₱36,402.00', vat: '₱3,900.21', disc: '₱810.00', pct: 55 },
];

const paymentMix = [
    { name: 'Cash', amount: '₱185,934.15', pct: 54 },
    { name: 'GCash', amount: '₱89,523.85', pct: 26 },
    { name: 'Card', amount: '₱41,318.70', pct: 12 },
    { name: 'Maya', amount: '₱27,545.80', pct: 8 },
];

/* ── Marketing features (sales-focused) ── */
type Spotlight = { key: string; eyebrow: string; title: string; text: string; points: string[]; icon: Component };

const spotlights: Spotlight[] = [
    {
        key: 'checkout',
        eyebrow: 'Fast checkout',
        icon: Zap,
        title: 'Keep the line moving',
        text: 'Scan, charge and hand over the receipt in seconds, with no training manual needed.',
        points: [
            'Barcode scanning plus SKU and name search (F2)',
            'Split one sale across cash, card, GCash and Maya',
            'Hold a transaction and serve the next customer',
            'Instant change computation and printed or emailed receipts',
        ],
    },
    {
        key: 'bir',
        eyebrow: 'BIR-ready',
        icon: Receipt,
        title: 'Compliance, handled for you',
        text: 'VAT and mandated discounts are computed on every sale, so month-end filing is a download.',
        points: [
            'VAT-inclusive 12% pricing with VATable, exempt and zero-rated sales',
            'Senior Citizen / PWD 20% discount with VAT exemption',
            'Sequential receipt numbers and Z-Reading per shift',
            'One-click BIR sales export',
        ],
    },
    {
        key: 'stock',
        eyebrow: 'Inventory',
        icon: AlertTriangle,
        title: 'Restock before you run out',
        text: 'POS1 watches your shelves and tells you what to reorder, grouped by supplier.',
        points: [
            'Real-time stock deducted on every sale',
            'Low-stock and out-of-stock alerts on the Reorder Dashboard',
            'Create purchase orders and receive goods in a few clicks',
            'Inventory valuation with cost and margin',
        ],
    },
    {
        key: 'loyalty',
        eyebrow: 'Customers',
        icon: HeartHandshake,
        title: 'Turn shoppers into regulars',
        text: 'Reward repeat buyers automatically and keep their history one tap away at the counter.',
        points: [
            'Loyalty points earned on every purchase',
            'Redeem points as payment at checkout',
            'Full purchase history and points ledger per customer',
            'Customer-specific discounts for your suki',
        ],
    },
];

const reorderRows = [
    { name: 'Bear Brand 320g', sku: 'DRY-0045', stock: 4, min: 24, out: false },
    { name: 'Coca-Cola 1.5L', sku: 'BEV-0012', stock: 0, min: 36, out: true },
    { name: 'Nescafé 3-in-1 Original', sku: 'BEV-0230', stock: 11, min: 50, out: false },
];

const ledger = [
    { label: 'Earned', ref: 'POS-20261117-00326', pts: '+43', positive: true },
    { label: 'Redeemed', ref: 'POS-20261112-00198', pts: '-200', positive: false },
    { label: 'Earned', ref: 'POS-20261109-00142', pts: '+61', positive: true },
];

const moreFeatures: { icon: Component; label: string }[] = [
    { icon: Clock, label: 'Shift management & cash count' },
    { icon: BarChart3, label: 'Profit & loss and hourly reports' },
    { icon: Gift, label: 'Gift cards' },
    { icon: ClipboardList, label: 'Layaway & deposits' },
    { icon: Layers, label: 'Product bundles' },
    { icon: Upload, label: 'CSV product & customer import' },
    { icon: Mail, label: 'Email receipts' },
    { icon: ScrollText, label: 'Role-based access & audit log' },
];

/* ── Free trial offer ── */
const trialHardware: { icon: Component; name: string; note: string }[] = [
    { icon: Monitor, name: 'POS PC', note: 'Pre-installed with POS1' },
    { icon: ScanBarcode, name: 'Barcode Scanner', note: 'Plug-and-scan ready' },
    { icon: Banknote, name: 'Cash Drawer', note: 'Opens on every cash sale' },
    { icon: Printer, name: 'Thermal Printer', note: 'Prints BIR-ready receipts' },
];

const trialSteps: { icon: Component; title: string; text: string }[] = [
    { icon: CalendarCheck, title: 'Book your trial', text: 'Tell us about your store and pick a start date.' },
    { icon: Wrench, title: 'We set it up', text: 'We deliver and install the hardware and load your products.' },
    { icon: ShoppingCart, title: 'Sell for 2 weeks', text: 'Run your store on POS1 free of charge, with the full package.' },
];

/* ── Pricing ── */
type Plan = {
    name: string;
    price: string;
    tagline: string;
    cta: string;
    highlight?: boolean;
    limits: string[];
    domain?: string;
    intro?: string;
    features: string[];
    excluded?: string[];
};

const plans: Plan[] = [
    {
        name: 'Free',
        price: '0',
        tagline: 'For new stores getting started with their first POS.',
        cta: 'Start for free',
        limits: ['Up to 20 products', '1 user account'],
        features: [
            'POS Terminal with barcode scanning',
            'VAT-inclusive pricing & SC/PWD discounts',
            'BIR-ready receipts',
            'Cash, card, GCash & Maya payments',
            'Dashboard & daily sales report',
        ],
        excluded: ['Inventory alerts & purchase orders', 'Customer loyalty points', 'Advanced reports'],
    },
    {
        name: 'Pro',
        price: '949',
        tagline: 'For growing stores that need inventory, customers and reports.',
        cta: 'Start with Pro',
        highlight: true,
        limits: ['Up to 1,000 products', 'Up to 3 users (Admin, Manager, Cashier)'],
        intro: 'Everything in Free, plus:',
        features: [
            'Inventory tracking & low-stock reorder alerts',
            'Suppliers & purchase orders',
            'Customers & loyalty points',
            'Full reports: P&L, products, cashiers, hourly, VAT',
            'Shift management & Z-Reading',
            'BIR sales export',
            'CSV import & emailed receipts',
        ],
    },
    {
        name: 'Enterprise',
        price: '1449',
        tagline: 'For established, high-volume stores that need it all, without limits.',
        cta: 'Go Enterprise',
        limits: ['Unlimited products', 'Unlimited users'],
        domain: 'mystore.pos1.ph',
        intro: 'Everything in Pro, plus:',
        features: [
            'Gift cards & layaway / deposits',
            'Product bundles',
            'Bulk price updates & price history',
            'Inventory valuation & physical count',
            'Expense tracking',
            'Supervisor approvals & full audit log',
            'Priority support',
        ],
    },
];
</script>

<template>
    <Head title="POS1 — No.1 POS Software" />

    <div class="bg-background text-foreground min-h-screen font-sans">
        <!-- Nav -->
        <header class="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
            <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <a href="#" class="flex items-center gap-2">
                    <img src="/images/POS1-app-icon.png" alt="POS1" class="h-8 w-8" />
                    <span class="text-lg font-bold tracking-tight">POS<span class="text-primary">1</span></span>
                </a>
                <div class="text-muted-foreground hidden items-center gap-8 text-sm md:flex">
                    <a href="#preview" class="hover:text-foreground">Preview</a>
                    <a href="#features" class="hover:text-foreground">Features</a>
                    <a href="#pricing" class="hover:text-foreground">Pricing</a>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <Link
                        v-if="$page.props.auth.user"
                        :href="dashboard()"
                        class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 font-medium"
                    >
                        Go to Dashboard
                    </Link>
                    <template v-else>
                        <Link :href="login()" class="hover:bg-muted rounded-lg px-4 py-2 font-medium">Log in</Link>
                        <Link
                            :href="register()"
                            class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 font-medium"
                        >
                            Get Started
                        </Link>
                    </template>
                </div>
            </nav>
        </header>

        <!-- Hero -->
        <section class="relative overflow-hidden">
            <div class="pointer-events-none absolute inset-x-0 -top-40 h-[500px] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_65%)]" />
            <div class="relative mx-auto max-w-6xl px-6 pt-10 pb-6 text-center">
                <a
                    href="#trial"
                    class="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 mb-2 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
                >
                    <Gift class="h-4 w-4" />
                    Free 2-week trial, POS hardware included
                    <ArrowRight class="h-3.5 w-3.5" />
                </a>
                <img src="/images/pos_cover.png" alt="POS1 — No.1 POS Software" class="mx-auto w-full max-w-3xl rounded-2xl" />
                <h1 class="mx-auto -mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
                    The POS built for
                    <span class="text-primary">Philippine retail</span>
                </h1>
                <p class="text-muted-foreground mx-auto mt-5 max-w-2xl text-base sm:text-lg">
                    Ring up sales in seconds, never run out of best-sellers, and stay BIR-compliant, all from one simple
                    system your cashiers will learn in minutes.
                </p>
                <div class="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        :href="$page.props.auth.user ? dashboard() : login()"
                        class="bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-lg"
                    >
                        {{ $page.props.auth.user ? 'Open Dashboard' : 'Start Selling' }}
                        <ArrowRight class="h-4 w-4" />
                    </Link>
                    <a href="#preview" class="hover:bg-muted rounded-xl border px-6 py-3 font-semibold">Take a sneak peek</a>
                </div>
            </div>

            <!-- Store-type marquee (pauses on hover) -->
            <div class="relative pt-6 pb-4">
                <p class="text-muted-foreground mb-4 text-center text-xs font-semibold tracking-widest uppercase">
                    Perfect for every kind of store
                </p>
                <div class="marquee flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <div
                        v-for="copy in 2"
                        :key="copy"
                        class="marquee-track flex shrink-0 gap-4 pr-4"
                        :aria-hidden="copy === 2"
                    >
                        <div
                            v-for="t in storeTypes"
                            :key="t.name"
                            class="hover:border-primary hover:text-primary flex shrink-0 items-center gap-3 rounded-xl border bg-white px-5 py-3 shadow-sm transition-colors"
                        >
                            <span class="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                                <component :is="t.icon" class="h-5 w-5" />
                            </span>
                            <span class="font-semibold whitespace-nowrap">{{ t.name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sneak peek -->
        <section id="preview" class="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
            <div class="mb-8 text-center">
                <p class="text-primary text-sm font-semibold tracking-widest uppercase">Sneak Peek</p>
                <h2 class="mt-2 text-3xl font-bold tracking-tight">See POS1 in action</h2>
            </div>

            <div class="mb-3 flex justify-center">
                <div class="bg-muted inline-flex rounded-xl p-1">
                    <button
                        v-for="p in peeks"
                        :key="p.key"
                        type="button"
                        class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition"
                        :class="active === p.key ? 'text-primary bg-white shadow' : 'text-muted-foreground hover:text-foreground'"
                        @click="active = p.key"
                    >
                        <component :is="p.icon" class="h-4 w-4" />
                        <span class="hidden sm:inline">{{ p.label }}</span>
                    </button>
                </div>
            </div>
            <p class="text-muted-foreground mb-6 text-center text-sm">{{ activePeek.caption }}</p>

            <!-- Browser frame -->
            <div class="overflow-hidden rounded-2xl border bg-white shadow-2xl shadow-slate-900/10">
                <div class="flex items-center gap-2 border-b bg-slate-50 px-4 py-3">
                    <span class="h-3 w-3 rounded-full bg-red-400" />
                    <span class="h-3 w-3 rounded-full bg-amber-400" />
                    <span class="h-3 w-3 rounded-full bg-emerald-400" />
                    <div class="text-muted-foreground mx-auto w-full max-w-sm rounded-md bg-white px-3 py-1 text-center text-xs">
                        https://pos1.ph/{{ active === 'pos' ? 'pos' : active === 'dashboard' ? 'dashboard' : 'admin/reports/sales' }}
                    </div>
                </div>

                <div ref="frame" class="relative w-full overflow-hidden" :style="{ height: MOCK_H * scale + 'px' }">
                    <div
                        class="absolute top-0 left-0 origin-top-left"
                        :style="{ width: MOCK_W + 'px', height: MOCK_H + 'px', transform: `scale(${scale})` }"
                    >
                        <!-- ═════ App shell (Dashboard / Reports) ═════ -->
                        <div v-if="active !== 'pos'" class="bg-sidebar flex h-full">
                            <!-- Sidebar -->
                            <aside class="text-sidebar-foreground flex w-64 shrink-0 flex-col px-2 py-2">
                                <div class="flex items-center gap-2 px-2 py-2">
                                    <img src="/images/POS1-app-icon.png" alt="" class="h-9 w-9 rounded-md" />
                                    <div class="flex flex-col leading-tight">
                                        <span class="text-base font-semibold">POS<span class="text-primary">1</span></span>
                                        <span class="text-muted-foreground text-[10px]">Powered by Melonz IT Solutions</span>
                                    </div>
                                </div>

                                <div class="flex-1 overflow-hidden">
                                    <template v-for="(section, i) in sidebar" :key="section.label">
                                        <div v-if="i > 0" class="bg-sidebar-border mx-2 my-1 h-px" />
                                        <div class="px-2 py-1">
                                            <div class="text-muted-foreground flex h-7 items-center justify-between px-2 text-xs font-medium">
                                                {{ section.label }}
                                                <template v-if="section.collapsible">
                                                    <ChevronDown v-if="section.open" class="h-3.5 w-3.5" />
                                                    <ChevronRight v-else class="h-3.5 w-3.5" />
                                                </template>
                                            </div>
                                            <div
                                                v-for="item in section.items"
                                                :key="item.title"
                                                class="flex h-8 items-center gap-2 rounded-md px-2 text-sm"
                                                :class="[
                                                    section.collapsible ? 'ml-2' : '',
                                                    isActiveItem(section.label, item.title)
                                                        ? 'bg-primary text-primary-foreground font-medium'
                                                        : '',
                                                ]"
                                            >
                                                <component :is="item.icon" class="h-4 w-4" />
                                                {{ item.title }}
                                            </div>
                                        </div>
                                    </template>
                                </div>

                                <div class="flex items-center gap-2 px-2 py-2">
                                    <span class="bg-muted flex h-8 w-8 items-center justify-center rounded-lg text-sm">A</span>
                                    <span class="flex-1 text-sm font-medium">Administrator</span>
                                    <ChevronsUpDown class="h-4 w-4" />
                                </div>
                            </aside>

                            <!-- Inset content -->
                            <main class="m-2 ml-0 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sm">
                                <div class="flex h-14 shrink-0 items-center gap-2 border-b px-4 text-sm">
                                    <PanelLeft class="h-4 w-4" />
                                    <template v-if="active === 'dashboard'">Dashboard</template>
                                    <template v-else>
                                        <span class="text-muted-foreground">Reports</span>
                                        <ChevronRight class="text-muted-foreground h-3.5 w-3.5" />
                                        Sales Report
                                    </template>
                                </div>

                                <!-- Dashboard -->
                                <div v-if="active === 'dashboard'" class="flex flex-1 flex-col gap-4 overflow-hidden p-5">
                                    <div class="grid grid-cols-4 gap-3">
                                        <div v-for="k in kpis" :key="k.label" class="rounded-xl border p-4">
                                            <div class="flex items-start justify-between">
                                                <span class="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">{{ k.label }}</span>
                                                <span class="flex h-7 w-7 items-center justify-center rounded-md" :class="k.chip">
                                                    <component :is="k.icon" class="h-3.5 w-3.5" />
                                                </span>
                                            </div>
                                            <div class="mt-2 text-2xl font-bold">{{ k.value }}</div>
                                            <div class="mt-1 text-xs" :class="k.subClass">{{ k.sub }}</div>
                                        </div>
                                    </div>

                                    <div class="rounded-xl border p-4">
                                        <div class="mb-3 text-sm font-semibold">Quick Actions</div>
                                        <div class="flex gap-2">
                                            <span
                                                v-for="q in quickActions"
                                                :key="q.label"
                                                class="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium"
                                                :class="q.primary ? 'bg-primary text-primary-foreground border-primary' : ''"
                                            >
                                                <component :is="q.icon" class="h-4 w-4" />
                                                {{ q.label }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="flex flex-1 flex-col rounded-xl border p-4">
                                        <div class="flex items-start justify-between">
                                            <div>
                                                <div class="text-sm font-semibold">Revenue: Last 7 Days</div>
                                                <div class="text-muted-foreground text-xs">Daily completed sales totals</div>
                                            </div>
                                            <span class="text-primary flex items-center gap-1 text-xs">Full report <ArrowRight class="h-3 w-3" /></span>
                                        </div>
                                        <div class="mt-4 flex flex-1 items-end gap-6 px-6">
                                            <div v-for="d in week" :key="d.day" class="flex h-full flex-1 flex-col items-center justify-end">
                                                <span class="text-muted-foreground mb-1 text-xs">₱{{ d.value }}K</span>
                                                <div class="bg-primary/40 w-full rounded-md" :style="{ height: d.pct * 0.75 + '%' }" />
                                                <span class="mt-2 text-sm" :class="d.day === 'Today' ? 'text-primary font-medium' : 'text-muted-foreground'">{{ d.day }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Sales Report -->
                                <div v-else class="flex flex-1 flex-col gap-4 overflow-hidden p-5">
                                    <div class="flex items-start justify-between">
                                        <div>
                                            <div class="text-2xl font-semibold">Sales Report</div>
                                            <div class="text-muted-foreground text-sm">Nov 11, 2026 to Nov 17, 2026</div>
                                        </div>
                                        <span class="flex w-40 items-center justify-between rounded-md border px-3 py-2 text-sm">
                                            Last 7 days <ChevronDown class="h-4 w-4" />
                                        </span>
                                    </div>

                                    <div class="grid grid-cols-4 gap-3">
                                        <div v-for="k in reportKpis" :key="k.label" class="rounded-xl border p-4">
                                            <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                                                <component :is="k.icon" v-if="k.icon" class="h-3.5 w-3.5" />
                                                {{ k.label }}
                                            </div>
                                            <div class="mt-1 text-xl font-bold">{{ k.value }}</div>
                                            <div v-if="k.sub" class="text-muted-foreground text-xs">{{ k.sub }}</div>
                                        </div>
                                    </div>

                                    <div class="grid min-h-0 flex-1 grid-cols-3 gap-4">
                                        <div class="col-span-2 overflow-hidden rounded-xl border">
                                            <div class="border-b px-4 py-3 text-sm font-semibold">Daily Breakdown</div>
                                            <table class="w-full text-left text-sm">
                                                <thead class="border-b">
                                                    <tr>
                                                        <th class="px-4 py-2 font-medium">Date</th>
                                                        <th class="px-2 py-2 font-medium">Txns</th>
                                                        <th class="px-2 py-2 font-medium">Revenue</th>
                                                        <th class="px-2 py-2 font-medium">VAT</th>
                                                        <th class="px-2 py-2 font-medium">Discounts</th>
                                                        <th class="w-28 px-4 py-2 font-medium">Bar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="d in daily" :key="d.date" class="border-b last:border-0">
                                                        <td class="px-4 py-2">{{ d.date }}</td>
                                                        <td class="px-2 py-2">{{ d.txns }}</td>
                                                        <td class="px-2 py-2 font-medium">{{ d.revenue }}</td>
                                                        <td class="text-muted-foreground px-2 py-2">{{ d.vat }}</td>
                                                        <td class="text-muted-foreground px-2 py-2">{{ d.disc }}</td>
                                                        <td class="px-4 py-2">
                                                            <div class="bg-muted h-2 rounded-full">
                                                                <div class="bg-primary h-2 rounded-full" :style="{ width: d.pct + '%' }" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="flex flex-col gap-4">
                                            <div class="rounded-xl border">
                                                <div class="flex items-center gap-2 border-b px-4 py-3 text-sm font-semibold">
                                                    <CreditCard class="h-4 w-4" /> Payment Methods
                                                </div>
                                                <div class="space-y-2.5 p-4">
                                                    <div v-for="p in paymentMix" :key="p.name" class="text-sm">
                                                        <div class="flex justify-between"><span>{{ p.name }}</span><span class="font-medium">{{ p.amount }}</span></div>
                                                        <div class="bg-muted mt-1 h-1.5 rounded-full">
                                                            <div class="bg-primary h-1.5 rounded-full" :style="{ width: p.pct + '%' }" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="rounded-xl border text-sm">
                                                <div class="border-b px-4 py-3">
                                                    <div class="font-semibold">VAT Summary</div>
                                                    <div class="text-muted-foreground text-xs">BIR reporting breakdown</div>
                                                </div>
                                                <div class="flex justify-between border-b px-4 py-2"><span class="text-muted-foreground">Vatable Sales</span><span>₱307,430.80</span></div>
                                                <div class="flex justify-between border-b px-4 py-2"><span class="text-muted-foreground">VAT-Exempt Sales</span><span>₱0.00</span></div>
                                                <div class="flex justify-between px-4 py-2 font-semibold"><span>Output VAT (12%)</span><span>₱36,891.70</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>

                        <!-- ═════ POS Terminal (full-screen, mirrors pos/Index.vue) ═════ -->
                        <div v-else class="flex h-full flex-col bg-white">
                            <header class="flex shrink-0 items-center gap-4 border-b px-4 py-2">
                                <div class="text-sm font-bold">POS1</div>
                                <div class="text-muted-foreground text-xs">Cashier: <span class="text-foreground font-medium">Maria Santos</span></div>
                                <div class="text-muted-foreground text-xs">Shift #12 opened 08:00 AM</div>
                                <div class="ml-auto flex items-center gap-3">
                                    <span class="text-muted-foreground text-xs">04:22 PM</span>
                                    <span class="border-destructive/50 text-destructive rounded-lg border px-3 py-1.5 text-xs font-medium">Close Shift</span>
                                    <span class="text-muted-foreground text-xs">← Back</span>
                                </div>
                            </header>

                            <div class="flex flex-1 overflow-hidden">
                                <!-- Left: search + cart -->
                                <div class="flex flex-col border-r" style="width: 60%">
                                    <div class="flex shrink-0 border-b">
                                        <div class="border-primary text-primary bg-primary/5 flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2 text-lg font-medium">
                                            <Search class="h-4 w-4" /> Search
                                        </div>
                                        <div class="text-muted-foreground flex flex-1 items-center justify-center gap-1.5 py-2 text-lg font-medium">
                                            <Grid3x3 class="h-4 w-4" /> Browse
                                        </div>
                                    </div>
                                    <div class="text-muted-foreground flex shrink-0 items-center gap-2 border-b px-3 py-3 text-lg">
                                        <Search class="h-5 w-5" /> Search product, scan barcode or enter SKU… (F2)
                                    </div>
                                    <div
                                        class="bg-muted/30 text-muted-foreground grid border-b px-4 py-2 text-xs font-medium"
                                        style="grid-template-columns: 1fr 70px 126px 96px 28px"
                                    >
                                        <span>Product</span>
                                        <span class="text-center">Price</span>
                                        <span class="text-center">Quantity</span>
                                        <span class="text-right">Total</span>
                                        <span />
                                    </div>
                                    <div
                                        v-for="item in cartItems"
                                        :key="item.sku"
                                        class="flex items-center gap-3 border-b px-4 py-3"
                                    >
                                        <span class="flex h-10 w-10 items-center justify-center rounded-md border" :class="item.tint">
                                            <Package class="h-4 w-4" />
                                        </span>
                                        <div class="min-w-0 flex-1">
                                            <div class="truncate text-sm font-medium">{{ item.name }}</div>
                                            <div class="text-muted-foreground text-xs">{{ item.sku }}</div>
                                        </div>
                                        <div class="text-muted-foreground text-sm">{{ item.price }}</div>
                                        <div class="flex items-center overflow-hidden rounded-lg border">
                                            <span class="bg-muted flex h-9 w-9 items-center justify-center border-r"><Minus class="h-3.5 w-3.5" /></span>
                                            <span class="w-12 text-center text-sm font-semibold">{{ item.qty }}</span>
                                            <span class="bg-muted flex h-9 w-9 items-center justify-center border-l"><Plus class="h-3.5 w-3.5" /></span>
                                        </div>
                                        <div class="w-24 text-right text-sm font-semibold">{{ item.total }}</div>
                                        <X class="text-muted-foreground ml-1 h-4 w-4" />
                                    </div>
                                </div>

                                <!-- Right: customer + summary + actions -->
                                <div class="flex flex-col" style="width: 40%">
                                    <div class="border-b p-3">
                                        <div class="flex items-center gap-2">
                                            <div class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">J</div>
                                            <div class="min-w-0 flex-1">
                                                <div class="truncate text-sm font-medium">Juan Dela Cruz</div>
                                                <div class="text-muted-foreground text-xs">0917 123 4567 · 1,250 pts</div>
                                            </div>
                                            <span class="text-muted-foreground text-xs">Remove</span>
                                        </div>
                                    </div>

                                    <div class="flex-1">
                                        <div class="space-y-1 px-4 py-3 text-sm">
                                            <div class="flex justify-between"><span class="text-muted-foreground">Subtotal</span><span>₱434.00</span></div>
                                            <div class="text-muted-foreground mt-1 space-y-0.5 border-t pt-1 text-xs">
                                                <div class="flex justify-between"><span>VATable Sales</span><span>₱387.50</span></div>
                                                <div class="flex justify-between"><span>VAT (12%)</span><span>₱46.50</span></div>
                                            </div>
                                            <div class="mt-1 flex justify-between border-t pt-2 text-base font-bold">
                                                <span>TOTAL DUE</span><span class="text-primary">₱434.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="space-y-2 border-t p-3">
                                        <div class="grid grid-cols-2 gap-2">
                                            <span class="rounded-lg border py-2 text-center text-xs font-medium">Hold</span>
                                            <span class="rounded-lg border py-2 text-center text-xs font-medium">Discount</span>
                                            <span class="rounded-lg border py-2 text-center text-xs font-medium">SC / PWD</span>
                                            <span class="text-destructive rounded-lg border py-2 text-center text-xs font-medium">Clear</span>
                                        </div>
                                        <div class="bg-primary text-primary-foreground w-full rounded-xl py-4 text-center text-base font-bold tracking-wide">
                                            CHARGE ₱434.00 <span class="text-primary-foreground/70 ml-1 text-xs">F12</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features -->
        <section id="features" class="bg-sidebar scroll-mt-20 border-y py-20">
            <div class="mx-auto max-w-6xl px-6">
                <div class="mb-16 text-center">
                    <p class="text-primary text-sm font-semibold tracking-widest uppercase">Why POS1</p>
                    <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Sell more. Worry less.</h2>
                    <p class="text-muted-foreground mx-auto mt-3 max-w-2xl">
                        Everything a Philippine store needs to serve customers faster, stay compliant and grow.
                    </p>
                </div>

                <div class="space-y-20">
                    <div
                        v-for="(f, i) in spotlights"
                        :key="f.key"
                        class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                    >
                        <!-- Copy -->
                        <div :class="i % 2 === 1 ? 'lg:order-2' : ''">
                            <div class="text-primary mb-3 inline-flex items-center gap-2 text-sm font-semibold">
                                <span class="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                                    <component :is="f.icon" class="h-4 w-4" />
                                </span>
                                {{ f.eyebrow }}
                            </div>
                            <h3 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ f.title }}</h3>
                            <p class="text-muted-foreground mt-3">{{ f.text }}</p>
                            <ul class="mt-6 space-y-3">
                                <li v-for="pt in f.points" :key="pt" class="flex items-start gap-3 text-sm">
                                    <span class="bg-primary text-primary-foreground mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                                        <Check class="h-3 w-3" />
                                    </span>
                                    {{ pt }}
                                </li>
                            </ul>
                        </div>

                        <!-- Visual -->
                        <div
                            class="relative rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 sm:p-10"
                            :class="i % 2 === 1 ? 'lg:order-1' : ''"
                        >
                            <!-- Checkout: Process Payment modal -->
                            <div v-if="f.key === 'checkout'" class="mx-auto max-w-sm rounded-xl border bg-white text-sm shadow-xl">
                                <div class="border-b px-5 py-3 font-semibold">Process Payment</div>
                                <div class="space-y-4 p-5">
                                    <div class="text-center">
                                        <div class="text-muted-foreground text-sm">Total Due</div>
                                        <div class="text-primary text-3xl font-bold">₱434.00</div>
                                    </div>
                                    <div class="grid grid-cols-4 gap-2">
                                        <span
                                            v-for="m in ['Cash', 'GCash', 'Card', 'Maya']"
                                            :key="m"
                                            class="rounded-lg border py-2 text-center text-xs font-medium"
                                            :class="m === 'Cash' ? 'border-primary bg-primary/5 text-primary' : ''"
                                        >{{ m }}</span>
                                    </div>
                                    <div class="bg-muted/40 space-y-1.5 rounded-lg p-3">
                                        <div class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Payments</div>
                                        <div class="flex justify-between"><span class="font-medium">GCash</span><span>₱200.00</span></div>
                                        <div class="flex justify-between"><span class="font-medium">Cash</span><span>₱300.00</span></div>
                                        <div class="flex justify-between border-t pt-1.5"><span>Total Paid</span><span class="text-green-600">₱500.00</span></div>
                                        <div class="flex justify-between"><span class="text-muted-foreground">Change</span><span class="font-semibold text-blue-600">₱66.00</span></div>
                                    </div>
                                    <div class="bg-primary text-primary-foreground rounded-lg py-2.5 text-center font-semibold">Confirm Payment</div>
                                </div>
                            </div>

                            <!-- BIR: SC/PWD receipt -->
                            <div v-else-if="f.key === 'bir'" class="mx-auto max-w-xs bg-white px-6 pt-6 pb-8 font-mono text-xs shadow-xl [mask-image:linear-gradient(to_bottom,black_94%,transparent)]">
                                <div class="text-center">
                                    <div class="font-sans text-sm font-bold">POS1 DEMO STORE</div>
                                    <div class="text-muted-foreground">VAT REG TIN 123-456-789-000</div>
                                    <div class="text-muted-foreground">OR# POS-20261117-00327</div>
                                </div>
                                <div class="my-3 border-t border-dashed" />
                                <div class="flex justify-between"><span>Biogesic 500mg x10</span><span>560.00</span></div>
                                <div class="my-3 border-t border-dashed" />
                                <div class="space-y-1">
                                    <div class="flex justify-between"><span>Subtotal</span><span>560.00</span></div>
                                    <div class="flex justify-between"><span>Less: VAT 12%</span><span>-60.00</span></div>
                                    <div class="flex justify-between text-emerald-600"><span>Less: SC/PWD 20%</span><span>-100.00</span></div>
                                </div>
                                <div class="my-3 border-t border-dashed" />
                                <div class="flex justify-between font-sans text-base font-bold"><span>TOTAL</span><span>₱400.00</span></div>
                                <div class="my-3 border-t border-dashed" />
                                <div class="text-muted-foreground space-y-1">
                                    <div class="flex justify-between"><span>VATable Sales</span><span>0.00</span></div>
                                    <div class="flex justify-between"><span>VAT-Exempt Sales</span><span>500.00</span></div>
                                    <div class="flex justify-between"><span>VAT Amount</span><span>0.00</span></div>
                                </div>
                                <div class="mt-3 rounded bg-emerald-50 px-2 py-1 text-center font-sans text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                                    SC ID: 2026-00418 · Juan Dela Cruz
                                </div>
                            </div>

                            <!-- Stock: Reorder Dashboard -->
                            <div v-else-if="f.key === 'stock'" class="space-y-3 rounded-xl border bg-white p-4 text-sm shadow-xl">
                                <div class="grid grid-cols-3 gap-2">
                                    <div class="rounded-lg border p-2.5">
                                        <div class="flex items-center gap-1 text-xs text-orange-600"><AlertTriangle class="h-3.5 w-3.5" />Low Stock</div>
                                        <div class="text-xl font-bold text-orange-600">8</div>
                                    </div>
                                    <div class="rounded-lg border p-2.5">
                                        <div class="text-destructive flex items-center gap-1 text-xs"><PackageOpen class="h-3.5 w-3.5" />Out of Stock</div>
                                        <div class="text-destructive text-xl font-bold">2</div>
                                    </div>
                                    <div class="rounded-lg border p-2.5">
                                        <div class="text-muted-foreground flex items-center gap-1 text-xs"><Building2 class="h-3.5 w-3.5" />Suppliers</div>
                                        <div class="text-xl font-bold">3</div>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex items-center gap-2">
                                        <span class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">MG</span>
                                        <div>
                                            <div class="font-semibold">Metro Grocery Supply</div>
                                            <div class="text-muted-foreground flex items-center gap-1 text-xs"><Phone class="h-3 w-3" />(02) 8123 4567</div>
                                        </div>
                                    </div>
                                    <span class="bg-primary text-primary-foreground flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium">
                                        <Plus class="h-3 w-3" /> Create PO
                                    </span>
                                </div>
                                <div class="overflow-hidden rounded-lg border">
                                    <div class="bg-muted/30 text-muted-foreground grid grid-cols-[1fr_60px_60px] border-b px-3 py-2 text-xs font-medium">
                                        <span>Product</span><span class="text-right">On Hand</span><span class="text-right">Min</span>
                                    </div>
                                    <div v-for="r in reorderRows" :key="r.sku" class="grid grid-cols-[1fr_60px_60px] items-center border-b px-3 py-2 last:border-0">
                                        <div>
                                            <div class="font-medium">{{ r.name }}</div>
                                            <div class="text-muted-foreground text-xs">{{ r.sku }}</div>
                                        </div>
                                        <span class="text-right font-semibold" :class="r.out ? 'text-destructive' : 'text-orange-600'">{{ r.stock }}</span>
                                        <span class="text-muted-foreground text-right">{{ r.min }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Loyalty: Customer profile -->
                            <div v-else class="space-y-4 rounded-xl border bg-white p-5 text-sm shadow-xl">
                                <div class="flex items-center gap-3">
                                    <span class="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold">MS</span>
                                    <div>
                                        <div class="text-lg font-semibold">Maria Santos</div>
                                        <div class="text-muted-foreground flex items-center gap-1 text-xs"><Phone class="h-3 w-3" />0917 123 4567</div>
                                    </div>
                                </div>
                                <div class="grid grid-cols-3 gap-2">
                                    <div class="rounded-lg border p-2.5">
                                        <div class="text-muted-foreground text-xs">Purchases</div>
                                        <div class="text-lg font-bold">48</div>
                                    </div>
                                    <div class="rounded-lg border p-2.5">
                                        <div class="text-muted-foreground text-xs">Total Spent</div>
                                        <div class="text-lg font-bold">₱18,420</div>
                                    </div>
                                    <div class="rounded-lg border p-2.5">
                                        <div class="flex items-center gap-1 text-xs text-orange-500"><Star class="h-3 w-3" />Points</div>
                                        <div class="text-lg font-bold text-orange-500">1,250</div>
                                    </div>
                                </div>
                                <div class="overflow-hidden rounded-lg border">
                                    <div class="bg-muted/30 border-b px-3 py-2 text-xs font-medium">Loyalty Ledger</div>
                                    <div v-for="l in ledger" :key="l.ref" class="flex items-center justify-between border-b px-3 py-2 last:border-0">
                                        <div>
                                            <div class="font-medium">{{ l.label }}</div>
                                            <div class="text-muted-foreground font-mono text-xs">{{ l.ref }}</div>
                                        </div>
                                        <span class="font-semibold" :class="l.positive ? 'text-emerald-600' : 'text-destructive'">{{ l.pts }} pts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- And much more -->
                <div class="mt-24 rounded-2xl border bg-white p-8">
                    <h3 class="text-center text-lg font-semibold">And much more, built in</h3>
                    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div v-for="m in moreFeatures" :key="m.label" class="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm">
                            <component :is="m.icon" class="text-primary h-4 w-4 shrink-0" />
                            {{ m.label }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Free trial offer -->
        <section id="trial" class="mx-auto max-w-6xl scroll-mt-20 px-6 pt-20">
            <div class="relative overflow-hidden rounded-3xl bg-[#141A2A] text-white">
                <div class="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary)_45%,transparent),transparent_70%)]" />

                <div class="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
                    <!-- Copy -->
                    <div>
                        <span class="bg-primary inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                            <Gift class="h-3.5 w-3.5" /> Limited offer
                        </span>
                        <h2 class="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                            Try the full POS1 package
                            <span class="text-blue-300">free for 2 weeks</span>
                        </h2>
                        <p class="mt-4 text-slate-300">
                            No need to buy equipment to find out if POS1 is right for your store. We lend you a
                            complete, ready-to-sell setup at no cost during your trial.
                        </p>

                        <div class="mt-8 space-y-4">
                            <div v-for="(step, i) in trialSteps" :key="step.title" class="flex items-start gap-4">
                                <span class="bg-primary/20 text-blue-300 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                    {{ i + 1 }}
                                </span>
                                <div>
                                    <div class="font-semibold">{{ step.title }}</div>
                                    <div class="text-sm text-slate-400">{{ step.text }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 flex flex-wrap items-center gap-4">
                            <Link
                                :href="$page.props.auth.user ? dashboard() : register()"
                                class="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold"
                            >
                                Book your free trial
                                <ArrowRight class="h-4 w-4" />
                            </Link>
                            <span class="text-xs text-slate-400">No credit card required. Terms apply.</span>
                        </div>
                    </div>

                    <!-- Hardware -->
                    <div>
                        <p class="mb-4 text-sm font-semibold tracking-widest text-slate-400 uppercase">Free use of</p>
                        <div class="grid grid-cols-2 gap-4">
                            <div
                                v-for="hw in trialHardware"
                                :key="hw.name"
                                class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-colors hover:border-blue-300/40 hover:bg-white/10"
                            >
                                <span class="bg-primary flex h-12 w-12 items-center justify-center rounded-xl">
                                    <component :is="hw.icon" class="h-6 w-6" />
                                </span>
                                <div class="mt-4 font-semibold">{{ hw.name }}</div>
                                <div class="text-sm text-slate-400">{{ hw.note }}</div>
                            </div>
                        </div>
                        <div class="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                            <div>
                                <div class="text-sm text-slate-400">Your cost during the trial</div>
                                <div class="font-semibold">Full setup for 14-30 days</div>
                            </div>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-blue-300">₱0</div>
                                <div class="text-xs text-slate-400">during trial</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Pricing -->
        <section id="pricing" class="mx-auto max-w-6xl scroll-mt-20 px-6 pt-20">
            <div class="mb-12 text-center">
                <p class="text-primary text-sm font-semibold tracking-widest uppercase">Pricing</p>
                <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing that grows with your store</h2>
                <p class="text-muted-foreground mx-auto mt-3 max-w-2xl">
                    Start free and upgrade when you need more. No setup fees, cancel anytime.
                </p>
            </div>

            <div class="grid items-start gap-6 lg:grid-cols-3">
                <div
                    v-for="plan in plans"
                    :key="plan.name"
                    class="relative flex h-full flex-col rounded-2xl border bg-white p-8"
                    :class="plan.highlight ? 'border-primary ring-primary shadow-primary/10 shadow-xl ring-1 lg:-mt-4 lg:pb-12' : ''"
                >
                    <span
                        v-if="plan.highlight"
                        class="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold"
                    >
                        Most Popular
                    </span>

                    <h3 class="text-lg font-semibold" :class="plan.highlight ? 'text-primary' : ''">{{ plan.name }}</h3>
                    <p class="text-muted-foreground mt-1 min-h-10 text-sm">{{ plan.tagline }}</p>

                    <div class="mt-6 flex items-baseline gap-1">
                        <span class="text-4xl font-bold tracking-tight">₱{{ plan.price }}</span>
                        <span class="text-muted-foreground text-sm">/ month</span>
                    </div>

                    <Link
                        :href="$page.props.auth.user ? dashboard() : register()"
                        class="mt-6 rounded-xl py-3 text-center text-sm font-semibold transition-colors"
                        :class="plan.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted border'"
                    >
                        {{ plan.cta }}
                    </Link>

                    <div class="bg-muted/50 mt-6 space-y-1.5 rounded-lg p-3">
                        <div v-for="(l, li) in plan.limits" :key="l" class="flex items-center gap-2 text-sm font-semibold">
                            <component :is="li === 0 ? Package : Users" class="text-primary h-4 w-4 shrink-0" />
                            {{ l }}
                        </div>
                        <div v-if="plan.domain" class="flex items-start gap-2 text-sm font-semibold">
                            <Globe class="text-primary mt-0.5 h-4 w-4 shrink-0" />
                            <div>
                                Own custom domain
                                <div class="text-primary border-primary/20 mt-1 inline-block rounded-md border bg-white px-2 py-0.5 font-mono text-xs font-medium">
                                    https://{{ plan.domain }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p v-if="plan.intro" class="mt-6 text-sm font-medium">{{ plan.intro }}</p>
                    <ul class="space-y-3 text-sm" :class="plan.intro ? 'mt-3' : 'mt-6'">
                        <li v-for="feat in plan.features" :key="feat" class="flex items-start gap-3">
                            <Check class="text-primary mt-0.5 h-4 w-4 shrink-0" />
                            {{ feat }}
                        </li>
                        <li v-for="feat in plan.excluded ?? []" :key="feat" class="text-muted-foreground/70 flex items-start gap-3">
                            <X class="mt-0.5 h-4 w-4 shrink-0" />
                            {{ feat }}
                        </li>
                    </ul>
                </div>
            </div>

            <p class="text-muted-foreground mt-8 text-center text-sm">
                All prices in Philippine Peso (₱), billed monthly.
            </p>
        </section>

        <!-- CTA -->
        <section class="mx-auto max-w-6xl px-6 py-20">
            <div class="rounded-3xl bg-[#141A2A] px-8 py-14 text-center text-white">
                <ShieldCheck class="text-primary mx-auto mb-4 h-10 w-10" />
                <h2 class="text-3xl font-bold tracking-tight">Ready to ring up your first sale?</h2>
                <p class="mx-auto mt-3 max-w-xl text-slate-300">Set up your store in minutes and start selling with POS1 today.</p>
                <Link
                    :href="$page.props.auth.user ? dashboard() : login()"
                    class="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold"
                >
                    {{ $page.props.auth.user ? 'Open Dashboard' : 'Log in to POS1' }}
                    <ArrowRight class="h-4 w-4" />
                </Link>
            </div>
        </section>

        <footer class="text-muted-foreground border-t py-8 text-center text-sm">
            © {{ new Date().getFullYear() }} POS1 — No.1 POS Software · Powered by Melonz IT Solutions
        </footer>
    </div>
</template>

<style scoped>
.marquee-track {
    animation: marquee 30s linear infinite;
}

.marquee:hover .marquee-track {
    animation-play-state: paused;
}

@keyframes marquee {
    from {
        transform: translateX(0);
    }

    to {
        transform: translateX(-100%);
    }
}

@media (prefers-reduced-motion: reduce) {
    .marquee-track {
        animation-duration: 90s;
    }
}
</style>
