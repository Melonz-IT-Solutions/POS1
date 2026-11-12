<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginationLink[];
}

defineProps<{
    meta: PaginationMeta;
}>();
</script>

<template>
    <div class="flex items-center justify-between gap-4 px-1 py-3">
        <p class="text-muted-foreground text-sm">
            <template v-if="meta.from">
                Showing {{ meta.from }}–{{ meta.to }} of {{ meta.total }} results
            </template>
            <template v-else>No results</template>
        </p>

        <nav class="flex items-center gap-1" aria-label="Pagination">
            <template v-for="link in meta.links" :key="link.label">
                <Link
                    v-if="link.url"
                    :href="link.url"
                    preserve-scroll
                    preserve-state
                    :class="[
                        'inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition-colors',
                        link.active
                            ? 'bg-primary text-primary-foreground border-primary font-medium'
                            : 'hover:bg-muted border-transparent',
                    ]"
                    v-html="link.label"
                />
                <span
                    v-else
                    :class="[
                        'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm',
                        link.active ? 'font-medium' : 'text-muted-foreground opacity-50',
                    ]"
                    v-html="link.label"
                />
            </template>
        </nav>
    </div>
</template>
