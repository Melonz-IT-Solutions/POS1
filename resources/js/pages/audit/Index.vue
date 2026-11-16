<script setup lang="ts">
import { ref, watch } from 'vue';
import { router, Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as AuditLogController from '@/actions/App/Http/Controllers/Admin/AuditLogController';
import type { PaginatedResponse, AuditLog, User } from '@/types/models';

const props = defineProps<{
    logs: PaginatedResponse<AuditLog>;
    users: Pick<User, 'id' | 'name'>[];
    actions: string[];
    filters: { user_id?: string; action?: string; model?: string; date_from?: string; date_to?: string };
}>();

const userId   = ref(props.filters.user_id ?? 'all');
const action   = ref(props.filters.action ?? 'all');
const model    = ref(props.filters.model ?? '');
const dateFrom = ref(props.filters.date_from ?? '');
const dateTo   = ref(props.filters.date_to ?? '');

function applyFilters() {
    router.get(AuditLogController.index.url(), {
        user_id:   userId.value === 'all' ? undefined : userId.value,
        action:    action.value === 'all' ? undefined : action.value,
        model:     model.value || undefined,
        date_from: dateFrom.value || undefined,
        date_to:   dateTo.value || undefined,
    }, { preserveState: true, replace: true });
}

watch([userId, action, model, dateFrom, dateTo], applyFilters);

function resetFilters() {
    userId.value   = 'all';
    action.value   = 'all';
    model.value    = '';
    dateFrom.value = '';
    dateTo.value   = '';
}

// Readable model name from FQCN
function modelLabel(type: string | null): string {
    if (!type) return '—';
    return type.split('\\').pop() ?? type;
}

// Colour-coded action badge
function actionClass(a: string): string {
    if (a.includes('create'))        return 'bg-green-100 text-green-700';
    if (a.includes('delete'))        return 'bg-red-100 text-red-700';
    if (a.includes('restore'))       return 'bg-blue-100 text-blue-700';
    if (a.includes('update') || a.includes('password') || a.includes('pin')) return 'bg-amber-100 text-amber-700';
    if (a.includes('cancel') || a.includes('void')) return 'bg-red-100 text-red-700';
    return 'bg-muted text-muted-foreground';
}

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
function formatDt(s: string): string { return dtf.format(new Date(s)); }

// Distinct model types for the filter dropdown
const modelTypes = [...new Set(
    props.logs.data
        .map(l => l.auditable_type)
        .filter(Boolean)
        .map(t => t!.split('\\').pop()!)
)].sort();
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Audit Log', href: AuditLogController.index.url() }]">
        <div class="p-6 space-y-6">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Audit Log</h1>
                    <p class="text-muted-foreground text-sm">{{ logs.total.toLocaleString() }} entries</p>
                </div>
            </div>

            <!-- Filters -->
            <div class="rounded-xl border p-4">
                <div class="flex flex-wrap gap-3">
                    <Select v-model="userId">
                        <SelectTrigger class="w-44"><SelectValue placeholder="All users" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All users</SelectItem>
                            <SelectItem v-for="u in users" :key="u.id" :value="String(u.id)">{{ u.name }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select v-model="action">
                        <SelectTrigger class="w-48"><SelectValue placeholder="All actions" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All actions</SelectItem>
                            <SelectItem v-for="a in actions" :key="a" :value="a">{{ a }}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input v-model="model" placeholder="Model type..." class="w-40" />
                    <Input v-model="dateFrom" type="date" class="w-38" />
                    <span class="text-muted-foreground self-center text-sm">to</span>
                    <Input v-model="dateTo" type="date" class="w-38" />
                    <Button variant="ghost" size="sm" @click="resetFilters">Reset</Button>
                </div>
            </div>

            <!-- Table -->
            <div class="rounded-xl border overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2.5 font-medium">Time</th>
                            <th class="px-4 py-2.5 font-medium">User</th>
                            <th class="px-4 py-2.5 font-medium">Action</th>
                            <th class="px-4 py-2.5 font-medium">Model</th>
                            <th class="px-4 py-2.5 font-medium">ID</th>
                            <th class="px-4 py-2.5 font-medium">IP</th>
                            <th class="px-4 py-2.5 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr v-for="log in logs.data" :key="log.id" class="hover:bg-muted/30">
                            <td class="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                                {{ formatDt(log.created_at) }}
                            </td>
                            <td class="px-4 py-2.5">{{ log.user?.name ?? 'System' }}</td>
                            <td class="px-4 py-2.5">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="actionClass(log.action)"
                                >{{ log.action }}</span>
                            </td>
                            <td class="px-4 py-2.5 text-muted-foreground">{{ modelLabel(log.auditable_type) }}</td>
                            <td class="px-4 py-2.5 text-muted-foreground tabular-nums text-xs">
                                {{ log.auditable_id ?? '—' }}
                            </td>
                            <td class="px-4 py-2.5 text-muted-foreground font-mono text-xs">{{ log.ip_address ?? '—' }}</td>
                            <td class="px-4 py-2.5 text-right">
                                <Link
                                    v-if="log.old_values || log.new_values"
                                    :href="AuditLogController.show.url(log.id)"
                                    class="text-primary hover:underline text-xs"
                                >Diff</Link>
                            </td>
                        </tr>
                        <tr v-if="!logs.data.length">
                            <td colspan="7" class="text-muted-foreground px-4 py-12 text-center">
                                No audit entries found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="logs.last_page > 1" class="flex items-center justify-between text-sm">
                <p class="text-muted-foreground">
                    Showing {{ logs.from }}–{{ logs.to }} of {{ logs.total.toLocaleString() }}
                </p>
                <div class="flex gap-1">
                    <template v-for="link in logs.links" :key="link.label">
                        <Link
                            v-if="link.url"
                            :href="link.url"
                            preserve-state
                            class="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs"
                            :class="link.active ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'"
                            v-html="link.label"
                        />
                        <span
                            v-else
                            class="inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-xs opacity-40"
                            v-html="link.label"
                        />
                    </template>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
