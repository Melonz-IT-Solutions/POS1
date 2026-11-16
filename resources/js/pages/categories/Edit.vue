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
    category: Category & { parent?: Pick<Category, 'id' | 'name'> };
    parentCategories: Pick<Category, 'id' | 'name'>[];
}>();

const form = useForm({
    name: props.category.name,
    slug: props.category.slug,
    description: props.category.description ?? '',
    parent_id: props.category.parent_id ? String(props.category.parent_id) : '',
    is_active: props.category.is_active,
    sort_order: props.category.sort_order,
});

const parentIdSelect = computed({
    get: () => form.parent_id || 'none',
    set: (val: string) => { form.parent_id = val === 'none' ? '' : val; },
});

function submit() {
    form.put(CategoryController.update.url({ category: props.category.id }), {
        preserveScroll: true,
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Categories', href: CategoryController.index.url() },
        { title: category.name, href: CategoryController.edit.url({ category: category.id }) },
    ]">
        <div class="max-w-xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">Edit Category</h1>
                <p class="text-muted-foreground text-sm">{{ category.name }}</p>
            </div>

            <form @submit.prevent="submit" class="space-y-5">
                <div class="space-y-1.5">
                    <Label for="name">Name <span class="text-destructive">*</span></Label>
                    <Input id="name" v-model="form.name" autofocus />
                    <InputError :message="form.errors.name" />
                </div>

                <div class="space-y-1.5">
                    <Label for="slug">Slug</Label>
                    <Input id="slug" v-model="form.slug" />
                    <InputError :message="form.errors.slug" />
                </div>

                <div class="space-y-1.5">
                    <Label for="description">Description</Label>
                    <textarea
                        id="description"
                        v-model="form.description"
                        rows="3"
                        class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                        {{ form.processing ? 'Saving…' : 'Save Changes' }}
                    </Button>
                    <Button variant="outline" as-child>
                        <a :href="CategoryController.index.url()">Cancel</a>
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
