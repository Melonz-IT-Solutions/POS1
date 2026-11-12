<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import * as CustomerController from '@/actions/App/Http/Controllers/Admin/CustomerController';
import type { Customer } from '@/types/models';

const props = defineProps<{ customer: Customer }>();

const form = useForm({
    name: props.customer.name,
    phone: props.customer.phone ?? '',
    email: props.customer.email ?? '',
    address: props.customer.address ?? '',
    notes: props.customer.notes ?? '',
    discount_rate: props.customer.discount_rate,
    is_active: props.customer.is_active,
});

function submit() {
    form.put(CustomerController.update.url({ customer: props.customer.id }), { preserveScroll: true });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Customers', href: CustomerController.index.url() },
        { title: customer.name, href: CustomerController.show.url({ customer: customer.id }) },
        { title: 'Edit', href: CustomerController.edit.url({ customer: customer.id }) },
    ]">
        <div class="mx-auto max-w-xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">Edit Customer</h1>
                <p class="text-muted-foreground text-sm">{{ customer.name }}</p>
            </div>

            <form @submit.prevent="submit" class="space-y-5">
                <div class="space-y-1.5">
                    <Label for="name">Name <span class="text-destructive">*</span></Label>
                    <Input id="name" v-model="form.name" autofocus />
                    <InputError :message="form.errors.name" />
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
                        rows="2"
                        class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <InputError :message="form.errors.address" />
                </div>

                <div class="space-y-1.5">
                    <Label for="discount_rate">
                        Discount Rate
                        <span class="text-muted-foreground font-normal text-xs ml-1">(basis points, e.g. 500 = 5%)</span>
                    </Label>
                    <div class="relative">
                        <Input
                            id="discount_rate"
                            v-model.number="form.discount_rate"
                            type="number"
                            min="0"
                            max="10000"
                            class="pr-16"
                        />
                        <span class="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                            {{ (form.discount_rate / 100).toFixed(2) }}%
                        </span>
                    </div>
                    <InputError :message="form.errors.discount_rate" />
                </div>

                <div class="space-y-1.5">
                    <Label for="notes">Notes</Label>
                    <textarea
                        id="notes"
                        v-model="form.notes"
                        rows="2"
                        class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <InputError :message="form.errors.notes" />
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox id="is_active" v-model:checked="form.is_active" />
                    <Label for="is_active" class="cursor-pointer">Active</Label>
                </div>

                <div class="flex gap-3 pt-2">
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Saving…' : 'Save Changes' }}
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="CustomerController.show.url({ customer: customer.id })">Cancel</a>
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
