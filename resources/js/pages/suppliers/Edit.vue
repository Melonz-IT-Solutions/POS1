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
import * as SupplierController from '@/actions/App/Http/Controllers/Admin/SupplierController';
import type { Product, Supplier } from '@/types/models';

const props = defineProps<{
    supplier: Supplier & { products: Pick<Product, 'id' | 'name' | 'sku'>[] };
    products: Pick<Product, 'id' | 'name' | 'sku'>[];
}>();

const form = useForm({
    company_name:   props.supplier.company_name,
    contact_person: props.supplier.contact_person ?? '',
    phone:          props.supplier.phone ?? '',
    email:          props.supplier.email ?? '',
    address:        props.supplier.address ?? '',
    tin:            props.supplier.tin ?? '',
    is_active:      props.supplier.is_active,
    product_ids:    props.supplier.products.map(p => p.id),
});

function submit() {
    form.put(SupplierController.update.url({ supplier: props.supplier.id }), { preserveScroll: true });
}

const productSearch = ref('');
const filteredProducts = computed(() =>
    productSearch.value
        ? props.products.filter(p =>
            p.name.toLowerCase().includes(productSearch.value.toLowerCase()) ||
            p.sku.toLowerCase().includes(productSearch.value.toLowerCase()))
        : props.products,
);

function toggleProduct(id: number) {
    const idx = form.product_ids.indexOf(id);
    if (idx === -1) form.product_ids.push(id);
    else form.product_ids.splice(idx, 1);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Suppliers', href: SupplierController.index.url() },
        { title: supplier.company_name, href: SupplierController.edit.url({ supplier: supplier.id }) },
    ]">
        <div class="mx-auto max-w-2xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">Edit Supplier</h1>
                <p class="text-muted-foreground text-sm">{{ supplier.company_name }}</p>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Contact Info -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Supplier Details</h2>

                    <div class="space-y-1.5">
                        <Label for="company_name">Company Name <span class="text-destructive">*</span></Label>
                        <Input id="company_name" v-model="form.company_name" autofocus />
                        <InputError :message="form.errors.company_name" />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="contact_person">Contact Person</Label>
                        <Input id="contact_person" v-model="form.contact_person" />
                        <InputError :message="form.errors.contact_person" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label for="phone">Phone</Label>
                            <Input id="phone" v-model="form.phone" type="tel" />
                            <InputError :message="form.errors.phone" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="form.email" type="email" />
                            <InputError :message="form.errors.email" />
                        </div>
                    </div>

                    <div class="space-y-1.5">
                        <Label for="address">Address</Label>
                        <textarea
                            id="address"
                            v-model="form.address"
                            rows="3"
                            class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
                        />
                        <InputError :message="form.errors.address" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label for="tin">TIN</Label>
                            <Input id="tin" v-model="form.tin" class="font-mono" />
                            <InputError :message="form.errors.tin" />
                        </div>
                        <div class="flex items-end pb-1">
                            <div class="flex items-center gap-2">
                                <Checkbox id="is_active" v-model:checked="form.is_active" />
                                <Label for="is_active" class="cursor-pointer font-normal">Active</Label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Linked Products -->
                <div class="rounded-xl border p-5 space-y-4">
                    <div>
                        <h2 class="font-semibold">Linked Products</h2>
                        <p class="text-muted-foreground text-xs mt-0.5">Select products this supplier provides.</p>
                    </div>

                    <div class="relative">
                        <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Input v-model="productSearch" placeholder="Filter products…" class="pl-9" />
                    </div>
                    <div class="rounded-lg border max-h-56 overflow-y-auto divide-y">
                        <label
                            v-for="p in filteredProducts"
                            :key="p.id"
                            class="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50"
                        >
                            <Checkbox
                                :checked="form.product_ids.includes(p.id)"
                                @update:checked="toggleProduct(p.id)"
                            />
                            <span class="flex-1 text-sm">{{ p.name }}</span>
                            <span class="text-muted-foreground font-mono text-xs">{{ p.sku }}</span>
                        </label>
                        <p v-if="!filteredProducts.length" class="text-muted-foreground px-3 py-4 text-center text-sm">No products found.</p>
                    </div>
                    <p class="text-muted-foreground text-xs">{{ form.product_ids.length }} selected</p>
                    <InputError :message="form.errors.product_ids" />
                </div>

                <div class="flex justify-end gap-3">
                    <Button variant="outline" as-child>
                        <a :href="SupplierController.index.url()">Cancel</a>
                    </Button>
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Saving…' : 'Save Changes' }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
