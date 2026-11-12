<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Eye, EyeOff } from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as UserController from '@/actions/App/Http/Controllers/Admin/UserController';

const props = defineProps<{ roles: string[] }>();

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    status: 'active',
    pin: '',
    pin_confirmation: '',
});

const showPassword = ref(false);
const showPin = ref(false);

function submit() {
    form.post(UserController.store.url(), { preserveScroll: true });
}
</script>

<template>
    <AppLayout :breadcrumbs="[
        { title: 'Users', href: UserController.index.url() },
        { title: 'New User', href: UserController.create.url() },
    ]">
        <div class="mx-auto max-w-xl p-6 space-y-6">
            <div>
                <h1 class="text-2xl font-bold">New User</h1>
                <p class="text-muted-foreground text-sm">Create a staff account</p>
            </div>

            <form @submit.prevent="submit" class="space-y-6">
                <!-- Account info -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Account Details</h2>

                    <div class="space-y-1.5">
                        <Label for="name">Full Name <span class="text-destructive">*</span></Label>
                        <Input id="name" v-model="form.name" placeholder="e.g. Maria Santos" autofocus />
                        <InputError :message="form.errors.name" />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="email">Email <span class="text-destructive">*</span></Label>
                        <Input id="email" v-model="form.email" type="email" placeholder="maria@mystore.com" />
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
                        </div>
                    </div>
                </div>

                <!-- Password -->
                <div class="rounded-xl border p-5 space-y-4">
                    <h2 class="font-semibold">Password</h2>

                    <div class="space-y-1.5">
                        <Label for="password">Password <span class="text-destructive">*</span></Label>
                        <div class="relative">
                            <Input
                                id="password"
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                placeholder="Min. 8 characters"
                                class="pr-10"
                            />
                            <button
                                type="button"
                                class="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                                @click="showPassword = !showPassword"
                            >
                                <Eye v-if="!showPassword" class="h-4 w-4" />
                                <EyeOff v-else class="h-4 w-4" />
                            </button>
                        </div>
                        <InputError :message="form.errors.password" />
                    </div>

                    <div class="space-y-1.5">
                        <Label for="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            v-model="form.password_confirmation"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Repeat password"
                        />
                    </div>
                </div>

                <!-- POS PIN (optional) -->
                <div class="rounded-xl border p-5 space-y-4">
                    <div>
                        <h2 class="font-semibold">POS Supervisor PIN</h2>
                        <p class="text-muted-foreground text-xs mt-0.5">6-digit PIN used to authorise supervisor actions at the POS terminal. Optional for Cashier role.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <Label for="pin">PIN</Label>
                            <div class="relative">
                                <Input
                                    id="pin"
                                    v-model="form.pin"
                                    :type="showPin ? 'text' : 'password'"
                                    maxlength="6"
                                    placeholder="6 digits"
                                    class="font-mono tracking-widest pr-10"
                                />
                                <button
                                    type="button"
                                    class="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
                                    @click="showPin = !showPin"
                                >
                                    <Eye v-if="!showPin" class="h-4 w-4" />
                                    <EyeOff v-else class="h-4 w-4" />
                                </button>
                            </div>
                            <InputError :message="form.errors.pin" />
                        </div>
                        <div class="space-y-1.5">
                            <Label for="pin_confirmation">Confirm PIN</Label>
                            <Input
                                id="pin_confirmation"
                                v-model="form.pin_confirmation"
                                :type="showPin ? 'text' : 'password'"
                                maxlength="6"
                                placeholder="Repeat PIN"
                                class="font-mono tracking-widest"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <Button variant="outline" as-child>
                        <a :href="UserController.index.url()">Cancel</a>
                    </Button>
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Creating…' : 'Create User' }}
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
