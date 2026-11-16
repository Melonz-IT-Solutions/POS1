<script setup lang="ts">
import { computed } from 'vue';
import {
    Calendar,
    CheckCircle,
    Clock,
    Layers,
    Pencil,
    Percent,
    Tag,
    Users,
    XCircle,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/composables/useCurrency';
import * as DiscountController from '@/actions/App/Http/Controllers/Admin/DiscountController';
import * as CustomerController from '@/actions/App/Http/Controllers/Admin/CustomerController';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import type { Category, Customer, Discount, Product } from '@/types/models';

const props = defineProps<{
    discount: Discount & {
        products?: Pick<Product, 'id' | 'name' | 'sku'>[];
        categories?: Pick<Category, 'id' | 'name'>[];
        customers?: Pick<Customer, 'id' | 'name' | 'phone'>[];
    };
    canEdit: boolean;
}>();

const { format } = useCurrency();

// ── Validity status ───────────────────────────────────────────────────────────
type ValidityStatus = 'active' | 'inactive' | 'expired' | 'upcoming' | 'always-on';

const validityStatus = computed((): ValidityStatus => {
    if (!props.discount.is_active) return 'inactive';
    const now = new Date();
    if (props.discount.start_at && new Date(props.discount.start_at) > now) return 'upcoming';
    if (props.discount.end_at   && new Date(props.discount.end_at)   < now) return 'expired';
    if (!props.discount.start_at && !props.discount.end_at) return 'always-on';
    return 'active';
});

const statusConfig: Record<ValidityStatus, { label: string; cls: string }> = {
    'active':    { label: 'Active',     cls: 'bg-green-100 text-green-800 border-0' },
    'inactive':  { label: 'Inactive',   cls: 'bg-gray-100 text-gray-700' },
    'expired':   { label: 'Expired',    cls: 'bg-red-100 text-red-700' },
    'upcoming':  { label: 'Upcoming',   cls: 'bg-blue-100 text-blue-700' },
    'always-on': { label: 'Always On',  cls: 'bg-green-100 text-green-800 border-0' },
};

// ── Formatted discount value ──────────────────────────────────────────────────
const formattedValue = computed(() => {
    if (props.discount.type === 'percentage') {
        return `${(props.discount.value / 100).toFixed(props.discount.value % 100 === 0 ? 0 : 2)}%`;
    }
    return format(props.discount.value);
});

// ── Scope label ───────────────────────────────────────────────────────────────
const scopeConfig: Record<string, { label: string; icon: typeof Percent }> = {
    all:        { label: 'All Products',         icon: Layers },
    products:   { label: 'Specific Products',    icon: Tag },
    categories: { label: 'Specific Categories',  icon: Layers },
    customers:  { label: 'Specific Customers',   icon: Users },
};

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function fmt(s: string | null) { return s ? dtf.format(new Date(s)) : '—'; }

const dtfDate = new Intl.DateTimeFormat('en-PH', { dateStyle: 'long' });
function fmtDate(s: string | null) { return s ? dtfDate.format(new Date(s)) : null; }
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Discounts', href: DiscountController.index.url() },
        { title: discount.name, href: DiscountController.show.url({ discount: discount.id }) },
    ]">
        <div class="p-6 space-y-6 max-w-4xl">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex items-start gap-4">
                    <div class="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-xl">
                        <Percent class="h-7 w-7" />
                    </div>
                    <div>
                        <div class="flex items-center gap-3 flex-wrap">
                            <h1 class="text-2xl font-bold">{{ discount.name }}</h1>
                            <Badge :class="statusConfig[validityStatus].cls" class="text-xs">
                                {{ statusConfig[validityStatus].label }}
                            </Badge>
                            <Badge v-if="discount.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                        </div>
                        <div class="flex items-center gap-3 mt-1 flex-wrap">
                            <code v-if="discount.code" class="text-sm bg-muted px-2 py-0.5 rounded font-mono">{{ discount.code }}</code>
                            <span class="text-muted-foreground text-sm">{{ formattedValue }} off</span>
                            <span v-if="discount.min_purchase > 0" class="text-muted-foreground text-sm">
                                · min. purchase {{ format(discount.min_purchase) }}
                            </span>
                        </div>
                    </div>
                </div>
                <Button v-if="canEdit && !discount.deleted_at" as-child>
                    <a :href="DiscountController.edit.url({ discount: discount.id })">
                        <Pencil class="mr-2 h-4 w-4" />Edit Discount
                    </a>
                </Button>
            </div>

            <!-- Detail cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <!-- Type & Value -->
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Discount Type</p>
                    <p class="font-semibold text-lg">{{ discount.type === 'percentage' ? 'Percentage' : 'Fixed Amount' }}</p>
                    <p class="text-2xl font-bold text-primary">{{ formattedValue }}</p>
                </div>

                <!-- Scope -->
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Applies To</p>
                    <div class="flex items-center gap-1.5 mt-1">
                        <component :is="scopeConfig[discount.scope]?.icon ?? Tag" class="h-4 w-4 text-muted-foreground" />
                        <p class="font-semibold text-sm">{{ scopeConfig[discount.scope]?.label ?? discount.scope }}</p>
                    </div>
                </div>

                <!-- Validity -->
                <div class="rounded-xl border p-4 space-y-1 col-span-2">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <Calendar class="h-3 w-3" />Validity Period
                    </p>
                    <div class="mt-1">
                        <template v-if="!discount.start_at && !discount.end_at">
                            <div class="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                                <CheckCircle class="h-4 w-4" />No expiry — always on
                            </div>
                        </template>
                        <template v-else>
                            <div class="text-sm space-y-0.5">
                                <div v-if="discount.start_at" class="flex items-center gap-1.5 text-muted-foreground">
                                    <Clock class="h-3.5 w-3.5" />
                                    <span>From: <strong class="text-foreground">{{ fmtDate(discount.start_at) }}</strong></span>
                                </div>
                                <div v-if="discount.end_at" class="flex items-center gap-1.5"
                                    :class="validityStatus === 'expired' ? 'text-red-600' : 'text-muted-foreground'"
                                >
                                    <XCircle class="h-3.5 w-3.5" />
                                    <span>Until: <strong>{{ fmtDate(discount.end_at) }}</strong></span>
                                </div>
                                <div v-if="!discount.start_at" class="text-muted-foreground">
                                    <span>No start date restriction</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Scope items -->

            <!-- Products scope -->
            <div v-if="discount.scope === 'products' && discount.products?.length" class="space-y-3">
                <div class="flex items-center gap-2">
                    <Tag class="h-5 w-5 text-muted-foreground" />
                    <h2 class="font-semibold text-lg">Applicable Products</h2>
                    <span class="text-muted-foreground text-sm">({{ discount.products.length }})</span>
                </div>
                <div class="rounded-xl border overflow-hidden">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-4 py-2.5 font-medium">Product</th>
                                <th class="px-4 py-2.5 font-medium">SKU</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="p in discount.products" :key="p.id" class="hover:bg-muted/20">
                                <td class="px-4 py-2.5">
                                    <a :href="ProductController.show.url({ product: p.id })" class="font-medium hover:underline">
                                        {{ p.name }}
                                    </a>
                                </td>
                                <td class="px-4 py-2.5 font-mono text-xs text-muted-foreground">{{ p.sku }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Categories scope -->
            <div v-if="discount.scope === 'categories' && discount.categories?.length" class="space-y-3">
                <div class="flex items-center gap-2">
                    <Layers class="h-5 w-5 text-muted-foreground" />
                    <h2 class="font-semibold text-lg">Applicable Categories</h2>
                    <span class="text-muted-foreground text-sm">({{ discount.categories.length }})</span>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Badge v-for="cat in discount.categories" :key="cat.id" variant="secondary" class="text-sm px-3 py-1">
                        {{ cat.name }}
                    </Badge>
                </div>
            </div>

            <!-- Customers scope -->
            <div v-if="discount.scope === 'customers' && discount.customers?.length" class="space-y-3">
                <div class="flex items-center gap-2">
                    <Users class="h-5 w-5 text-muted-foreground" />
                    <h2 class="font-semibold text-lg">Applicable Customers</h2>
                    <span class="text-muted-foreground text-sm">({{ discount.customers.length }})</span>
                </div>
                <div class="rounded-xl border overflow-hidden">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-4 py-2.5 font-medium">Customer</th>
                                <th class="px-4 py-2.5 font-medium">Phone</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="c in discount.customers" :key="c.id" class="hover:bg-muted/20">
                                <td class="px-4 py-2.5">
                                    <a :href="CustomerController.show.url({ customer: c.id })" class="font-medium hover:underline">
                                        {{ c.name }}
                                    </a>
                                </td>
                                <td class="px-4 py-2.5 text-muted-foreground font-mono text-xs">{{ c.phone ?? '—' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- All products note -->
            <div v-if="discount.scope === 'all'" class="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                <CheckCircle class="h-5 w-5 text-green-600 shrink-0" />
                <p class="text-green-700 text-sm">This discount applies to <strong>all products</strong> in every transaction.</p>
            </div>
        </div>
    </AppLayout>
</template>
