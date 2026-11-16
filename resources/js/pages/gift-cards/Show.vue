<script setup lang="ts">
import { ref } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as GiftCardController from '@/actions/App/Http/Controllers/Admin/GiftCardController';
import type { GiftCard } from '@/types/models';

const props = defineProps<{
    giftCard: GiftCard;
}>();

const redeemForm = useForm({
    amount: '',
    notes:  '',
});

function submitRedeem() {
    redeemForm.post(GiftCardController.redeem.url(props.giftCard.id), {
        onSuccess: () => { redeemForm.reset(); },
    });
}

const showCancelConfirm = ref(false);
function cancelCard() {
    router.post(GiftCardController.cancel.url(props.giftCard.id));
}

function peso(c: number) {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function formatDate(s: string) {
    return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(s));
}

const statusClasses: Record<string, string> = {
    active:    'bg-green-100 text-green-700',
    depleted:  'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
    expired:   'bg-orange-100 text-orange-700',
};

const txTypeLabels: Record<string, string> = {
    issue:  'Issued',
    redeem: 'Redeemed',
    cancel: 'Cancelled',
    adjust: 'Adjusted',
};

const txTypeClasses: Record<string, string> = {
    issue:  'text-green-600',
    redeem: 'text-red-600',
    cancel: 'text-red-600',
    adjust: 'text-blue-600',
};
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Gift Cards', href: GiftCardController.index.url() },
        { title: giftCard.code },
    ]">
        <div class="p-6 max-w-4xl space-y-6">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <div class="flex items-center gap-3">
                        <h1 class="text-2xl font-bold font-mono tracking-widest">{{ giftCard.code }}</h1>
                        <span class="rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClasses[giftCard.status]">
                            {{ giftCard.status }}
                        </span>
                    </div>
                    <p class="text-muted-foreground text-sm mt-0.5">Issued {{ giftCard.created_at.slice(0, 10) }}</p>
                </div>
                <Button
                    v-if="giftCard.status === 'active'"
                    variant="destructive"
                    size="sm"
                    @click="showCancelConfirm = true"
                >Cancel Card</Button>
            </div>

            <!-- Balance overview -->
            <div class="grid grid-cols-3 gap-4">
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Initial Value</p>
                    <p class="text-2xl font-bold mt-1 font-mono">{{ peso(giftCard.initial_value) }}</p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Current Balance</p>
                    <p class="text-2xl font-bold mt-1 font-mono" :class="giftCard.current_balance > 0 ? 'text-green-600' : 'text-muted-foreground'">
                        {{ peso(giftCard.current_balance) }}
                    </p>
                </div>
                <div class="rounded-xl border p-4">
                    <p class="text-muted-foreground text-xs uppercase tracking-wide">Redeemed</p>
                    <p class="text-2xl font-bold mt-1 font-mono text-orange-600">
                        {{ peso(giftCard.initial_value - giftCard.current_balance) }}
                    </p>
                </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
                <!-- Card Info -->
                <div class="rounded-xl border p-5 space-y-2">
                    <h2 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Card Info</h2>
                    <div class="space-y-1 text-sm">
                        <div v-if="giftCard.issued_to" class="flex gap-2">
                            <span class="text-muted-foreground w-24 shrink-0">Issued To</span>
                            <span class="font-medium">{{ giftCard.issued_to }}</span>
                        </div>
                        <div v-if="giftCard.customer" class="flex gap-2">
                            <span class="text-muted-foreground w-24 shrink-0">Customer</span>
                            <span>{{ giftCard.customer.name }}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-muted-foreground w-24 shrink-0">Issued By</span>
                            <span>{{ giftCard.issuer?.name ?? '—' }}</span>
                        </div>
                        <div class="flex gap-2">
                            <span class="text-muted-foreground w-24 shrink-0">Expires</span>
                            <span :class="giftCard.expires_at && giftCard.expires_at < new Date().toISOString().slice(0,10) ? 'text-red-600 font-semibold' : ''">
                                {{ giftCard.expires_at ?? 'No expiry' }}
                            </span>
                        </div>
                        <div v-if="giftCard.notes" class="flex gap-2">
                            <span class="text-muted-foreground w-24 shrink-0">Notes</span>
                            <span>{{ giftCard.notes }}</span>
                        </div>
                    </div>
                </div>

                <!-- Redeem form -->
                <div v-if="giftCard.status === 'active'" class="rounded-xl border p-5 space-y-3">
                    <h2 class="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Redeem Manually</h2>
                    <form @submit.prevent="submitRedeem" class="space-y-3">
                        <div class="space-y-1.5">
                            <Label>Amount (₱) <span class="text-destructive">*</span></Label>
                            <Input v-model="redeemForm.amount" type="number" min="0.01" :max="giftCard.current_balance / 100" step="0.01" placeholder="0.00" />
                            <p class="text-xs text-muted-foreground">Max: {{ peso(giftCard.current_balance) }}</p>
                            <InputError :message="redeemForm.errors.amount" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>Notes</Label>
                            <Input v-model="redeemForm.notes" placeholder="Optional" />
                        </div>
                        <Button type="submit" :disabled="redeemForm.processing" class="w-full">
                            Redeem Amount
                        </Button>
                    </form>
                </div>
            </div>

            <!-- Transaction history -->
            <div class="rounded-xl border overflow-hidden">
                <div class="p-4 border-b font-semibold">Transaction History</div>
                <div v-if="!(giftCard.transactions?.length)" class="p-6 text-center text-muted-foreground text-sm">No transactions.</div>
                <table v-else class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr>
                            <th class="text-left px-4 py-2">Date</th>
                            <th class="text-left px-4 py-2">Type</th>
                            <th class="text-right px-4 py-2">Amount</th>
                            <th class="text-right px-4 py-2">Balance After</th>
                            <th class="text-left px-4 py-2">By</th>
                            <th class="text-left px-4 py-2">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="tx in giftCard.transactions ?? []" :key="tx.id" class="border-t">
                            <td class="px-4 py-2 text-xs text-muted-foreground">{{ formatDate(tx.created_at) }}</td>
                            <td class="px-4 py-2">
                                <span class="text-xs font-medium" :class="txTypeClasses[tx.type]">
                                    {{ txTypeLabels[tx.type] ?? tx.type }}
                                </span>
                            </td>
                            <td class="px-4 py-2 text-right font-mono text-xs" :class="tx.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                                {{ tx.amount >= 0 ? '+' : '' }}{{ peso(tx.amount) }}
                            </td>
                            <td class="px-4 py-2 text-right font-mono text-xs">{{ peso(tx.balance_after) }}</td>
                            <td class="px-4 py-2 text-xs">{{ tx.processor?.name ?? '—' }}</td>
                            <td class="px-4 py-2 text-xs text-muted-foreground">{{ tx.notes ?? '' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Cancel confirm -->
        <div v-if="showCancelConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div class="bg-background rounded-xl border p-6 max-w-sm w-full space-y-4">
                <h3 class="font-semibold text-lg">Cancel Gift Card?</h3>
                <p class="text-sm text-muted-foreground">This will zero out the balance of card <strong>{{ giftCard.code }}</strong> and mark it as cancelled.</p>
                <div class="flex gap-3">
                    <Button variant="destructive" @click="cancelCard">Yes, Cancel</Button>
                    <Button variant="outline" @click="showCancelConfirm = false">Keep</Button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
