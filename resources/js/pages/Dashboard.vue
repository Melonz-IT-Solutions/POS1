<script setup lang="ts">
import { AlertTriangle, ArrowRight, BarChart3, ClipboardList, Package, ShoppingCart, TrendingDown, TrendingUp, Users } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RevenueChart from '@/components/RevenueChart.vue';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';
import { dashboard } from '@/routes';
import type { PurchaseOrderStatus } from '@/types/models';

interface TodayStats {
    revenue: number;
    transactions: number;
    vat: number;
    discounts: number;
    avg_sale: number;
}

interface DayStat { revenue: number; transactions: number }

interface WeekDay {
    date: string;
    label: string;
    is_today: boolean;
    revenue: number;
    transactions: number;
}

interface LowStockItem {
    id: number;
    name: string;
    sku: string;
    stock_quantity: number;
    minimum_stock: number;
}

interface RecentSale {
    id: number;
    receipt_number: string;
    total_amount: number;
    cashier_id: number;
    customer_id: number | null;
    created_at: string;
    cashier?: { id: number; name: string };
    customer?: { id: number; name: string } | null;
}

interface TopProduct {
    product_name: string;
    product_sku: string;
    qty: number;
    revenue: number;
}

interface PendingPO {
    id: number;
    po_number: string;
    status: PurchaseOrderStatus;
    supplier_id: number;
    expected_date: string | null;
    subtotal: number;
    supplier?: { id: number; company_name: string };
}

const props = defineProps<{
    today: TodayStats;
    yesterday: DayStat;
    month: DayStat;
    weeklyRevenue: WeekDay[];
    lowStockItems: LowStockItem[];
    recentSales: RecentSale[];
    topProducts: TopProduct[];
    pendingPOs: PendingPO[];
}>();

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const dtf = new Intl.DateTimeFormat('en-PH', { timeStyle: 'short' });
function formatTime(s: string): string { return dtf.format(new Date(s)); }

const df = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function formatDate(s: string | null): string { return s ? df.format(new Date(s + 'T00:00:00')) : '—'; }

function pctChange(today: number, yesterday: number): number | null {
    if (yesterday === 0) return null;
    return Math.round((today - yesterday) / yesterday * 100);
}

const revenueChange = pctChange(props.today.revenue, props.yesterday.revenue);
const txChange      = pctChange(props.today.transactions, props.yesterday.transactions);

const maxProductRevenue = Math.max(...props.topProducts.map(p => p.revenue), 1);

const poStatusConfig: Partial<Record<PurchaseOrderStatus, { label: string; class: string }>> = {
    ordered:            { label: 'Ordered', class: 'bg-blue-100 text-blue-800' },
    partially_received: { label: 'Partial', class: 'bg-orange-100 text-orange-800' },
};
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Dashboard', href: dashboard() }]">
        <div class="p-6 space-y-6">

            <!-- ── KPI row ──────────────────────────────────────────────── -->
            <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div class="rounded-xl border p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Today's Revenue</p>
                        <div class="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                            <TrendingUp class="h-4 w-4" />
                        </div>
                    </div>
                    <p class="text-3xl font-bold tabular-nums">{{ peso(today.revenue) }}</p>
                    <div class="flex items-center gap-1.5 text-xs">
                        <template v-if="revenueChange !== null">
                            <TrendingUp v-if="revenueChange >= 0" class="h-3.5 w-3.5 text-green-600" />
                            <TrendingDown v-else class="h-3.5 w-3.5 text-red-500" />
                            <span :class="revenueChange >= 0 ? 'text-green-600' : 'text-red-500'">
                                {{ revenueChange >= 0 ? '+' : '' }}{{ revenueChange }}% vs yesterday
                            </span>
                        </template>
                        <span v-else class="text-muted-foreground">No data yesterday</span>
                    </div>
                </div>

                <div class="rounded-xl border p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Transactions</p>
                        <div class="bg-blue-50 text-blue-600 flex h-8 w-8 items-center justify-center rounded-lg">
                            <ShoppingCart class="h-4 w-4" />
                        </div>
                    </div>
                    <p class="text-3xl font-bold tabular-nums">{{ today.transactions.toLocaleString() }}</p>
                    <div class="flex items-center gap-1.5 text-xs">
                        <template v-if="txChange !== null">
                            <TrendingUp v-if="txChange >= 0" class="h-3.5 w-3.5 text-green-600" />
                            <TrendingDown v-else class="h-3.5 w-3.5 text-red-500" />
                            <span :class="txChange >= 0 ? 'text-green-600' : 'text-red-500'">
                                {{ txChange >= 0 ? '+' : '' }}{{ txChange }}% vs yesterday
                            </span>
                        </template>
                        <span v-else class="text-muted-foreground">No data yesterday</span>
                    </div>
                </div>

                <div class="rounded-xl border p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">Avg Sale</p>
                        <div class="bg-purple-50 text-purple-600 flex h-8 w-8 items-center justify-center rounded-lg">
                            <BarChart3 class="h-4 w-4" />
                        </div>
                    </div>
                    <p class="text-3xl font-bold tabular-nums">{{ peso(today.avg_sale) }}</p>
                    <p class="text-muted-foreground text-xs">{{ peso(today.vat) }} VAT · {{ peso(today.discounts) }} discounts</p>
                </div>

                <div class="rounded-xl border p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <p class="text-muted-foreground text-xs font-medium uppercase tracking-wide">This Month</p>
                        <div class="bg-green-50 text-green-600 flex h-8 w-8 items-center justify-center rounded-lg">
                            <TrendingUp class="h-4 w-4" />
                        </div>
                    </div>
                    <p class="text-3xl font-bold tabular-nums">{{ peso(month.revenue) }}</p>
                    <p class="text-muted-foreground text-xs">{{ month.transactions.toLocaleString() }} transactions</p>
                </div>
            </div>



            <!-- ── Quick actions ───────────────────────────────────────── -->
            <div class="rounded-xl border p-5">
                <h2 class="font-semibold text-sm mb-4">Quick Actions</h2>
                <div class="flex flex-wrap gap-3">
                    <Button as-child>
                        <a href="/pos">
                            <ShoppingCart class="mr-2 h-4 w-4" />
                            Open POS Terminal
                        </a>
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="ProductController.create.url()">
                            <Package class="mr-2 h-4 w-4" />
                            New Product
                        </a>
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="PurchaseOrderController.create.url()">
                            <ClipboardList class="mr-2 h-4 w-4" />
                            New Purchase Order
                        </a>
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="ReportController.sales.url()">
                            <BarChart3 class="mr-2 h-4 w-4" />
                            Sales Report
                        </a>
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="ReportController.cashiers.url()">
                            <Users class="mr-2 h-4 w-4" />
                            Cashier Report
                        </a>
                    </Button>
                </div>
            </div>

            <!-- ── 7-day revenue chart ──────────────────────────────────── -->
            <div class="rounded-xl border p-5">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="font-semibold text-sm">Revenue — Last 7 Days</h2>
                        <p class="text-muted-foreground text-xs mt-0.5">Daily completed sales totals</p>
                    </div>
                    <a :href="ReportController.sales.url()" class="text-primary text-xs flex items-center gap-1 hover:underline">
                        Full report <ArrowRight class="h-3 w-3" />
                    </a>
                </div>
                <RevenueChart :data="weeklyRevenue" />
            </div>

            <!-- ── Low stock alert ──────────────────────────────────────── -->
            <div v-if="lowStockItems.length" class="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/30">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <AlertTriangle class="h-5 w-5 text-orange-600" />
                        <span class="font-semibold text-orange-800 dark:text-orange-300">
                            {{ lowStockItems.length }} Low-Stock {{ lowStockItems.length === 1 ? 'Item' : 'Items' }}
                        </span>
                    </div>
                    <Button variant="outline" size="sm" as-child class="border-orange-300 text-orange-800 hover:bg-orange-100">
                        <a :href="InventoryController.index.url()">View Inventory</a>
                    </Button>
                </div>
                <div class="flex flex-wrap gap-2">
                    <a
                        v-for="item in lowStockItems"
                        :key="item.id"
                        :href="ProductController.edit.url({ product: item.id })"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-white/70 border border-orange-200 px-3 py-1.5 text-xs hover:bg-white transition-colors dark:bg-orange-900/30"
                    >
                        <Package class="h-3 w-3 text-orange-600" />
                        <span class="font-medium">{{ item.name }}</span>
                        <span class="text-orange-700 font-mono">{{ item.stock_quantity }}/{{ item.minimum_stock }}</span>
                    </a>
                </div>
            </div>

            <!-- ── Main content grid ────────────────────────────────────── -->
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

                <!-- Recent sales (2/3 width) -->
                <div class="lg:col-span-2 rounded-xl border">
                    <div class="border-b px-4 py-3 flex items-center justify-between">
                        <h2 class="font-semibold text-sm">Recent Sales</h2>
                        <a :href="ReportController.sales.url()" class="text-primary text-xs flex items-center gap-1 hover:underline">
                            View report <ArrowRight class="h-3 w-3" />
                        </a>
                    </div>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-4 py-2 font-medium">Receipt</th>
                                <th class="px-4 py-2 font-medium">Customer</th>
                                <th class="px-4 py-2 font-medium">Cashier</th>
                                <th class="px-4 py-2 font-medium text-right">Amount</th>
                                <th class="px-4 py-2 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="sale in recentSales" :key="sale.id" class="hover:bg-muted/30">
                                <td class="px-4 py-2.5 font-mono text-xs">{{ sale.receipt_number }}</td>
                                <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ sale.customer?.name ?? '—' }}</td>
                                <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ sale.cashier?.name ?? '—' }}</td>
                                <td class="px-4 py-2.5 text-right tabular-nums font-medium">{{ peso(sale.total_amount) }}</td>
                                <td class="px-4 py-2.5 text-right text-muted-foreground text-xs tabular-nums">{{ formatTime(sale.created_at) }}</td>
                            </tr>
                            <tr v-if="!recentSales.length">
                                <td colspan="5" class="text-muted-foreground px-4 py-8 text-center text-xs">No completed sales today.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Right column -->
                <div class="space-y-6">

                    <!-- Top products today -->
                    <div class="rounded-xl border">
                        <div class="border-b px-4 py-3 flex items-center justify-between">
                            <h2 class="font-semibold text-sm">Top Products Today</h2>
                            <a :href="ReportController.products.url()" class="text-primary text-xs flex items-center gap-1 hover:underline">
                                Full report <ArrowRight class="h-3 w-3" />
                            </a>
                        </div>
                        <div class="p-4 space-y-3">
                            <div v-for="p in topProducts" :key="p.product_sku" class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span class="font-medium truncate max-w-[140px]" :title="p.product_name">{{ p.product_name }}</span>
                                    <span class="tabular-nums shrink-0 ml-2">{{ peso(p.revenue) }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                            class="h-full bg-primary/60 rounded-full"
                                            :style="{ width: `${(p.revenue / maxProductRevenue * 100).toFixed(1)}%` }"
                                        />
                                    </div>
                                    <span class="text-muted-foreground text-xs w-14 text-right">{{ p.qty }} units</span>
                                </div>
                            </div>
                            <p v-if="!topProducts.length" class="text-muted-foreground text-xs text-center py-3">
                                No sales yet today.
                            </p>
                        </div>
                    </div>

                    <!-- Pending POs -->
                    <div class="rounded-xl border">
                        <div class="border-b px-4 py-3 flex items-center justify-between">
                            <h2 class="font-semibold text-sm flex items-center gap-2">
                                <ClipboardList class="h-4 w-4 text-muted-foreground" />
                                Pending POs
                            </h2>
                            <a :href="PurchaseOrderController.index.url()" class="text-primary text-xs flex items-center gap-1 hover:underline">
                                View all <ArrowRight class="h-3 w-3" />
                            </a>
                        </div>
                        <div class="divide-y">
                            <a
                                v-for="po in pendingPOs"
                                :key="po.id"
                                :href="PurchaseOrderController.show.url({ purchase: po.id })"
                                class="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
                            >
                                <div>
                                    <p class="font-mono text-xs font-medium">{{ po.po_number }}</p>
                                    <p class="text-muted-foreground text-xs">{{ po.supplier?.company_name ?? '—' }}</p>
                                </div>
                                <div class="text-right space-y-0.5">
                                    <Badge
                                        variant="secondary"
                                        :class="poStatusConfig[po.status]?.class ?? ''"
                                        class="text-xs"
                                    >
                                        {{ poStatusConfig[po.status]?.label ?? po.status }}
                                    </Badge>
                                    <p class="text-muted-foreground text-xs">{{ formatDate(po.expected_date) }}</p>
                                </div>
                            </a>
                            <p v-if="!pendingPOs.length" class="text-muted-foreground text-xs text-center py-5 px-4">
                                No pending purchase orders.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
