<script setup lang="ts">
import { ref, watch } from 'vue';
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
import type { Category } from '@/types/models';

const props = defineProps<{
    categories: Pick<Category, 'id' | 'name'>[];
    vatTypes: { value: string; label: string }[];
}>();

const form = useForm({
    category_id: '',
    name: '',
    description: '',
    sku: '',
    barcode: '',
    unit_of_measure: 'piece',
    cost_price: '',
    selling_price: '',
    vat_type: 'vatable',
    stock_quantity: '0',
    minimum_stock: '5',
    is_active: true,
    image: null as File | null,
});

const imagePreview = ref<string | null>(null);

function onImageChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    form.image = file;
    if (file) {
        const reader = new FileReader();
        reader.onload = () => { imagePreview.value = reader.result as string; };
        reader.readAsDataURL(file);
    } else {
        imagePreview.value = null;
    }
}

function submit() {
    form.transform((data) => ({
        ...data,
        // Send centavos as integers
        cost_price: Math.round(parseFloat(String(data.cost_price)) * 100) || 0,
        selling_price: Math.round(parseFloat(String(data.selling_price)) * 100) || 0,
        stock_quantity: parseInt(String(data.stock_quantity)) || 0,
        minimum_stock: parseInt(String(data.minimum_stock)) || 0,
    })).post(ProductController.store.url(), {
        forceFormData: true,
        preserveScroll: true,
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Products', href: ProductController.index.url() },
        { title: 'New Product', href: ProductController.create.url() },
    ]">
        <div class="mx-auto max-w-2xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">New Product</h1>
                <p class="text-muted-foreground text-sm">Add a product to the catalog</p>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Basic Info -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Basic Information</h2>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="col-span-2 space-y-1.5">
                            <Label for="name">Product Name <span class="text-destructive">*</span></Label>
                            <Input id="name" v-model="form.name" placeholder="e.g. Coca-Cola 1.5L" autofocus />
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
                            <Input id="unit_of_measure" v-model="form.unit_of_measure" placeholder="piece / kg / L" />
                            <InputError :message="form.errors.unit_of_measure" />
                        </div>

                        <div class="col-span-2 space-y-1.5">
                            <Label for="description">Description</Label>
                            <textarea
                                id="description"
                                v-model="form.description"
                                rows="2"
                                class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Optional description"
                            />
                            <InputError :message="form.errors.description" />
                        </div>
                    </div>
                </div>

                <!-- Identifiers -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Identifiers <span class="text-muted-foreground font-normal text-sm">(auto-generated if blank)</span></h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label for="sku">SKU</Label>
                            <Input id="sku" v-model="form.sku" placeholder="e.g. BEV-001" class="font-mono" />
                            <InputError :message="form.errors.sku" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="barcode">Barcode</Label>
                            <Input id="barcode" v-model="form.barcode" placeholder="13-digit EAN" class="font-mono" />
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
                            <Input id="cost_price" v-model="form.cost_price" type="number" min="0" step="0.01" placeholder="0.00" />
                            <InputError :message="form.errors.cost_price" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="selling_price">Selling Price (₱) <span class="text-destructive">*</span></Label>
                            <Input id="selling_price" v-model="form.selling_price" type="number" min="0" step="0.01" placeholder="0.00" />
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
                </div>

                <!-- Stock -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Inventory</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label for="stock_quantity">Opening Stock <span class="text-destructive">*</span></Label>
                            <Input id="stock_quantity" v-model="form.stock_quantity" type="number" min="0" />
                            <InputError :message="form.errors.stock_quantity" />
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
                                Choose Image
                            </label>
                            <p class="text-muted-foreground text-xs mt-1">JPG, PNG, WebP — max 2 MB</p>
                        </div>
                    </div>
                    <InputError :message="form.errors.image" />
                </div>

                <!-- Active toggle + Submit -->
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
                            {{ form.processing ? 'Creating…' : 'Create Product' }}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
