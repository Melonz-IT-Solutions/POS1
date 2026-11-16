<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Eye, EyeOff, KeyRound, Lock } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import * as UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import type { User, Role } from '@/types/models';

const props = defineProps<{
    user: User & { roles: Role[] };
    roles: string[];
}>();

// ── Main edit form ──────────────────────────────────────────────────────────
const form = useForm({
    name:   props.user.name,
    email:  props.user.email,
    role:   props.user.roles[0]?.name ?? '',
    status: props.user.status,
});

function submit() {
    form.put(UserController.update.url({ user: props.user.id }), { preserveScroll: true });
}

// ── Reset password modal ────────────────────────────────────────────────────
const pwOpen = ref(false);
const showPw = ref(false);
const pwForm = useForm({ password: '', password_confirmation: '' });

function submitPw() {
    pwForm.post(UserController.resetPassword.url({ user: props.user.id }), {
        preserveScroll: true,
        onSuccess: () => { pwOpen.value = false; pwForm.reset(); },
    });
}

// ── Set PIN modal ────────────────────────────────────────────────────────────
const pinOpen = ref(false);
const showPin = ref(false);
const pinForm = useForm({ pin: '', pin_confirmation: '' });

function submitPin() {
    pinForm.post(UserController.setPin.url({ user: props.user.id }), {
        preserveScroll: true,
        onSuccess: () => { pinOpen.value = false; pinForm.reset(); },
    });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Users', href: UserController.index.url() },
        { title: user.name, href: UserController.edit.url({ user: user.id }) },
    ]">
        <div class="max-w-xl p-6 space-y-6">
            <div class="flex items-start justify-between">
                <div>
                    <h1 class="text-2xl font-bold">Edit User</h1>
                    <p class="text-muted-foreground text-sm">{{ user.email }}</p>
                </div>
                <div class="flex gap-2">
                    <Button size="sm" variant="outline" @click="pwOpen = true">
                        <Lock class="mr-2 h-4 w-4" />
                        Reset Password
                    </Button>
                    <Button size="sm" variant="outline" @click="pinOpen = true">
                        <KeyRound class="mr-2 h-4 w-4" />
                        Set PIN
                    </Button>
                </div>
            </div>

            <form @submit.prevent="submit" class="space-y-5">
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Account Details</h2>

                    <div class="space-y-1.5">
                        <Label for="name">Full Name <span class="text-destructive">*</span></Label>
                        <Input id="name" v-model="form.name" autofocus />
                        <InputError :message="form.errors.name" />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="email">Email <span class="text-destructive">*</span></Label>
                        <Input id="email" v-model="form.email" type="email" />
                        <InputError :message="form.errors.email" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label>Role <span class="text-destructive">*</span></Label>
                            <Select v-model="form.role">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="r in roles" :key="r" :value="r">{{ r }}</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.role" />
                        </div>
                        <div class="space-y-1.5">
                            <Label>Status</Label>
                            <Select v-model="form.status">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError :message="form.errors.status" />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <Button variant="outline" as-child>
                        <a :href="UserController.index.url()">Cancel</a>
                    </Button>
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Saving…' : 'Save Changes' }}
                    </Button>
                </div>
            </form>
        </div>

        <!-- Reset Password Modal -->
        <Dialog v-model:open="pwOpen">
            <DialogContent class="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                </DialogHeader>
                <div class="space-y-4 py-2">
                    <div class="space-y-1.5">
                        <Label for="new-pw">New Password</Label>
                        <div class="relative">
                            <Input
                                id="new-pw"
                                v-model="pwForm.password"
                                :type="showPw ? 'text' : 'password'"
                                placeholder="Min. 8 characters"
                                class="pr-10"
                                autofocus
                            />
                            <button type="button" class="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2" @click="showPw = !showPw">
                                <Eye v-if="!showPw" class="h-4 w-4" />
                                <EyeOff v-else class="h-4 w-4" />
                            </button>
                        </div>
                        <p v-if="pwForm.errors.password" class="text-destructive text-xs">{{ pwForm.errors.password }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label for="new-pw-confirm">Confirm Password</Label>
                        <Input
                            id="new-pw-confirm"
                            v-model="pwForm.password_confirmation"
                            :type="showPw ? 'text' : 'password'"
                            placeholder="Repeat password"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="pwOpen = false">Cancel</Button>
                    <Button @click="submitPw" :disabled="pwForm.processing">
                        {{ pwForm.processing ? 'Resetting…' : 'Reset Password' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Set PIN Modal -->
        <Dialog v-model:open="pinOpen">
            <DialogContent class="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Set POS Supervisor PIN</DialogTitle>
                </DialogHeader>
                <div class="space-y-4 py-2">
                    <p class="text-muted-foreground text-sm">
                        6-digit PIN used to authorise supervisor overrides at the POS terminal.
                    </p>
                    <div class="space-y-1.5">
                        <Label for="new-pin">New PIN</Label>
                        <div class="relative">
                            <Input
                                id="new-pin"
                                v-model="pinForm.pin"
                                :type="showPin ? 'text' : 'password'"
                                maxlength="6"
                                placeholder="6 digits"
                                class="font-mono tracking-widest pr-10"
                                autofocus
                            />
                            <button type="button" class="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2" @click="showPin = !showPin">
                                <Eye v-if="!showPin" class="h-4 w-4" />
                                <EyeOff v-else class="h-4 w-4" />
                            </button>
                        </div>
                        <p v-if="pinForm.errors.pin" class="text-destructive text-xs">{{ pinForm.errors.pin }}</p>
                    </div>
                    <div class="space-y-1.5">
                        <Label for="new-pin-confirm">Confirm PIN</Label>
                        <Input
                            id="new-pin-confirm"
                            v-model="pinForm.pin_confirmation"
                            :type="showPin ? 'text' : 'password'"
                            maxlength="6"
                            placeholder="Repeat PIN"
                            class="font-mono tracking-widest"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="pinOpen = false">Cancel</Button>
                    <Button @click="submitPin" :disabled="pinForm.processing">
                        {{ pinForm.processing ? 'Saving…' : 'Set PIN' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
