<script setup lang="ts">
import { ref, watch, computed } from 'vue';
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
    categories:  Pick<Category, 'id' | 'name'>[];
    vatTypes:    { value: string; label: string }[];
    allProducts: Pick<Product, 'id' | 'name' | 'sku' | 'selling_price'>[];
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
    is_bundle: false,
    image: null as File | null,
});

// Bundle items
interface BundleLine { component_id: number; name: string; sku: string; quantity: number; unit_price: number }
const bundleLines   = ref<BundleLine[]>([]);
const bundleSearch  = ref('');

const filteredForBundle = computed(() => {
    const q = bundleSearch.value.toLowerCase();
    return q ? props.allProducts.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) : props.allProducts;
});

function addBundleComponent(p: Pick<Product, 'id' | 'name' | 'sku' | 'selling_price'>) {
    const existing = bundleLines.value.find(l => l.component_id === p.id);
    if (existing) { existing.quantity++; } else {
        bundleLines.value.push({ component_id: p.id, name: p.name, sku: p.sku, quantity: 1, unit_price: p.selling_price });
    }
    bundleSearch.value = '';
}

function removeBundleLine(idx: number) { bundleLines.value.splice(idx, 1); }

function peso(c: number) { return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`; }

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
        cost_price:    Math.round(parseFloat(String(data.cost_price)) * 100) || 0,
        selling_price: Math.round(parseFloat(String(data.selling_price)) * 100) || 0,
        stock_quantity: parseInt(String(data.stock_quantity)) || 0,
        minimum_stock:  parseInt(String(data.minimum_stock)) || 0,
        bundle_items: data.is_bundle ? bundleLines.value.map(l => ({ component_id: l.component_id, quantity: l.quantity })) : [],
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
        <div class="max-w-2xl p-6 space-y-6">
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

                <!-- Bundle toggle -->
                <div class="rounded-xl border p-5 space-y-4">
                    <div class="flex items-center gap-2">
                        <Checkbox id="is_bundle" v-model:checked="form.is_bundle" />
                        <Label for="is_bundle" class="cursor-pointer font-semibold">This is a bundle / kit</Label>
                    </div>
                    <p class="text-xs text-muted-foreground">Bundles combine multiple products into one item sold together.</p>

                    <template v-if="form.is_bundle">
                        <Input v-model="bundleSearch" placeholder="Search components to add..." />
                        <div v-if="bundleSearch" class="border rounded-md divide-y max-h-40 overflow-y-auto text-sm">
                            <div
                                v-for="p in filteredForBundle.slice(0, 15)"
                                :key="p.id"
                                class="flex items-center justify-between px-3 py-1.5 hover:bg-muted cursor-pointer"
                                @click="addBundleComponent(p)"
                            >
                                <span>{{ p.name }} <span class="text-muted-foreground text-xs">{{ p.sku }}</span></span>
                                <span class="font-mono text-xs">{{ peso(p.selling_price) }}</span>
                            </div>
                        </div>
                        <div v-if="bundleLines.length" class="border rounded-md overflow-hidden">
                            <table class="w-full text-sm">
                                <thead class="bg-muted/50"><tr>
                                    <th class="text-left px-3 py-1.5">Component</th>
                                    <th class="text-right px-3 py-1.5 w-20">Qty</th>
                                    <th class="px-3 py-1.5 w-8"></th>
                                </tr></thead>
                                <tbody>
                                    <tr v-for="(l, i) in bundleLines" :key="i" class="border-t">
                                        <td class="px-3 py-1.5">{{ l.name }} <span class="text-xs text-muted-foreground">{{ l.sku }}</span></td>
                                        <td class="px-3 py-1.5 text-right">
                                            <input v-model.number="l.quantity" type="number" min="1" class="w-14 border rounded px-1.5 py-0.5 text-xs text-right bg-background" />
                                        </td>
                                        <td class="px-3 py-1.5 text-center">
                                            <button type="button" @click="removeBundleLine(i)" class="text-muted-foreground hover:text-destructive text-xs">✕</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p v-else class="text-xs text-muted-foreground">No components added yet.</p>
                    </template>
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
