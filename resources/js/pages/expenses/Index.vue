<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Pencil, Plus, Trash2, Wallet } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import * as ExpenseController from '@/actions/App/Http/Controllers/Admin/ExpenseController';
import type { Expense, PaginatedResponse } from '@/types/models';

const props = defineProps<{
    expenses:       PaginatedResponse<Expense>;
    categories:     Record<string, string>;
    filters:        { category?: string; date_from?: string; date_to?: string; search?: string };
    totalFiltered:  number;
    thisMonthTotal: number;
    thisYearTotal:  number;
    byCategory:     Record<string, number>;
}>();

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

const df = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function fmt(s: string): string { return df.format(new Date(s + 'T00:00:00')); }

// ── Filters ──────────────────────────────────────────────────────────────
let searchTimer: ReturnType<typeof setTimeout>;
function onSearch(e: Event) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        applyFilter('search', (e.target as HTMLInputElement).value);
    }, 300);
}

function applyFilter(key: string, value: string) {
    router.get(ExpenseController.index.url(), { ...props.filters, [key]: value || undefined }, {
        preserveState: true,
        replace: true,
    });
}

function clearFilters() {
    router.get(ExpenseController.index.url(), {}, { preserveState: true, replace: true });
}

// ── Delete ────────────────────────────────────────────────────────────────
function deleteExpense(id: number) {
    if (!confirm('Delete this expense?')) return;
    router.delete(ExpenseController.destroy.url({ expense: id }), { preserveScroll: true });
}

// ── CSV Export ────────────────────────────────────────────────────────────
function exportCsv() {
    const rows = [
        ['Date', 'Category', 'Description', 'Reference', 'Amount', 'Recorded By'],
        ...props.expenses.data.map(e => [
            e.expense_date,
            props.categories[e.category] ?? e.category,
            e.description,
            e.reference ?? '',
            (e.amount / 100).toFixed(2),
            e.recorder?.name ?? '',
        ]),
    ];
    const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// ── Category bar widths ───────────────────────────────────────────────────
const maxCatAmount = Math.max(...Object.values(props.byCategory), 1);
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Expenses', href: ExpenseController.index.url() }]">
        <div class="max-w-6xl p-6 space-y-6">

            <!-- Header -->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                        <Wallet class="h-5 w-5" />
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">Expenses</h1>
                        <p class="text-muted-foreground text-sm">Track business expenditures</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" size="sm" @click="exportCsv">Export CSV</Button>
                    <Button size="sm" as-child>
                        <a :href="ExpenseController.create.url()">
                            <Plus class="mr-2 h-4 w-4" />
                            Add Expense
                        </a>
                    </Button>
                </div>
            </div>

            <!-- Summary cards -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">This Month</p>
                    <p class="text-xl font-bold tabular-nums text-red-600">{{ peso(thisMonthTotal) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">This Year</p>
                    <p class="text-xl font-bold tabular-nums">{{ peso(thisYearTotal) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1 col-span-2 sm:col-span-1">
                    <p class="text-muted-foreground text-xs">Filtered Total</p>
                    <p class="text-xl font-bold tabular-nums">{{ peso(totalFiltered) }}</p>
                </div>
            </div>

            <!-- This-month by category -->
            <div v-if="Object.keys(byCategory).length" class="rounded-xl border p-4">
                <p class="text-sm font-semibold mb-3">This Month by Category</p>
                <div class="space-y-2">
                    <div
                        v-for="(amount, cat) in byCategory"
                        :key="cat"
                        class="flex items-center gap-3 text-sm"
                    >
                        <span class="w-44 truncate text-muted-foreground">{{ categories[cat] ?? cat }}</span>
                        <div class="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                                class="h-full bg-primary/60 rounded-full"
                                :style="{ width: `${(amount / maxCatAmount * 100).toFixed(1)}%` }"
                            />
                        </div>
                        <span class="w-28 text-right tabular-nums font-medium">{{ peso(amount) }}</span>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-3 items-end">
                <input
                    type="text"
                    placeholder="Search description or ref…"
                    :value="filters.search ?? ''"
                    class="rounded-lg border bg-background px-3 py-2 text-sm w-64 outline-none focus:ring-2 focus:ring-primary/30"
                    @input="onSearch"
                />
                <select
                    class="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    :value="filters.category ?? ''"
                    @change="applyFilter('category', ($event.target as HTMLSelectElement).value)"
                >
                    <option value="">All categories</option>
                    <option v-for="(label, key) in categories" :key="key" :value="key">{{ label }}</option>
                </select>
                <input
                    type="date"
                    :value="filters.date_from ?? ''"
                    class="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    @change="applyFilter('date_from', ($event.target as HTMLInputElement).value)"
                />
                <input
                    type="date"
                    :value="filters.date_to ?? ''"
                    class="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    @change="applyFilter('date_to', ($event.target as HTMLInputElement).value)"
                />
                <button
                    v-if="filters.category || filters.date_from || filters.date_to || filters.search"
                    class="text-sm text-muted-foreground hover:text-foreground"
                    @click="clearFilters"
                >Clear</button>
            </div>

            <!-- Table -->
            <div class="rounded-xl border overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2.5 font-medium">Date</th>
                            <th class="px-4 py-2.5 font-medium">Category</th>
                            <th class="px-4 py-2.5 font-medium">Description</th>
                            <th class="px-4 py-2.5 font-medium">Reference</th>
                            <th class="px-4 py-2.5 font-medium">By</th>
                            <th class="px-4 py-2.5 font-medium text-right">Amount</th>
                            <th class="px-4 py-2.5" />
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-if="expenses.data.length === 0">
                            <td colspan="7" class="px-4 py-10 text-center text-muted-foreground">No expenses found.</td>
                        </tr>
                        <tr
                            v-for="exp in expenses.data"
                            :key="exp.id"
                            class="hover:bg-muted/20"
                        >
                            <td class="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                                {{ fmt(exp.expense_date) }}
                            </td>
                            <td class="px-4 py-2.5">
                                <span class="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                                    {{ categories[exp.category] ?? exp.category }}
                                </span>
                            </td>
                            <td class="px-4 py-2.5 font-medium max-w-xs truncate">{{ exp.description }}</td>
                            <td class="px-4 py-2.5 font-mono text-xs text-muted-foreground">{{ exp.reference ?? '—' }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ exp.recorder?.name ?? '—' }}</td>
                            <td class="px-4 py-2.5 text-right tabular-nums font-semibold text-red-600">
                                {{ peso(exp.amount) }}
                            </td>
                            <td class="px-4 py-2.5">
                                <div class="flex items-center justify-end gap-1">
                                    <a
                                        :href="ExpenseController.edit.url({ expense: exp.id })"
                                        class="rounded p-1.5 hover:bg-muted transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil class="h-3.5 w-3.5 text-muted-foreground" />
                                    </a>
                                    <button
                                        class="rounded p-1.5 hover:bg-destructive/10 transition-colors"
                                        title="Delete"
                                        @click="deleteExpense(exp.id)"
                                    >
                                        <Trash2 class="h-3.5 w-3.5 text-destructive" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination -->
                <div v-if="expenses.last_page > 1" class="border-t px-4 py-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{{ expenses.from }}–{{ expenses.to }} of {{ expenses.total }}</span>
                    <div class="flex gap-1">
                        <a
                            v-for="link in expenses.links"
                            :key="link.label"
                            :href="link.url ?? '#'"
                            class="rounded px-2 py-1 text-xs"
                            :class="link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                            v-html="link.label"
                        />
                    </div>
                </div>
            </div>

        </div>
    </AppLayout>
</template>
