<script setup lang="ts">
import { ref } from 'vue';
import { router, useForm } from '@inertiajs/vue3';
import { Eye, FolderOpen, Pencil, Plus, RotateCcw, Trash2 } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import type { Category } from '@/types/models';

interface Props {
    categories: (Category & { children?: Category[] })[];
}

const props = defineProps<Props>();

const confirmDelete = ref(false);
const targetCategory = ref<Category | null>(null);

function askDelete(cat: Category) {
    targetCategory.value = cat;
    confirmDelete.value = true;
}

function doDelete() {
    if (!targetCategory.value) return;
    router.delete(CategoryController.destroy.url({ category: targetCategory.value.id }), {
        preserveScroll: true,
    });
}

function restore(id: number) {
    router.post(CategoryController.restore.url({ id }), {}, { preserveScroll: true });
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Categories', href: CategoryController.index.url() }]">
        <div class="p-6 space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Categories</h1>
                    <p class="text-muted-foreground text-sm">Organise products into categories</p>
                </div>
                <Button as-child>
                    <a :href="CategoryController.create.url()">
                        <Plus class="mr-2 h-4 w-4" />
                        New Category
                    </a>
                </Button>
            </div>

            <div class="rounded-xl border">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b text-left">
                            <th class="px-4 py-3 font-medium">Name</th>
                            <th class="px-4 py-3 font-medium">Products</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="cat in categories" :key="cat.id">
                            <!-- Parent row -->
                            <tr :class="['border-b transition-colors', cat.deleted_at ? 'opacity-50' : 'hover:bg-muted/50']">
                                <td class="px-4 py-3">
                                    <div class="flex items-center gap-2 font-medium">
                                        <FolderOpen class="h-4 w-4 text-primary" />
                                        {{ cat.name }}
                                    </div>
                                    <p v-if="cat.description" class="text-muted-foreground text-xs mt-0.5">{{ cat.description }}</p>
                                </td>
                                <td class="px-4 py-3 text-muted-foreground">{{ cat.products_count ?? 0 }}</td>
                                <td class="px-4 py-3">
                                    <Badge v-if="cat.deleted_at" variant="destructive">Deleted</Badge>
                                    <Badge v-else-if="cat.is_active" variant="secondary" class="bg-green-100 text-green-800">Active</Badge>
                                    <Badge v-else variant="outline">Inactive</Badge>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <div class="flex items-center justify-end gap-1">
                                        <Button v-if="cat.deleted_at" size="sm" variant="ghost" @click="restore(cat.id)" title="Restore">
                                            <RotateCcw class="h-4 w-4" />
                                        </Button>
                                        <template v-else>
                                            <Button size="sm" variant="ghost" as-child>
                                                <a :href="CategoryController.show.url({ category: cat.id })" title="View">
                                                    <Eye class="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="ghost" as-child>
                                                <a :href="CategoryController.edit.url({ category: cat.id })" title="Edit">
                                                    <Pencil class="h-4 w-4" />
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="ghost" class="text-destructive" @click="askDelete(cat)" title="Delete">
                                                <Trash2 class="h-4 w-4" />
                                            </Button>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <!-- Children rows -->
                            <tr
                                v-for="child in cat.children"
                                :key="child.id"
                                :class="['border-b transition-colors', child.deleted_at ? 'opacity-50 bg-muted/20' : 'bg-muted/20 hover:bg-muted/40']"
                            >
                                <td class="px-4 py-2">
                                    <div class="flex items-center gap-2 pl-6 text-sm">
                                        <span class="text-muted-foreground">└</span>
                                        {{ child.name }}
                                    </div>
                                </td>
                                <td class="px-4 py-2 text-muted-foreground text-sm">{{ child.products_count ?? 0 }}</td>
                                <td class="px-4 py-2">
                                    <Badge v-if="child.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                                    <Badge v-else-if="child.is_active" variant="secondary" class="bg-green-100 text-green-800 text-xs">Active</Badge>
                                    <Badge v-else variant="outline" class="text-xs">Inactive</Badge>
                                </td>
                                <td class="px-4 py-2 text-right">
                                    <div class="flex items-center justify-end gap-1">
                                        <Button v-if="child.deleted_at" size="sm" variant="ghost" @click="restore(child.id)" title="Restore">
                                            <RotateCcw class="h-3.5 w-3.5" />
                                        </Button>
                                        <template v-else>
                                            <Button size="sm" variant="ghost" as-child>
                                                <a :href="CategoryController.show.url({ category: child.id })" title="View">
                                                    <Eye class="h-3.5 w-3.5" />
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="ghost" as-child>
                                                <a :href="CategoryController.edit.url({ category: child.id })" title="Edit">
                                                    <Pencil class="h-3.5 w-3.5" />
                                                </a>
                                            </Button>
                                            <Button size="sm" variant="ghost" class="text-destructive" @click="askDelete(child)" title="Delete">
                                                <Trash2 class="h-3.5 w-3.5" />
                                            </Button>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <tr v-if="!categories.length">
                            <td colspan="4" class="text-muted-foreground px-4 py-8 text-center">No categories yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <ConfirmDialog
            v-model:open="confirmDelete"
            title="Delete Category"
            :description="`Delete &quot;${targetCategory?.name}&quot;? This cannot be undone if the category has no products.`"
            confirm-label="Delete"
            @confirm="doDelete"
        />
    </AppLayout>
</template>
