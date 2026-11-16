<script setup lang="ts">
import { computed } from 'vue';
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
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import type { Category } from '@/types/models';

const props = defineProps<{
    parentCategories: Pick<Category, 'id' | 'name'>[];
}>();

const form = useForm({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    is_active: true,
    sort_order: 0,
});

const parentIdSelect = computed({
    get: () => form.parent_id || 'none',
    set: (val: string) => { form.parent_id = val === 'none' ? '' : val; },
});

function submit() {
    form.post(CategoryController.store.url(), {
        preserveScroll: true,
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Categories', href: CategoryController.index.url() },
        { title: 'New Category', href: CategoryController.create.url() },
    ]">
        <div class="max-w-xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">New Category</h1>
                <p class="text-muted-foreground text-sm">Add a product category</p>
            </div>

            <form @submit.prevent="submit" class="space-y-5">
                <div class="space-y-1.5">
                    <Label for="name">Name <span class="text-destructive">*</span></Label>
                    <Input id="name" v-model="form.name" placeholder="e.g. Beverages" autofocus />
                    <InputError :message="form.errors.name" />
                </div>

                <div class="space-y-1.5">
                    <Label for="slug">Slug <span class="text-muted-foreground text-xs">(auto-generated if empty)</span></Label>
                    <Input id="slug" v-model="form.slug" placeholder="e.g. beverages" />
                    <InputError :message="form.errors.slug" />
                </div>

                <div class="space-y-1.5">
                    <Label for="description">Description</Label>
                    <textarea
                        id="description"
                        v-model="form.description"
                        rows="3"
                        class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Optional description"
                    />
                    <InputError :message="form.errors.description" />
                </div>

                <div class="space-y-1.5">
                    <Label>Parent Category</Label>
                    <Select v-model="parentIdSelect">
                        <SelectTrigger>
                            <SelectValue placeholder="None (top-level)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None (top-level)</SelectItem>
                            <SelectItem
                                v-for="cat in parentCategories"
                                :key="cat.id"
                                :value="String(cat.id)"
                            >
                                {{ cat.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError :message="form.errors.parent_id" />
                </div>

                <div class="space-y-1.5">
                    <Label for="sort_order">Sort Order</Label>
                    <Input id="sort_order" v-model.number="form.sort_order" type="number" min="0" />
                    <InputError :message="form.errors.sort_order" />
                </div>

                <div class="flex items-center gap-2">
                    <Checkbox id="is_active" v-model:checked="form.is_active" />
                    <Label for="is_active" class="cursor-pointer">Active</Label>
                </div>

                <div class="flex gap-3 pt-2">
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Creating…' : 'Create Category' }}
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="CategoryController.index.url()">Cancel</a>
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
