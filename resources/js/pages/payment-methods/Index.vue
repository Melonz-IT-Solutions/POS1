<script setup lang="ts">
import { ref, reactive } from 'vue';
import { router } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import * as PaymentMethodController from '@/actions/App/Http/Controllers/Admin/PaymentMethodController';
import type { PaymentMethod } from '@/types/models';

const props = defineProps<{ methods: PaymentMethod[] }>();

// ── Create form ──────────────────────────────────────────────────────────────
const showCreate = ref(false);
const creating   = ref(false);
const createForm = reactive({
    name:               '',
    code:               '',
    type:               'other' as PaymentMethod['type'],
    requires_reference: false,
    errors:             {} as Record<string, string>,
});

function submitCreate() {
    creating.value = true;
    router.post(
        PaymentMethodController.store.url(),
        {
            name:               createForm.name,
            code:               createForm.code,
            type:               createForm.type,
            requires_reference: createForm.requires_reference,
        },
        {
            onSuccess: () => {
                showCreate.value        = false;
                createForm.name         = '';
                createForm.code         = '';
                createForm.type         = 'other';
                createForm.requires_reference = false;
                createForm.errors       = {};
            },
            onError:   (e) => { createForm.errors = e; },
            onFinish:  () => { creating.value = false; },
        },
    );
}

// ── Edit form ────────────────────────────────────────────────────────────────
const editing   = ref<PaymentMethod | null>(null);
const saving    = ref(false);
const editForm  = reactive({
    name:               '',
    type:               'other' as PaymentMethod['type'],
    requires_reference: false,
    errors:             {} as Record<string, string>,
});

function openEdit(method: PaymentMethod) {
    editing.value              = method;
    editForm.name               = method.name;
    editForm.type               = method.type as PaymentMethod['type'];
    editForm.requires_reference = method.requires_reference;
    editForm.errors             = {};
}

function submitEdit() {
    if (!editing.value) return;
    saving.value = true;
    router.put(
        PaymentMethodController.update.url(editing.value.id),
        {
            name:               editForm.name,
            type:               editForm.type,
            requires_reference: editForm.requires_reference,
        },
        {
            onSuccess: () => { editing.value = null; },
            onError:   (e) => { editForm.errors = e; },
            onFinish:  () => { saving.value = false; },
        },
    );
}

// ── Toggle active ────────────────────────────────────────────────────────────
function toggle(method: PaymentMethod) {
    router.post(PaymentMethodController.toggle.url(method.id), {}, { preserveScroll: true });
}

// ── Reorder ──────────────────────────────────────────────────────────────────
function move(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= props.methods.length) return;

    const ids = props.methods.map(m => m.id);
    [ids[index], ids[newIndex]] = [ids[newIndex], ids[index]];

    router.post(PaymentMethodController.reorder.url(), { ids }, { preserveScroll: true });
}

const typeLabels: Record<string, string> = {
    cash:           'Cash',
    card:           'Card',
    digital_wallet: 'Digital Wallet',
    other:          'Other',
};

const typeOptions = [
    { value: 'cash',           label: 'Cash' },
    { value: 'card',           label: 'Card' },
    { value: 'digital_wallet', label: 'Digital Wallet' },
    { value: 'other',          label: 'Other' },
];

const typeBadge: Record<string, string> = {
    cash:           'bg-green-100 text-green-700',
    card:           'bg-blue-100 text-blue-700',
    digital_wallet: 'bg-purple-100 text-purple-700',
    other:          'bg-muted text-muted-foreground',
};
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Payment Methods', href: PaymentMethodController.index.url() }]">
        <div class="p-6 space-y-6 max-w-3xl">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Payment Methods</h1>
                    <p class="text-muted-foreground text-sm">Configure which methods appear at checkout and their display order.</p>
                </div>
                <Button size="sm" @click="showCreate = true">Add Method</Button>
            </div>

            <!-- Methods list -->
            <div class="rounded-xl border overflow-hidden">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b bg-muted/30 text-left">
                            <th class="px-4 py-2.5 font-medium w-10">#</th>
                            <th class="px-4 py-2.5 font-medium">Name</th>
                            <th class="px-4 py-2.5 font-medium">Code</th>
                            <th class="px-4 py-2.5 font-medium">Type</th>
                            <th class="px-4 py-2.5 font-medium text-center">Ref. Required</th>
                            <th class="px-4 py-2.5 font-medium text-center">Active</th>
                            <th class="px-4 py-2.5 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y">
                        <tr
                            v-for="(method, idx) in methods"
                            :key="method.id"
                            class="hover:bg-muted/20"
                            :class="!method.is_active ? 'opacity-50' : ''"
                        >
                            <td class="px-4 py-2.5 text-muted-foreground tabular-nums">{{ idx + 1 }}</td>
                            <td class="px-4 py-2.5 font-medium">{{ method.name }}</td>
                            <td class="px-4 py-2.5 font-mono text-xs text-muted-foreground">{{ method.code }}</td>
                            <td class="px-4 py-2.5">
                                <span
                                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="typeBadge[method.type] ?? 'bg-muted text-muted-foreground'"
                                >{{ typeLabels[method.type] ?? method.type }}</span>
                            </td>
                            <td class="px-4 py-2.5 text-center">
                                <span v-if="method.requires_reference" class="text-primary text-xs font-medium">Yes</span>
                                <span v-else class="text-muted-foreground text-xs">No</span>
                            </td>
                            <td class="px-4 py-2.5 text-center">
                                <button
                                    type="button"
                                    class="relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors focus-visible:outline-none"
                                    :class="method.is_active ? 'bg-primary' : 'bg-muted'"
                                    @click="toggle(method)"
                                    :aria-label="method.is_active ? 'Disable' : 'Enable'"
                                >
                                    <span
                                        class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform mt-0.5"
                                        :class="method.is_active ? 'translate-x-4' : 'translate-x-0.5'"
                                    />
                                </button>
                            </td>
                            <td class="px-4 py-2.5">
                                <div class="flex items-center justify-end gap-1">
                                    <button
                                        type="button"
                                        class="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                                        :disabled="idx === 0"
                                        @click="move(idx, 'up')"
                                        title="Move up"
                                    >↑</button>
                                    <button
                                        type="button"
                                        class="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                                        :disabled="idx === methods.length - 1"
                                        @click="move(idx, 'down')"
                                        title="Move down"
                                    >↓</button>
                                    <Button variant="ghost" size="sm" class="h-7 px-2 text-xs" @click="openEdit(method)">
                                        Edit
                                    </Button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!methods.length">
                            <td colspan="7" class="text-muted-foreground px-4 py-12 text-center">
                                No payment methods configured.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p class="text-muted-foreground text-xs">
                Only active methods are shown at the POS checkout. Use the toggle to enable or disable a method without deleting it.
            </p>
        </div>

        <!-- Create dialog -->
        <Dialog v-model:open="showCreate">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div class="space-y-4 py-2">
                    <div class="space-y-1.5">
                        <Label>Name <span class="text-red-500">*</span></Label>
                        <Input v-model="createForm.name" placeholder="e.g. GCash" />
                        <p v-if="createForm.errors.name" class="text-red-500 text-xs">{{ createForm.errors.name }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Code <span class="text-red-500">*</span></Label>
                        <Input v-model="createForm.code" placeholder="e.g. gcash" class="font-mono" />
                        <p class="text-muted-foreground text-xs">Unique identifier used internally. Lowercase, no spaces.</p>
                        <p v-if="createForm.errors.code" class="text-red-500 text-xs">{{ createForm.errors.code }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Type <span class="text-red-500">*</span></Label>
                        <Select v-model="createForm.type">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            class="relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors"
                            :class="createForm.requires_reference ? 'bg-primary' : 'bg-muted'"
                            @click="createForm.requires_reference = !createForm.requires_reference"
                        >
                            <span
                                class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform mt-0.5"
                                :class="createForm.requires_reference ? 'translate-x-4' : 'translate-x-0.5'"
                            />
                        </button>
                        <Label class="cursor-pointer" @click="createForm.requires_reference = !createForm.requires_reference">
                            Requires reference number
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" @click="showCreate = false">Cancel</Button>
                    <Button :disabled="creating || !createForm.name || !createForm.code" @click="submitCreate">
                        {{ creating ? 'Saving…' : 'Create' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Edit dialog -->
        <Dialog :open="!!editing" @update:open="(v) => { if (!v) editing = null; }">
            <DialogContent class="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Payment Method</DialogTitle>
                </DialogHeader>
                <div v-if="editing" class="space-y-4 py-2">
                    <p class="text-muted-foreground text-xs">Code <span class="font-mono">{{ editing.code }}</span> cannot be changed.</p>
                    <div class="space-y-1.5">
                        <Label>Name <span class="text-red-500">*</span></Label>
                        <Input v-model="editForm.name" />
                        <p v-if="editForm.errors.name" class="text-red-500 text-xs">{{ editForm.errors.name }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label>Type <span class="text-red-500">*</span></Label>
                        <Select v-model="editForm.type">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex items-center gap-3">
                        <button
                            type="button"
                            class="relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors"
                            :class="editForm.requires_reference ? 'bg-primary' : 'bg-muted'"
                            @click="editForm.requires_reference = !editForm.requires_reference"
                        >
                            <span
                                class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform mt-0.5"
                                :class="editForm.requires_reference ? 'translate-x-4' : 'translate-x-0.5'"
                            />
                        </button>
                        <Label class="cursor-pointer" @click="editForm.requires_reference = !editForm.requires_reference">
                            Requires reference number
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" @click="editing = null">Cancel</Button>
                    <Button :disabled="saving || !editForm.name" @click="submitEdit">
                        {{ saving ? 'Saving…' : 'Save Changes' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
