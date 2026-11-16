<script setup lang="ts">
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import {
    ArrowRight,
    Clock,
    CreditCard,
    Receipt,
    ShoppingBag,
    TrendingUp,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import RevenueChart from '@/components/RevenueChart.vue';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/composables/useCurrency';
import * as SaleController from '@/actions/App/Http/Controllers/POS/SaleController';
import * as POSScreenController from '@/actions/App/Http/Controllers/POS/POSScreenController';
import type { Shift } from '@/types/models';

// ── Types ─────────────────────────────────────────────────────────────────
interface TodayStats {
    revenue:      number;
    transactions: number;
    discounts:    number;
    avg_sale:     number;
}

interface ShiftStats {
    revenue:      number;
    transactions: number;
    duration_min: number;
}

interface WeekDay {
    date:         string;
    label:        string;
    is_today:     boolean;
    revenue:      number;
    transactions: number;
}

interface RecentSale {
    id:             number;
    receipt_number: string;
    total_amount:   number;
    customer_id:    number | null;
    created_at:     string;
    customer?:      { id: number; name: string } | null;
}

interface TopProduct {
    product_name: string;
    qty:          number;
    revenue:      number;
}

const props = defineProps<{
    today:         TodayStats;
    shift:         Shift | null;
    shiftStats:    ShiftStats | null;
    weeklyRevenue: WeekDay[];
    recentSales:   RecentSale[];
    topProducts:   TopProduct[];
}>();

const page = usePage();
const cashierName = computed(() => (page.props.auth as any)?.user?.name ?? 'Cashier');
const { format } = useCurrency();

// ── Time formatters ────────────────────────────────────────────────────────
const dtfShort = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
const dtfTime  = new Intl.DateTimeFormat('en-PH', { timeStyle: 'short' });
function fmt(s: string)      { return dtfShort.format(new Date(s)); }
function fmtTime(s: string)  { return dtfTime.format(new Date(s)); }

function durationLabel(mins: number): string {
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// ── Greeting ───────────────────────────────────────────────────────────────
const greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
});

const today = new Intl.DateTimeFormat('en-PH', { dateStyle: 'full' }).format(new Date());
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Dashboard', href: '/dashboard' }]">
        <div class="p-6 space-y-6 max-w-5xl">

            <!-- Greeting header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold">{{ greeting }}, {{ cashierName }} 👋</h1>
                    <p class="text-muted-foreground text-sm mt-0.5">{{ today }}</p>
                </div>
                <Button as-child size="lg" class="gap-2">
                    <a :href="POSScreenController.index.url()">
                        <ShoppingBag class="h-4 w-4" />
                        Open POS Terminal
                    </a>
                </Button>
            </div>

            <!-- Shift status banner -->
            <div
                class="rounded-xl border p-4 flex flex-wrap items-center gap-4"
                :class="shift ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30' : 'border-muted bg-muted/30'"
            >
                <div
                    class="flex h-10 w-10 items-center justify-center rounded-full text-lg"
                    :class="shift ? 'bg-green-100 dark:bg-green-900/50' : 'bg-muted'"
                >
                    {{ shift ? '🟢' : '⚪' }}
                </div>

                <div class="flex-1 min-w-0">
                    <p class="font-semibold" :class="shift ? 'text-green-800 dark:text-green-200' : 'text-muted-foreground'">
                        {{ shift ? 'Shift is open' : 'No active shift' }}
                    </p>
                    <p v-if="shift" class="text-sm text-green-700 dark:text-green-300">
                        Shift #{{ shift.id }} · Opened {{ fmtTime(shift.opened_at) }}
                        <span v-if="shiftStats">· {{ durationLabel(shiftStats.duration_min) }} · {{ shiftStats.transactions }} transactions</span>
                    </p>
                    <p v-else class="text-sm text-muted-foreground">Open a shift in the POS terminal to start selling.</p>
                </div>

                <div v-if="shift && shiftStats" class="text-right">
                    <p class="text-xs text-muted-foreground">Shift Revenue</p>
                    <p class="text-xl font-bold text-green-700 dark:text-green-300">{{ format(shiftStats.revenue) }}</p>
                </div>

                <Button as-child variant="outline" size="sm" class="gap-1.5 shrink-0">
                    <a :href="POSScreenController.index.url()">
                        <ArrowRight class="h-3.5 w-3.5" />
                        Go to POS
                    </a>
                </Button>
            </div>

            <!-- Today's personal KPI cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Receipt class="h-3.5 w-3.5" />My Sales Today
                    </div>
                    <p class="text-2xl font-bold tabular-nums">{{ today.transactions }}</p>
                    <p class="text-xs text-muted-foreground">transactions</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <TrendingUp class="h-3.5 w-3.5" />My Revenue Today
                    </div>
                    <p class="text-xl font-bold tabular-nums">{{ format(today.revenue) }}</p>
                    <p class="text-xs text-muted-foreground">total collected</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <CreditCard class="h-3.5 w-3.5" />Avg Sale
                    </div>
                    <p class="text-xl font-bold tabular-nums">{{ today.avg_sale > 0 ? format(today.avg_sale) : '—' }}</p>
                    <p class="text-xs text-muted-foreground">per transaction</p>
                </div>

                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Clock class="h-3.5 w-3.5" />Shift Duration
                    </div>
                    <p class="text-xl font-bold tabular-nums">
                        {{ shiftStats ? durationLabel(shiftStats.duration_min) : '—' }}
                    </p>
                    <p class="text-xs text-muted-foreground">{{ shift ? 'active' : 'no open shift' }}</p>
                </div>
            </div>

            <!-- Revenue chart -->
            <div class="rounded-xl border p-5 space-y-3">
                <div class="flex items-center gap-2">
                    <TrendingUp class="h-5 w-5 text-muted-foreground" />
                    <h2 class="font-semibold">My Revenue — Last 7 Days</h2>
                </div>
                <RevenueChart :data="weeklyRevenue" />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

                <!-- Recent transactions -->
                <div class="lg:col-span-3 space-y-3">
                    <div class="flex items-center justify-between">
                        <h2 class="font-semibold flex items-center gap-2">
                            <Receipt class="h-5 w-5 text-muted-foreground" />
                            My Recent Transactions
                        </h2>
                        <Button as-child variant="ghost" size="sm">
                            <a :href="SaleController.index.url()" class="flex items-center gap-1 text-xs">
                                View all <ArrowRight class="h-3 w-3" />
                            </a>
                        </Button>
                    </div>
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2.5 font-medium">Receipt</th>
                                    <th class="px-3 py-2.5 font-medium">Customer</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Total</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr
                                    v-for="sale in recentSales"
                                    :key="sale.id"
                                    class="hover:bg-muted/20 transition-colors"
                                >
                                    <td class="px-3 py-2">
                                        <a
                                            :href="SaleController.show.url({ sale: sale.id })"
                                            class="font-mono text-xs text-primary hover:underline"
                                        >{{ sale.receipt_number }}</a>
                                    </td>
                                    <td class="px-3 py-2 text-muted-foreground text-xs">
                                        {{ sale.customer?.name ?? 'Walk-in' }}
                                    </td>
                                    <td class="px-3 py-2 text-right font-semibold tabular-nums text-xs">
                                        {{ format(sale.total_amount) }}
                                    </td>
                                    <td class="px-3 py-2 text-right text-muted-foreground text-xs whitespace-nowrap">
                                        {{ fmt(sale.created_at) }}
                                    </td>
                                </tr>
                                <tr v-if="recentSales.length === 0">
                                    <td colspan="4" class="px-3 py-8 text-center text-muted-foreground text-sm">
                                        No sales yet today.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Top products today -->
                <div class="lg:col-span-2 space-y-3">
                    <h2 class="font-semibold flex items-center gap-2">
                        <ShoppingBag class="h-5 w-5 text-muted-foreground" />
                        Top Products Today
                    </h2>
                    <div class="rounded-xl border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b bg-muted/30 text-left">
                                    <th class="px-3 py-2.5 font-medium">Product</th>
                                    <th class="px-3 py-2.5 font-medium text-right">Qty</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y">
                                <tr
                                    v-for="p in topProducts"
                                    :key="p.product_name"
                                    class="hover:bg-muted/20 transition-colors"
                                >
                                    <td class="px-3 py-2 text-xs font-medium leading-snug">{{ p.product_name }}</td>
                                    <td class="px-3 py-2 text-right tabular-nums text-xs font-semibold">{{ p.qty }}</td>
                                </tr>
                                <tr v-if="topProducts.length === 0">
                                    <td colspan="2" class="px-3 py-8 text-center text-muted-foreground text-sm">
                                        No sales yet today.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Quick links -->
                    <div class="space-y-2 pt-2">
                        <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Links</p>
                        <div class="grid grid-cols-1 gap-2">
                            <a
                                :href="SaleController.index.url()"
                                class="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                            >
                                <Receipt class="h-4 w-4 text-muted-foreground" />
                                Sales History
                            </a>
                            <a
                                :href="POSScreenController.index.url()"
                                class="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                            >
                                <ShoppingBag class="h-4 w-4 text-muted-foreground" />
                                POS Terminal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
