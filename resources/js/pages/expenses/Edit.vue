<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { Wallet } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import * as ExpenseController from '@/actions/App/Http/Controllers/Admin/ExpenseController';
import type { Expense } from '@/types/models';

const props = defineProps<{
    expense:    Expense;
    categories: Record<string, string>;
    shifts: { id: number; cashier_id: number; opened_at: string; cashier?: { id: number; name: string } }[];
}>();

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });

const form = useForm({
    category:     props.expense.category,
    description:  props.expense.description,
    amount:       (props.expense.amount / 100).toFixed(2),
    expense_date: props.expense.expense_date,
    reference:    props.expense.reference ?? '',
    shift_id:     props.expense.shift_id?.toString() ?? '',
    notes:        props.expense.notes ?? '',
});

function submit() {
    form.put(ExpenseController.update.url({ expense: props.expense.id }));
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Expenses', href: ExpenseController.index.url() },
        { title: 'Edit Expense', href: ExpenseController.edit.url({ expense: expense.id }) },
    ]">
        <div class="mx-auto max-w-xl p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                    <Wallet class="h-5 w-5" />
                </div>
                <h1 class="text-2xl font-bold">Edit Expense</h1>
            </div>

            <form class="rounded-xl border p-6 space-y-5" @submit.prevent="submit">

                <!-- Category -->
                <div class="space-y-1.5">
                    <label class="text-sm font-medium">Category <span class="text-destructive">*</span></label>
                    <select
                        v-model="form.category"
                        class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        :class="form.errors.category ? 'border-destructive' : ''"
                    >
                        <option value="">Select category…</option>
                        <option v-for="(label, key) in categories" :key="key" :value="key">{{ label }}</option>
                    </select>
                    <p v-if="form.errors.category" class="text-xs text-destructive">{{ form.errors.category }}</p>
                </div>

                <!-- Description -->
                <div class="space-y-1.5">
                    <label class="text-sm font-medium">Description <span class="text-destructive">*</span></label>
                    <input
                        v-model="form.description"
                        type="text"
                        class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        :class="form.errors.description ? 'border-destructive' : ''"
                    />
                    <p v-if="form.errors.description" class="text-xs text-destructive">{{ form.errors.description }}</p>
                </div>

                <!-- Amount + Date -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">Amount (₱) <span class="text-destructive">*</span></label>
                        <input
                            v-model="form.amount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            :class="form.errors.amount ? 'border-destructive' : ''"
                        />
                        <p v-if="form.errors.amount" class="text-xs text-destructive">{{ form.errors.amount }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">Date <span class="text-destructive">*</span></label>
                        <input
                            v-model="form.expense_date"
                            type="date"
                            class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                            :class="form.errors.expense_date ? 'border-destructive' : ''"
                        />
                        <p v-if="form.errors.expense_date" class="text-xs text-destructive">{{ form.errors.expense_date }}</p>
                    </div>
                </div>

                <!-- Reference -->
                <div class="space-y-1.5">
                    <label class="text-sm font-medium">Reference / Receipt #</label>
                    <input
                        v-model="form.reference"
                        type="text"
                        class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>

                <!-- Shift (optional) -->
                <div class="space-y-1.5">
                    <label class="text-sm font-medium">Linked Shift <span class="text-muted-foreground font-normal">(optional)</span></label>
                    <select
                        v-model="form.shift_id"
                        class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                    >
                        <option value="">None</option>
                        <option v-for="s in shifts" :key="s.id" :value="s.id.toString()">
                            Shift #{{ s.id }} — {{ s.cashier?.name }} ({{ dtf.format(new Date(s.opened_at)) }})
                        </option>
                    </select>
                </div>

                <!-- Notes -->
                <div class="space-y-1.5">
                    <label class="text-sm font-medium">Notes</label>
                    <textarea
                        v-model="form.notes"
                        rows="3"
                        class="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    />
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Saving…' : 'Update Expense' }}
                    </Button>
                    <Button type="button" variant="outline" as-child>
                        <a :href="ExpenseController.index.url()">Cancel</a>
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
