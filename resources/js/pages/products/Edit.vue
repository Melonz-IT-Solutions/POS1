<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import type { Category, Product } from '@/types/models';

const props = defineProps<{
    product: Product & { category?: Pick<Category, 'id' | 'name'> };
    categories: Pick<Category, 'id' | 'name'>[];
    vatTypes: { value: string; label: string }[];
}>();

const form = useForm({
    category_id: String(props.product.category_id ?? ''),
    name: props.product.name,
    description: props.product.description ?? '',
    sku: props.product.sku,
    barcode: props.product.barcode ?? '',
    unit_of_measure: props.product.unit_of_measure,
    cost_price: (props.product.cost_price / 100).toFixed(2),
    selling_price: (props.product.selling_price / 100).toFixed(2),
    vat_type: props.product.vat_type,
    minimum_stock: String(props.product.minimum_stock),
    is_active: props.product.is_active,
    image: null as File | null,
    price_change_reason: '',
});

const imagePreview = ref<string | null>(
    props.product.image_path ? `/storage/${props.product.image_path}` : null
);

const priceChanged = ref(false);

function onImageChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    form.image = file;
    if (file) {
        const reader = new FileReader();
        reader.onload = () => { imagePreview.value = reader.result as string; };
        reader.readAsDataURL(file);
    }
}

function checkPriceChange() {
    const newCost = Math.round(parseFloat(String(form.cost_price)) * 100) || 0;
    const newSell = Math.round(parseFloat(String(form.selling_price)) * 100) || 0;
    priceChanged.value = newCost !== props.product.cost_price || newSell !== props.product.selling_price;
}

function submit() {
    form.transform((data) => ({
        ...data,
        cost_price: Math.round(parseFloat(String(data.cost_price)) * 100) || 0,
        selling_price: Math.round(parseFloat(String(data.selling_price)) * 100) || 0,
        minimum_stock: parseInt(String(data.minimum_stock)) || 0,
        _method: 'PUT',
    })).post(ProductController.update.url({ product: props.product.id }), {
        forceFormData: true,
        preserveScroll: true,
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Products', href: ProductController.index.url() },
        { title: product.name, href: ProductController.edit.url({ product: product.id }) },
    ]">
        <div class="mx-auto max-w-2xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">Edit Product</h1>
                <p class="text-muted-foreground text-sm">{{ product.name }} · SKU: {{ product.sku }}</p>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Basic Info -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Basic Information</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2 space-y-1.5">
                            <Label for="name">Product Name <span class="text-destructive">*</span></Label>
                            <Input id="name" v-model="form.name" autofocus />
                            <InputError :message="form.errors.name" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>Category <span class="text-destructive">*</span></Label>
                            <Select v-model="form.category_id">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="cat in categories" :key="cat.id" :value="String(cat.id)">
                                        {{ cat.name }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.category_id" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="unit_of_measure">Unit of Measure <span class="text-destructive">*</span></Label>
                            <Input id="unit_of_measure" v-model="form.unit_of_measure" />
                            <InputError :message="form.errors.unit_of_measure" />
                        </div>
                        <div class="col-span-2 space-y-1.5">
                            <Label for="description">Description</Label>
                            <textarea
                                id="description"
                                v-model="form.description"
                                rows="2"
                                class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <InputError :message="form.errors.description" />
                        </div>
                    </div>
                </div>

                <!-- Identifiers -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Identifiers</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label for="sku">SKU</Label>
                            <Input id="sku" v-model="form.sku" class="font-mono" />
                            <InputError :message="form.errors.sku" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="barcode">Barcode</Label>
                            <Input id="barcode" v-model="form.barcode" class="font-mono" />
                            <InputError :message="form.errors.barcode" />
                        </div>
                    </div>
                </div>

                <!-- Pricing -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Pricing</h2>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="space-y-1.5">
                            <Label for="cost_price">Cost Price (₱) <span class="text-destructive">*</span></Label>
                            <Input id="cost_price" v-model="form.cost_price" type="number" min="0" step="0.01" @input="checkPriceChange" />
                            <InputError :message="form.errors.cost_price" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="selling_price">Selling Price (₱) <span class="text-destructive">*</span></Label>
                            <Input id="selling_price" v-model="form.selling_price" type="number" min="0" step="0.01" @input="checkPriceChange" />
                            <InputError :message="form.errors.selling_price" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>VAT Type <span class="text-destructive">*</span></Label>
                            <Select v-model="form.vat_type">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="vt in vatTypes" :key="vt.value" :value="vt.value">
                                        {{ vt.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.vat_type" />
                        </div>
                    </div>

                    <!-- Price change reason (shown only when prices differ) -->
                    <div v-if="priceChanged" class="space-y-1.5">
                        <Label for="price_change_reason">Reason for Price Change</Label>
                        <Input id="price_change_reason" v-model="form.price_change_reason" placeholder="e.g. Supplier price increase" />
                        <InputError :message="form.errors.price_change_reason" />
                    </div>
                </div>

                <!-- Stock -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Inventory</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label>Current Stock</Label>
                            <p class="text-muted-foreground text-sm py-2">
                                {{ product.stock_quantity }} {{ product.unit_of_measure }}
                                <span class="text-xs ml-1">(adjust via Inventory module)</span>
                            </p>
                        </div>
                        <div class="space-y-1.5">
                            <Label for="minimum_stock">Minimum Stock Alert</Label>
                            <Input id="minimum_stock" v-model="form.minimum_stock" type="number" min="0" />
                            <InputError :message="form.errors.minimum_stock" />
                        </div>
                    </div>
                </div>

                <!-- Image -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Product Image</h2>
                    <div class="flex items-center gap-4">
                        <div v-if="imagePreview" class="h-20 w-20 rounded-lg overflow-hidden border">
                            <img :src="imagePreview" alt="Preview" class="h-full w-full object-cover" />
                        </div>
                        <div v-else class="bg-muted h-20 w-20 rounded-lg flex items-center justify-center text-muted-foreground text-xs border">
                            No image
                        </div>
                        <div>
                            <input type="file" id="image" accept="image/*" class="sr-only" @change="onImageChange" />
                            <label for="image" class="cursor-pointer inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors">
                                Change Image
                            </label>
                            <p class="text-muted-foreground text-xs mt-1">JPG, PNG, WebP — max 2 MB</p>
                        </div>
                    </div>
                    <InputError :message="form.errors.image" />
                </div>

                <!-- Active + Submit -->
                <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-2">
                        <Checkbox id="is_active" v-model:checked="form.is_active" />
                        <Label for="is_active" class="cursor-pointer">Active (visible in POS)</Label>
                    </div>
                    <div class="flex gap-3">
                        <Button variant="outline" as-child>
                            <a :href="ProductController.index.url()">Cancel</a>
                        </Button>
                        <Button type="submit" :disabled="form.processing">
                            {{ form.processing ? 'Saving…' : 'Save Changes' }}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
