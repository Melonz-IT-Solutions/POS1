<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import {
    MapPin, Mail, MessageSquare, Pencil, Phone, ReceiptText, Star,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useCurrency } from '@/composables/useCurrency';
import * as CustomerController from '@/actions/App/Http/Controllers/Admin/CustomerController';
import type { Customer, Sale } from '@/types/models';

interface Stats {
    total_sales: number;
    total_spent: number;
    loyalty_points: number;
    discount_rate: number;
}

interface PaginatedSales {
    data: (Sale & { cashier?: { id: number; name: string } })[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

const props = defineProps<{
    customer: Customer;
    sales: PaginatedSales;
    stats: Stats;
}>();

const { format } = useCurrency();

const pointsOpen = ref(false);
const pointsForm = useForm({
    points: 0,
    description: '',
});

function submitPoints() {
    pointsForm.post(CustomerController.adjustPoints.url({ customer: props.customer.id }), {
        preserveScroll: true,
        onSuccess: () => { pointsOpen.value = false; },
    });
}

function saleStatusClass(status: string) {
    return {
        completed: 'bg-green-100 text-green-800',
        held: 'bg-yellow-100 text-yellow-800',
        void: 'bg-gray-100 text-gray-700',
        refunded: 'bg-blue-100 text-blue-800',
        partially_refunded: 'bg-orange-100 text-orange-800',
    }[status] ?? 'bg-gray-100 text-gray-700';
}

function formatDate(dt: string) {
    return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dt));
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Customers', href: CustomerController.index.url() },
        { title: customer.name, href: CustomerController.show.url({ customer: customer.id }) },
    ]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
                        {{ customer.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase() }}
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">{{ customer.name }}</h1>
                        <div class="flex flex-wrap items-center gap-3 mt-1">
                            <span v-if="customer.phone" class="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone class="h-3.5 w-3.5" />{{ customer.phone }}
                            </span>
                            <span v-if="customer.email" class="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail class="h-3.5 w-3.5" />{{ customer.email }}
                            </span>
                            <span v-if="customer.address" class="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin class="h-3.5 w-3.5" />{{ customer.address }}
                            </span>
                        </div>
                        <div v-if="customer.notes" class="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MessageSquare class="h-3.5 w-3.5" />{{ customer.notes }}
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <Button variant="outline" @click="pointsOpen = true">
                        <Star class="mr-2 h-4 w-4" />
                        Adjust Points
                    </Button>
                    <Button as-child>
                        <a :href="CustomerController.edit.url({ customer: customer.id })">
                            <Pencil class="mr-2 h-4 w-4" />
                            Edit
                        </a>
                    </Button>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-4 gap-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm">Total Purchases</p>
                    <p class="text-2xl font-bold">{{ stats.total_sales }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm">Total Spent</p>
                    <p class="text-2xl font-bold">{{ format(stats.total_spent) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-sm">Customer Discount</p>
                    <p class="text-2xl font-bold text-green-600">
                        {{ stats.discount_rate > 0 ? (stats.discount_rate / 100).toFixed(0) + '%' : 'None' }}
                    </p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <div class="flex items-center gap-1 text-muted-foreground text-sm">
                        <Star class="h-3.5 w-3.5 text-amber-500" />
                        Loyalty Points
                    </div>
                    <p class="text-2xl font-bold text-amber-600">{{ customer.loyalty_points.toLocaleString() }}</p>
                </div>
            </div>

            <!-- Purchase History -->
            <div class="space-y-3">
                <div class="flex items-center gap-2">
                    <ReceiptText class="h-5 w-5 text-muted-foreground" />
                    <h2 class="font-semibold text-lg">Purchase History</h2>
                </div>

                <div class="rounded-xl border">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b text-left">
                                <th class="px-4 py-3 font-medium">Receipt</th>
                                <th class="px-4 py-3 font-medium">Date</th>
                                <th class="px-4 py-3 font-medium">Status</th>
                                <th class="px-4 py-3 font-medium text-right">Total</th>
                                <th class="px-4 py-3 font-medium">Cashier</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="sale in sales.data"
                                :key="sale.id"
                                class="border-b transition-colors hover:bg-muted/50"
                            >
                                <td class="px-4 py-3 font-mono text-sm">{{ sale.receipt_number }}</td>
                                <td class="px-4 py-3 text-muted-foreground whitespace-nowrap">{{ formatDate(sale.created_at) }}</td>
                                <td class="px-4 py-3">
                                    <Badge class="text-xs" :class="saleStatusClass(sale.status?.toString() ?? '')">
                                        {{ sale.status }}
                                    </Badge>
                                </td>
                                <td class="px-4 py-3 text-right font-semibold">{{ format(sale.total_amount) }}</td>
                                <td class="px-4 py-3 text-muted-foreground">{{ sale.cashier?.name ?? '—' }}</td>
                            </tr>
                            <tr v-if="!sales.data.length">
                                <td colspan="5" class="text-muted-foreground px-4 py-10 text-center">No purchases yet.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <AppPagination :meta="sales" />
            </div>
        </div>

        <!-- Adjust Loyalty Points Modal -->
        <Dialog v-model:open="pointsOpen">
            <DialogContent class="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Adjust Loyalty Points</DialogTitle>
                </DialogHeader>
                <div class="space-y-4 py-2">
                    <p class="text-sm">
                        Current balance: <strong class="text-amber-600">{{ customer.loyalty_points.toLocaleString() }} pts</strong>
                    </p>
                    <div class="space-y-1.5">
                        <Label for="pts">Points (use negative to deduct)</Label>
                        <Input id="pts" v-model.number="pointsForm.points" type="number" autofocus />
                        <p v-if="pointsForm.errors.points" class="text-destructive text-xs">{{ pointsForm.errors.points }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label for="pts-desc">Reason <span class="text-destructive">*</span></Label>
                        <Input id="pts-desc" v-model="pointsForm.description" placeholder="e.g. Manual correction" />
                        <p v-if="pointsForm.errors.description" class="text-destructive text-xs">{{ pointsForm.errors.description }}</p>
                    </div>
                    <p v-if="pointsForm.points !== 0" class="text-sm font-medium">
                        New balance:
                        <span :class="customer.loyalty_points + pointsForm.points >= 0 ? 'text-amber-600' : 'text-destructive'">
                            {{ (customer.loyalty_points + pointsForm.points).toLocaleString() }} pts
                        </span>
                    </p>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="pointsOpen = false">Cancel</Button>
                    <Button @click="submitPoints" :disabled="pointsForm.processing">
                        {{ pointsForm.processing ? 'Saving…' : 'Apply' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
