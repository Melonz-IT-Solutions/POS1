<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as GiftCardController from '@/actions/App/Http/Controllers/Admin/GiftCardController';
import type { Customer } from '@/types/models';

const props = defineProps<{
    customers:    Pick<Customer, 'id' | 'name' | 'phone'>[];
    suggestedCode: string;
}>();

const form = useForm({
    code:        props.suggestedCode,
    value:       '',
    issued_to:   '',
    customer_id: '',
    expires_at:  '',
    notes:       '',
});

function submit() {
    form.post(GiftCardController.store.url());
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Gift Cards', href: GiftCardController.index.url() },
        { title: 'Issue Gift Card' },
    ]">
        <div class="p-6 max-w-xl space-y-6">
            <div>
                <h1 class="text-2xl font-bold">Issue Gift Card</h1>
                <p class="text-muted-foreground text-sm">Create a new store gift card</p>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Code & Value -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Card Details</h2>

                    <div class="space-y-1.5">
                        <Label for="code">Card Code <span class="text-destructive">*</span></Label>
                        <Input id="code" v-model="form.code" class="font-mono tracking-widest uppercase" placeholder="XXXX-XXXX-XXXX" />
                        <InputError :message="form.errors.code" />
                        <p class="text-xs text-muted-foreground">Code is case-insensitive. Generated code shown above.</p>
                    </div>

                    <div class="space-y-1.5">
                        <Label for="value">Value (₱) <span class="text-destructive">*</span></Label>
                        <Input id="value" v-model="form.value" type="number" min="1" step="0.01" placeholder="500.00" />
                        <InputError :message="form.errors.value" />
                    </div>
                </div>

                <!-- Recipient -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Recipient (Optional)</h2>

                    <div class="space-y-1.5">
                        <Label for="issued_to">Recipient Name</Label>
                        <Input id="issued_to" v-model="form.issued_to" placeholder="e.g. Juan dela Cruz" />
                        <InputError :message="form.errors.issued_to" />
                    </div>

                    <div class="space-y-1.5">
                        <Label>Link to Customer Account</Label>
                        <select v-model="form.customer_id" class="border rounded-md px-3 py-2 text-sm bg-background w-full">
                            <option value="">None</option>
                            <option v-for="c in customers" :key="c.id" :value="String(c.id)">
                                {{ c.name }}{{ c.phone ? ` — ${c.phone}` : '' }}
                            </option>
                        </select>
                        <InputError :message="form.errors.customer_id" />
                    </div>
                </div>

                <!-- Expiry & Notes -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Expiry & Notes</h2>

                    <div class="space-y-1.5">
                        <Label for="expires_at">Expiry Date (leave blank for no expiry)</Label>
                        <Input id="expires_at" v-model="form.expires_at" type="date" />
                        <InputError :message="form.errors.expires_at" />
                    </div>

                    <div class="space-y-1.5">
                        <Label>Notes</Label>
                        <textarea
                            v-model="form.notes"
                            rows="2"
                            class="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            placeholder="Optional notes"
                        />
                    </div>
                </div>

                <div class="flex gap-3">
                    <Button type="submit" :disabled="form.processing">Issue Gift Card</Button>
                    <Button variant="outline" as-child>
                        <a :href="GiftCardController.index.url()">Cancel</a>
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
