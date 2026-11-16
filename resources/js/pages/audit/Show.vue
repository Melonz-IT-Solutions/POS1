<script setup lang="ts">
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import * as AuditLogController from '@/actions/App/Http/Controllers/Admin/AuditLogController';
import type { AuditLog } from '@/types/models';

type AuditLogDetail = AuditLog & {
    user?: { id: number; name: string; email: string };
};

const props = defineProps<{ log: AuditLogDetail }>();

function modelLabel(type: string | null): string {
    if (!type) return '—';
    return type.split('\\').pop() ?? type;
}

const dtf = new Intl.DateTimeFormat('en-PH', { dateStyle: 'long', timeStyle: 'medium' });
function formatDt(s: string): string { return dtf.format(new Date(s)); }

function actionClass(a: string): string {
    if (a.includes('create'))  return 'bg-green-100 text-green-700';
    if (a.includes('delete'))  return 'bg-red-100 text-red-700';
    if (a.includes('restore')) return 'bg-blue-100 text-blue-700';
    if (a.includes('update') || a.includes('password') || a.includes('pin')) return 'bg-amber-100 text-amber-700';
    if (a.includes('cancel') || a.includes('void')) return 'bg-red-100 text-red-700';
    return 'bg-muted text-muted-foreground';
}

// Build a unified diff view: all keys from old + new
const diffRows = computed(() => {
    const oldVals = props.log.old_values as Record<string, unknown> | null;
    const newVals = props.log.new_values as Record<string, unknown> | null;

    const keys = new Set([
        ...Object.keys(oldVals ?? {}),
        ...Object.keys(newVals ?? {}),
    ]);

    // Skip noisy internal timestamps
    const skip = new Set(['updated_at', 'created_at', 'deleted_at']);

    return [...keys]
        .filter(k => !skip.has(k))
        .map(k => ({
            key:      k,
            oldValue: oldVals?.[k] ?? null,
            newValue: newVals?.[k] ?? null,
            changed:  JSON.stringify(oldVals?.[k]) !== JSON.stringify(newVals?.[k]),
        }));
});

function display(v: unknown): string {
    if (v === null || v === undefined) return '—';
    if (typeof v === 'boolean') return v ? 'true' : 'false';
    if (typeof v === 'object') return JSON.stringify(v, null, 2);
    return String(v);
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Audit Log', href: AuditLogController.index.url() },
        { title: `Entry #${log.id}`, href: AuditLogController.show.url(log.id) },
    ]">
        <div class="p-6 space-y-6 max-w-4xl">
            <!-- Header -->
            <div>
                <div class="flex items-center gap-3">
                    <h1 class="text-2xl font-bold">Audit Entry #{{ log.id }}</h1>
                    <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        :class="actionClass(log.action)"
                    >{{ log.action }}</span>
                </div>
                <p class="text-muted-foreground text-sm mt-0.5">{{ formatDt(log.created_at) }}</p>
            </div>

            <!-- Meta info -->
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">User</p>
                    <p class="font-medium text-sm">{{ log.user?.name ?? 'System' }}</p>
                    <p v-if="log.user?.email" class="text-muted-foreground text-xs">{{ log.user.email }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">Model</p>
                    <p class="font-medium text-sm">{{ modelLabel(log.auditable_type) }}</p>
                    <p v-if="log.auditable_id" class="text-muted-foreground text-xs">ID {{ log.auditable_id }}</p>
                </div>
                <div class="rounded-xl border p-4 space-y-1">
                    <p class="text-muted-foreground text-xs">IP Address</p>
                    <p class="font-mono text-sm">{{ log.ip_address ?? '—' }}</p>
                </div>
            </div>

            <!-- Diff table -->
            <div v-if="diffRows.length" class="rounded-xl border overflow-hidden">
                <div class="border-b px-4 py-3">
                    <h2 class="font-semibold text-sm">Changes</h2>
                </div>
                <table class="w-full text-sm font-mono">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2 font-medium font-sans text-xs w-40">Field</th>
                            <th class="px-4 py-2 font-medium font-sans text-xs w-1/2">Before</th>
                            <th class="px-4 py-2 font-medium font-sans text-xs w-1/2">After</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr
                            v-for="row in diffRows"
                            :key="row.key"
                            :class="row.changed ? '' : 'opacity-40'"
                            class="hover:bg-muted/20"
                        >
                            <td class="px-4 py-2.5 font-sans font-medium text-xs text-muted-foreground align-top">
                                {{ row.key }}
                            </td>
                            <td class="px-4 py-2.5 align-top">
                                <span
                                    class="block whitespace-pre-wrap break-all text-xs"
                                    :class="row.changed && row.oldValue !== null ? 'text-red-600 line-through' : ''"
                                >{{ display(row.oldValue) }}</span>
                            </td>
                            <td class="px-4 py-2.5 align-top">
                                <span
                                    class="block whitespace-pre-wrap break-all text-xs"
                                    :class="row.changed && row.newValue !== null ? 'text-green-700 font-semibold' : ''"
                                >{{ display(row.newValue) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- No changes recorded -->
            <div v-else-if="!log.old_values && !log.new_values" class="rounded-xl border p-6 text-center">
                <p class="text-muted-foreground text-sm">No field-level diff recorded for this action.</p>
            </div>

            <!-- Raw JSON fallback for complex nested structures -->
            <div v-if="log.new_values && Object.keys(log.new_values).length > 0" class="rounded-xl border overflow-hidden">
                <details class="group">
                    <summary class="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-semibold select-none">
                        Raw JSON
                        <span class="text-muted-foreground text-xs font-normal group-open:hidden">click to expand</span>
                    </summary>
                    <div class="border-t px-4 py-3 grid gap-4 sm:grid-cols-2 text-xs font-mono">
                        <div>
                            <p class="font-sans font-medium text-xs mb-1 text-muted-foreground">Old Values</p>
                            <pre class="whitespace-pre-wrap break-all bg-muted/40 rounded p-2 text-xs">{{ JSON.stringify(log.old_values, null, 2) }}</pre>
                        </div>
                        <div>
                            <p class="font-sans font-medium text-xs mb-1 text-muted-foreground">New Values</p>
                            <pre class="whitespace-pre-wrap break-all bg-muted/40 rounded p-2 text-xs">{{ JSON.stringify(log.new_values, null, 2) }}</pre>
                        </div>
                    </div>
                </details>
            </div>

            <div class="flex gap-2">
                <Link :href="AuditLogController.index.url()" class="text-primary hover:underline text-sm">
                    ← Back to Audit Log
                </Link>
            </div>
        </div>
    </AppLayout>
</template>
