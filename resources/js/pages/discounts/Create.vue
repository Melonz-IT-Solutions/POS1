<script setup lang="ts">
import { computed, ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Search } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as DiscountController from '@/actions/App/Http/Controllers/Admin/DiscountController';
import type { Product, Category, Customer } from '@/types/models';

const props = defineProps<{
    products: Pick<Product, 'id' | 'name' | 'sku'>[];
    categories: Pick<Category, 'id' | 'name'>[];
    customers: Pick<Customer, 'id' | 'name' | 'phone'>[];
}>();

const form = useForm({
    name: '',
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '',
    min_purchase: '',
    start_at: '',
    end_at: '',
    is_active: true,
    scope: 'all' as 'all' | 'products' | 'categories' | 'customers',
    product_ids: [] as number[],
    category_ids: [] as number[],
    customer_ids: [] as number[],
});

function submit() {
    form.post(DiscountController.store.url(), { preserveScroll: true });
}

// ── Scope list searching ──────────────────────────────────────────────────
const productSearch = ref('');
const categorySearch = ref('');
const customerSearch = ref('');

const filteredProducts = computed(() =>
    productSearch.value
        ? props.products.filter(p =>
            p.name.toLowerCase().includes(productSearch.value.toLowerCase()) ||
            p.sku.toLowerCase().includes(productSearch.value.toLowerCase()))
        : props.products,
);
const filteredCategories = computed(() =>
    categorySearch.value
        ? props.categories.filter(c => c.name.toLowerCase().includes(categorySearch.value.toLowerCase()))
        : props.categories,
);
const filteredCustomers = computed(() =>
    customerSearch.value
        ? props.customers.filter(c => c.name.toLowerCase().includes(customerSearch.value.toLowerCase()))
        : props.customers,
);

function toggleId(list: number[], id: number) {
    const idx = list.indexOf(id);
    if (idx === -1) list.push(id);
    else list.splice(idx, 1);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Discounts', href: DiscountController.index.url() },
        { title: 'New Discount', href: DiscountController.create.url() },
    ]">
        <div class="max-w-2xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">New Discount</h1>
                <p class="text-muted-foreground text-sm">Create a discount rule</p>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Basic Details -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Discount Details</h2>

                    <div class="space-y-1.5">
                        <Label for="name">Name <span class="text-destructive">*</span></Label>
                        <Input id="name" v-model="form.name" placeholder="e.g. Summer Sale 20%" autofocus />
                        <InputError :message="form.errors.name" />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="code">Coupon Code <span class="text-muted-foreground font-normal">(optional)</span></Label>
                        <Input id="code" v-model="form.code" placeholder="e.g. SUMMER20" class="font-mono uppercase" />
                        <p class="text-muted-foreground text-xs">Leave blank for automatic discounts that don't require a code.</p>
                        <InputError :message="form.errors.code" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label>Type <span class="text-destructive">*</span></Label>
                            <Select v-model="form.type">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                    <SelectItem value="fixed">Fixed Amount (₱)</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.type" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="value">
                                Value <span class="text-destructive">*</span>
                                <span class="text-muted-foreground font-normal ml-1">{{ form.type === 'percentage' ? '(%)' : '(₱)' }}</span>
                            </Label>
                            <Input
                                id="value"
                                v-model="form.value"
                                type="number"
                                step="0.01"
                                min="0.01"
                                :placeholder="form.type === 'percentage' ? 'e.g. 10' : 'e.g. 50.00'"
                            />
                            <InputError :message="form.errors.value" />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <Label for="min_purchase">Minimum Purchase <span class="text-muted-foreground font-normal">(₱, optional)</span></Label>
                        <Input id="min_purchase" v-model="form.min_purchase" type="number" step="0.01" min="0" placeholder="0.00" />
                        <p class="text-muted-foreground text-xs">Leave 0 for no minimum.</p>
                        <InputError :message="form.errors.min_purchase" />
                    </div>
                </div>

                <!-- Validity -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Validity</h2>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label for="start_at">Start Date</Label>
                            <Input id="start_at" v-model="form.start_at" type="datetime-local" />
                            <InputError :message="form.errors.start_at" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="end_at">End Date</Label>
                            <Input id="end_at" v-model="form.end_at" type="datetime-local" />
                            <InputError :message="form.errors.end_at" />
                        </div>
                    </div>
                    <p class="text-muted-foreground text-xs">Leave both blank for a permanent discount.</p>

                    <div class="flex items-center gap-2 pt-1">
                        <Checkbox id="is_active" v-model:checked="form.is_active" />
                        <Label for="is_active" class="cursor-pointer font-normal">Active</Label>
                    </div>
                </div>

                <!-- Scope -->
                <div class="rounded-xl border p-5 space-y-4">
                    <div>
                        <h2 class="font-semibold">Scope</h2>
                        <p class="text-muted-foreground text-xs mt-0.5">Choose which items this discount applies to.</p>
                    </div>

                    <div class="space-y-1.5">
                        <Label>Applies To</Label>
                        <Select v-model="form.scope">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Items</SelectItem>
                                <SelectItem value="products">Specific Products</SelectItem>
                                <SelectItem value="categories">Specific Categories</SelectItem>
                                <SelectItem value="customers">Specific Customers</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError :message="form.errors.scope" />
                    </div>

                    <!-- Product picker -->
                    <div v-if="form.scope === 'products'" class="space-y-2">
                        <div class="relative">
                            <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <Input v-model="productSearch" placeholder="Filter products…" class="pl-9" />
                        </div>
                        <div class="rounded-lg border max-h-48 overflow-y-auto divide-y">
                            <label
                                v-for="p in filteredProducts"
                                :key="p.id"
                                class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50"
                            >
                                <Checkbox
                                    :checked="form.product_ids.includes(p.id)"
                                    @update:checked="toggleId(form.product_ids, p.id)"
                                />
                                <span class="flex-1 text-sm">{{ p.name }}</span>
                                <span class="text-muted-foreground font-mono text-xs">{{ p.sku }}</span>
                            </label>
                            <p v-if="!filteredProducts.length" class="text-muted-foreground px-3 py-4 text-center text-sm">No products found.</p>
                        </div>
                        <p class="text-muted-foreground text-xs">{{ form.product_ids.length }} selected</p>
                        <InputError :message="form.errors.product_ids" />
                    </div>

                    <!-- Category picker -->
                    <div v-if="form.scope === 'categories'" class="space-y-2">
                        <div class="relative">
                            <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <Input v-model="categorySearch" placeholder="Filter categories…" class="pl-9" />
                        </div>
                        <div class="rounded-lg border max-h-48 overflow-y-auto divide-y">
                            <label
                                v-for="c in filteredCategories"
                                :key="c.id"
                                class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50"
                            >
                                <Checkbox
                                    :checked="form.category_ids.includes(c.id)"
                                    @update:checked="toggleId(form.category_ids, c.id)"
                                />
                                <span class="flex-1 text-sm">{{ c.name }}</span>
                            </label>
                            <p v-if="!filteredCategories.length" class="text-muted-foreground px-3 py-4 text-center text-sm">No categories found.</p>
                        </div>
                        <p class="text-muted-foreground text-xs">{{ form.category_ids.length }} selected</p>
                        <InputError :message="form.errors.category_ids" />
                    </div>

                    <!-- Customer picker -->
                    <div v-if="form.scope === 'customers'" class="space-y-2">
                        <div class="relative">
                            <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <Input v-model="customerSearch" placeholder="Filter customers…" class="pl-9" />
                        </div>
                        <div class="rounded-lg border max-h-48 overflow-y-auto divide-y">
                            <label
                                v-for="c in filteredCustomers"
                                :key="c.id"
                                class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50"
                            >
                                <Checkbox
                                    :checked="form.customer_ids.includes(c.id)"
                                    @update:checked="toggleId(form.customer_ids, c.id)"
                                />
                                <span class="flex-1 text-sm">{{ c.name }}</span>
                                <span class="text-muted-foreground text-xs">{{ c.phone ?? '' }}</span>
                            </label>
                            <p v-if="!filteredCustomers.length" class="text-muted-foreground px-3 py-4 text-center text-sm">No customers found.</p>
                        </div>
                        <p class="text-muted-foreground text-xs">{{ form.customer_ids.length }} selected</p>
                        <InputError :message="form.errors.customer_ids" />
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <Button variant="outline" as-child>
                        <a :href="DiscountController.index.url()">Cancel</a>
                    </Button>
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Creating…' : 'Create Discount' }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
