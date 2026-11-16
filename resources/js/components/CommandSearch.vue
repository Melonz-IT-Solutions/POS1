<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { Building2, Loader2, Package, Search, Users } from '@lucide/vue';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import * as SearchController from '@/actions/App/Http/Controllers/Admin/SearchController';

interface ResultItem {
    id: number;
    label: string;
    sub: string | null;
    url: string;
}

interface SearchResults {
    products: ResultItem[];
    customers: ResultItem[];
    suppliers: ResultItem[];
}

const open  = ref(false);
const query = ref('');
const loading   = ref(false);
const results   = ref<SearchResults>({ products: [], customers: [], suppliers: [] });
const activeIdx = ref(-1);
const inputRef  = ref<HTMLInputElement | null>(null);

// ── Flatten results for keyboard navigation ───────────────────────────────
const flat = computed((): { group: string; item: ResultItem }[] => [
    ...results.value.products.map(item  => ({ group: 'Products',  item })),
    ...results.value.customers.map(item => ({ group: 'Customers', item })),
    ...results.value.suppliers.map(item => ({ group: 'Suppliers', item })),
]);

const hasResults = computed(() => flat.value.length > 0);
const showEmpty  = computed(() => !loading.value && query.value.length >= 2 && !hasResults.value);

// ── Search ─────────────────────────────────────────────────────────────────
let debounceTimer: ReturnType<typeof setTimeout>;

watch(query, (val) => {
    activeIdx.value = -1;
    clearTimeout(debounceTimer);

    if (val.length < 2) {
        results.value = { products: [], customers: [], suppliers: [] };
        loading.value = false;
        return;
    }

    loading.value = true;
    debounceTimer = setTimeout(async () => {
        try {
            const res = await fetch(
                SearchController.__invoke.url() + '?q=' + encodeURIComponent(val),
                { headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } },
            );
            if (res.ok) {
                results.value = await res.json();
            }
        } finally {
            loading.value = false;
        }
    }, 220);
});

watch(open, (val) => {
    if (val) {
        query.value   = '';
        results.value = { products: [], customers: [], suppliers: [] };
        activeIdx.value = -1;
        nextTick(() => inputRef.value?.focus());
    }
});

// ── Keyboard shortcut ─────────────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open.value = !open.value;
        return;
    }

    if (!open.value) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx.value = Math.min(activeIdx.value + 1, flat.value.length - 1);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx.value = Math.max(activeIdx.value - 1, -1);
    } else if (e.key === 'Enter' && activeIdx.value >= 0) {
        e.preventDefault();
        navigate(flat.value[activeIdx.value].item.url);
    }
}

onMounted(()  => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));

function navigate(url: string) {
    open.value = false;
    window.location.href = url;
}

// ── Group display ─────────────────────────────────────────────────────────
const groups = computed(() => {
    const list: { label: string; icon: typeof Package; items: ResultItem[] }[] = [];
    if (results.value.products.length)  list.push({ label: 'Products',  icon: Package,  items: results.value.products });
    if (results.value.customers.length) list.push({ label: 'Customers', icon: Users,    items: results.value.customers });
    if (results.value.suppliers.length) list.push({ label: 'Suppliers', icon: Building2, items: results.value.suppliers });
    return list;
});

function globalIdx(group: string, localIdx: number): number {
    let offset = 0;
    if (group === 'Customers') offset = results.value.products.length;
    if (group === 'Suppliers') offset = results.value.products.length + results.value.customers.length;
    return offset + localIdx;
}

// Expose open for the trigger button in the header
defineExpose({ open });
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="p-0 gap-0 max-w-lg overflow-hidden" :hide-close="true">
            <!-- Search input -->
            <div class="flex items-center gap-3 border-b px-4 py-3">
                <Search v-if="!loading" class="h-4 w-4 text-muted-foreground shrink-0" />
                <Loader2 v-else class="h-4 w-4 text-muted-foreground shrink-0 animate-spin" />
                <input
                    ref="inputRef"
                    v-model="query"
                    type="text"
                    placeholder="Search products, customers, suppliers…"
                    class="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    autocomplete="off"
                />
                <kbd class="hidden sm:inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                    ESC
                </kbd>
            </div>

            <!-- Results -->
            <div class="max-h-96 overflow-y-auto">
                <template v-if="hasResults">
                    <div v-for="group in groups" :key="group.label">
                        <!-- Group label -->
                        <div class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/40">
                            <component :is="group.icon" class="h-3.5 w-3.5" />
                            {{ group.label }}
                        </div>
                        <!-- Items -->
                        <button
                            v-for="(item, i) in group.items"
                            :key="item.id"
                            class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                            :class="globalIdx(group.label, i) === activeIdx
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-muted/60'"
                            @click="navigate(item.url)"
                            @mouseenter="activeIdx = globalIdx(group.label, i)"
                        >
                            <component :is="group.icon" class="h-4 w-4 text-muted-foreground shrink-0" />
                            <span class="font-medium truncate">{{ item.label }}</span>
                            <span v-if="item.sub" class="text-muted-foreground text-xs ml-auto shrink-0 font-mono">{{ item.sub }}</span>
                        </button>
                    </div>
                </template>

                <!-- Empty hint (< 2 chars) -->
                <div v-else-if="query.length < 2 && !loading" class="px-4 py-10 text-center text-sm text-muted-foreground">
                    Type at least 2 characters to search…
                </div>

                <!-- No results -->
                <div v-else-if="showEmpty" class="px-4 py-10 text-center text-sm text-muted-foreground">
                    No results for <strong>{{ query }}</strong>
                </div>
            </div>

            <!-- Footer hint -->
            <div class="border-t px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span class="flex items-center gap-1"><kbd class="rounded border bg-muted px-1 font-mono">↑↓</kbd> navigate</span>
                <span class="flex items-center gap-1"><kbd class="rounded border bg-muted px-1 font-mono">↵</kbd> open</span>
                <span class="flex items-center gap-1"><kbd class="rounded border bg-muted px-1 font-mono">ESC</kbd> close</span>
            </div>
        </DialogContent>
    </Dialog>
</template>
