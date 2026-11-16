<script setup lang="ts">
import { computed } from 'vue';
import {
    Activity,
    CheckCircle2,
    Clock,
    KeyRound,
    Pencil,
    Receipt,
    ShieldCheck,
    TrendingUp,
    UserRound,
    XCircle,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/composables/useCurrency';
import * as UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import * as SaleController from '@/actions/App/Http/Controllers/Pos/SaleController';
import type { Role, User } from '@/types/models';

interface UserDetail extends User {
    roles: Role[];
    deleted_at: string | null;
    last_login_at: string | null;
    email_verified_at: string | null;
    two_factor_confirmed_at: string | null;
}

interface RecentSale {
    id: number;
    receipt_number: string;
    total_amount: number;
    status: string;
    created_at: string;
    customer?: { id: number; name: string } | null;
}

interface RecentActivity {
    id: number;
    action: string;
    auditable_type: string | null;
    created_at: string;
}

const props = defineProps<{
    user: UserDetail;
    permissions: string[];
    stats: {
        total_sales: number;
        total_revenue: number;
        total_shifts: number;
        void_count: number;
    };
    recentSales: RecentSale[];
    recentActivity: RecentActivity[];
    canEdit: boolean;
}>();

const { format } = useCurrency();

function initials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

const roleColors: Record<string, string> = {
    Administrator: 'bg-purple-100 text-purple-800',
    Manager:       'bg-blue-100 text-blue-800',
    Cashier:       'bg-green-100 text-green-800',
};

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function fmt(s: string | null) { return s ? dtf.format(new Date(s)) : '—'; }

const dtfDate = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });
function fmtDate(s: string | null) { return s ? dtfDate.format(new Date(s)) : 'Never'; }

function actionLabel(action: string): string {
    return action.split('.').map(p => p.replace(/_/g, ' ')).join(' › ');
}

function modelLabel(type: string | null): string {
    if (!type) return '';
    return type.split('\\').pop() ?? type;
}

// Group permissions by resource prefix
const groupedPermissions = computed(() => {
    const groups: Record<string, string[]> = {};
    for (const perm of props.permissions) {
        const parts = perm.split(' ');
        const resource = parts.slice(1).join(' ') || 'general';
        if (!groups[resource]) groups[resource] = [];
        groups[resource].push(perm);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
});

const saleStatusConfig: Record<string, { label: string; cls: string }> = {
    completed:          { label: 'Completed',   cls: 'bg-green-100 text-green-800' },
    void:               { label: 'Void',         cls: 'bg-red-100 text-red-700' },
    partially_refunded: { label: 'Part. Refund', cls: 'bg-amber-100 text-amber-800' },
    refunded:           { label: 'Refunded',     cls: 'bg-orange-100 text-orange-800' },
};
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Users', href: UserController.index.url() },
        { title: user.name, href: UserController.show.url({ user: user.id }) },
    ]">
        <div class="p-6 space-y-6 max-w-5xl">
            <!-- Header -->
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="flex items-start gap-4">
                    <div class="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold">
                        {{ initials(user.name) }}
                    </div>
                    <div>
                        <div class="flex items-center gap-3 flex-wrap">
                            <h1 class="text-2xl font-bold">{{ user.name }}</h1>
                            <Badge v-if="user.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                            <Badge
                                v-else-if="user.status === 'active'"
                                class="text-xs bg-green-100 text-green-800"
                            >Active</Badge>
                            <Badge v-else variant="outline" class="text-xs">Inactive</Badge>
                        </div>
                        <p class="text-muted-foreground text-sm mt-0.5">{{ user.email }}</p>
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            <Badge
                                v-for="role in user.roles"
                                :key="role.id"
                                class="text-xs"
                                :class="roleColors[role.name] ?? 'bg-gray-100 text-gray-800'"
                            >
                                <ShieldCheck class="mr-1 h-3 w-3" />
                                {{ role.name }}
                            </Badge>
                        </div>
                    </div>
                </div>
                <Button v-if="canEdit && !user.deleted_at" as-child>
                    <a :href="UserController.edit.url({ user: user.id })">
                        <Pencil class="mr-2 h-4 w-4" />Edit User
                    </a>
                </Button>
            </div>

            <!-- Stat cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <Receipt class="h-3 w-3" />Sales Completed
                    </p>
                    <p class="text-2xl font-bold">{{ stats.total_sales.toLocaleString() }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <TrendingUp class="h-3 w-3" />Total Revenue
                    </p>
                    <p class="text-2xl font-bold">{{ format(stats.total_revenue) }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock class="h-3 w-3" />Shifts Worked
                    </p>
                    <p class="text-2xl font-bold">{{ stats.total_shifts.toLocaleString() }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs flex items-center gap-1">
                        <XCircle class="h-3 w-3" />Voided Sales
                    </p>
                    <p class="text-2xl font-bold" :class="stats.void_count > 0 ? 'text-destructive' : ''">
                        {{ stats.void_count.toLocaleString() }}
                    </p>
                </div>
            </div>

            <!-- Account info + permissions -->
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Account details -->
                <div class="rounded-xl border p-5 space-y-3">
                    <h2 class="font-semibold flex items-center gap-2">
                        <UserRound class="h-4 w-4 text-muted-foreground" />Account Details
                    </h2>
                    <dl class="space-y-2 text-sm">
                        <div class="flex justify-between gap-4">
                            <dt class="text-muted-foreground">Last login</dt>
                            <dd class="font-medium text-right">{{ fmtDate(user.last_login_at) }}</dd>
                        </div>
                        <div class="flex justify-between gap-4">
                            <dt class="text-muted-foreground">Email verified</dt>
                            <dd class="font-medium flex items-center gap-1">
                                <CheckCircle2 v-if="user.email_verified_at" class="h-3.5 w-3.5 text-green-600" />
                                <XCircle v-else class="h-3.5 w-3.5 text-muted-foreground" />
                                {{ user.email_verified_at ? fmtDate(user.email_verified_at) : 'Not verified' }}
                            </dd>
                        </div>
                        <div class="flex justify-between gap-4">
                            <dt class="text-muted-foreground">2FA</dt>
                            <dd class="font-medium flex items-center gap-1">
                                <CheckCircle2 v-if="user.two_factor_confirmed_at" class="h-3.5 w-3.5 text-green-600" />
                                <XCircle v-else class="h-3.5 w-3.5 text-muted-foreground" />
                                {{ user.two_factor_confirmed_at ? 'Enabled' : 'Disabled' }}
                            </dd>
                        </div>
                    </dl>
                </div>

                <!-- Permissions -->
                <div class="rounded-xl border p-5 space-y-3">
                    <h2 class="font-semibold flex items-center gap-2">
                        <KeyRound class="h-4 w-4 text-muted-foreground" />Permissions
                        <span class="text-muted-foreground text-xs font-normal">({{ permissions.length }} total)</span>
                    </h2>
                    <div v-if="permissions.length" class="space-y-2 max-h-52 overflow-y-auto pr-1">
                        <div v-for="[resource, perms] in groupedPermissions" :key="resource">
                            <p class="text-xs text-muted-foreground capitalize font-medium mb-1">{{ resource }}</p>
                            <div class="flex flex-wrap gap-1">
                                <Badge
                                    v-for="perm in perms"
                                    :key="perm"
                                    variant="secondary"
                                    class="text-xs font-normal"
                                >{{ perm.split(' ')[0] }}</Badge>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-muted-foreground text-sm">No permissions assigned.</p>
                </div>
            </div>

            <!-- Recent sales -->
            <div v-if="recentSales.length" class="space-y-3">
                <h2 class="font-semibold flex items-center gap-2">
                    <Receipt class="h-4 w-4 text-muted-foreground" />Recent Sales
                </h2>
                <div class="rounded-xl border overflow-hidden">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-4 py-2.5 font-medium">Receipt</th>
                                <th class="px-4 py-2.5 font-medium">Customer</th>
                                <th class="px-4 py-2.5 font-medium text-right">Amount</th>
                                <th class="px-4 py-2.5 font-medium">Status</th>
                                <th class="px-4 py-2.5 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="sale in recentSales" :key="sale.id" class="hover:bg-muted/20">
                                <td class="px-4 py-2.5">
                                    <a
                                        :href="SaleController.show.url({ sale: sale.id })"
                                        class="font-mono text-xs text-primary hover:underline"
                                    >{{ sale.receipt_number }}</a>
                                </td>
                                <td class="px-4 py-2.5 text-muted-foreground">
                                    {{ sale.customer?.name ?? 'Walk-in' }}
                                </td>
                                <td class="px-4 py-2.5 text-right font-semibold tabular-nums">
                                    {{ format(sale.total_amount) }}
                                </td>
                                <td class="px-4 py-2.5">
                                    <Badge
                                        :class="(saleStatusConfig[sale.status] ?? saleStatusConfig.completed).cls"
                                        class="text-xs"
                                    >
                                        {{ (saleStatusConfig[sale.status] ?? saleStatusConfig.completed).label }}
                                    </Badge>
                                </td>
                                <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ fmt(sale.created_at) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent activity -->
            <div v-if="recentActivity.length" class="space-y-3">
                <h2 class="font-semibold flex items-center gap-2">
                    <Activity class="h-4 w-4 text-muted-foreground" />Recent Activity
                </h2>
                <div class="rounded-xl border overflow-hidden">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b bg-muted/30 text-left">
                                <th class="px-4 py-2.5 font-medium">Action</th>
                                <th class="px-4 py-2.5 font-medium">Model</th>
                                <th class="px-4 py-2.5 font-medium">When</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            <tr v-for="log in recentActivity" :key="log.id" class="hover:bg-muted/20">
                                <td class="px-4 py-2.5 font-medium capitalize">{{ actionLabel(log.action) }}</td>
                                <td class="px-4 py-2.5 text-muted-foreground">{{ modelLabel(log.auditable_type) }}</td>
                                <td class="px-4 py-2.5 text-muted-foreground text-xs">{{ fmt(log.created_at) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
