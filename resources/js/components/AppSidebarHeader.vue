<script setup lang="ts">
import { ref } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CommandSearch from '@/components/CommandSearch.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search } from '@lucide/vue';
import type { BreadcrumbItem } from '@/types';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);

const searchRef = ref<InstanceType<typeof CommandSearch> | null>(null);
function openSearch() {
    if (searchRef.value) searchRef.value.open = true;
}
</script>

<template>
    <header
        class="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/70 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4"
    >
        <div class="flex items-center gap-2 flex-1">
            <SidebarTrigger class="-ml-1" />
            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </template>
        </div>

        <!-- Search trigger -->
        <!-- <button
            class="hidden sm:flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
            @click="openSearch"
        >
            <Search class="h-3.5 w-3.5" />
            <span>Search…</span>
            <kbd class="ml-6 flex items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
                <span class="text-xs">⌘</span>K
            </kbd>
        </button> -->

        <!-- <CommandSearch ref="searchRef" /> -->
    </header>
</template>
