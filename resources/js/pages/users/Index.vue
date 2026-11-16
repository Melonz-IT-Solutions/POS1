<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    Eye, KeyRound, Pencil, Plus, RotateCcw, Search, ShieldCheck, Trash2, UserRound,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppPagination from '@/components/AppPagination.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import * as UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import type { User, Role } from '@/types/models';

interface UserRow extends User {
    roles: Role[];
    deleted_at: string | null;
}

interface PaginatedUsers {
    data: UserRow[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number; last_page: number;
    from: number | null; to: number | null; total: number;
}

const props = defineProps<{
    users: PaginatedUsers;
    roles: string[];
    filters: { search?: string; role?: string; status?: string };
}>();

const search = ref(props.filters.search ?? '');
const roleFilter = ref(props.filters.role ?? 'all');
const statusFilter = ref(props.filters.status ?? 'all');

function applyFilters() {
    router.get(UserController.index.url(), {
        search: search.value || undefined,
        role: roleFilter.value === 'all' ? undefined : roleFilter.value,
        status: statusFilter.value === 'all' ? undefined : statusFilter.value,
    }, { preserveState: true, replace: true });
}

let timer: ReturnType<typeof setTimeout>;
function onSearch() { clearTimeout(timer); timer = setTimeout(applyFilters, 350); }

const confirmDelete = ref(false);
const target = ref<UserRow | null>(null);

function askDelete(u: UserRow) { target.value = u; confirmDelete.value = true; }
function doDelete() {
    if (!target.value) return;
    router.delete(UserController.destroy.url({ user: target.value.id }), { preserveScroll: true });
}
function restore(id: number) {
    router.post(UserController.restore.url({ id }), {}, { preserveScroll: true });
}

const roleColors: Record<string, string> = {
    Administrator: 'bg-purple-100 text-purple-800',
    Manager:       'bg-blue-100 text-blue-800',
    Cashier:       'bg-green-100 text-green-800',
};

function initials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Users', href: UserController.index.url() }]">
        <div class="p-6 space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold">Users</h1>
                    <p class="text-muted-foreground text-sm">{{ users.total }} staff accounts</p>
                </div>
                <Button as-child>
                    <a :href="UserController.create.url()">
                        <Plus class="mr-2 h-4 w-4" />
                        New User
                    </a>
                </Button>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative flex-1 min-w-[200px]">
                    <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input v-model="search" placeholder="Search name or email…" class="pl-9" @input="onSearch" />
                </div>
                <Select v-model="roleFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-40">
                        <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All roles</SelectItem>
                        <SelectItem v-for="r in roles" :key="r" :value="r">{{ r }}</SelectItem>
                    </SelectContent>
                </Select>
                <Select v-model="statusFilter" @update:model-value="applyFilters">
                    <SelectTrigger class="w-36">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="deleted">Deleted</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <!-- Table -->
            <div class="rounded-xl border">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b text-left">
                            <th class="px-4 py-3 font-medium">User</th>
                            <th class="px-4 py-3 font-medium">Role</th>
                            <th class="px-4 py-3 font-medium">Status</th>
                            <th class="px-4 py-3 font-medium">Last Login</th>
                            <th class="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="user in users.data"
                            :key="user.id"
                            :class="['border-b transition-colors', user.deleted_at ? 'opacity-50' : 'hover:bg-muted/50']"
                        >
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-3">
                                    <div class="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                                        {{ initials(user.name) }}
                                    </div>
                                    <div>
                                        <p class="font-medium">{{ user.name }}</p>
                                        <p class="text-muted-foreground text-xs">{{ user.email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex flex-wrap gap-1">
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
                            </td>
                            <td class="px-4 py-3">
                                <Badge v-if="user.deleted_at" variant="destructive" class="text-xs">Deleted</Badge>
                                <Badge v-else-if="user.status === 'active'" variant="secondary" class="bg-green-100 text-green-800 text-xs">Active</Badge>
                                <Badge v-else variant="outline" class="text-xs">Inactive</Badge>
                            </td>
                            <td class="px-4 py-3 text-muted-foreground text-xs">
                                {{ user.last_login_at
                                    ? new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' }).format(new Date(user.last_login_at))
                                    : 'Never' }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <Button v-if="user.deleted_at" size="sm" variant="ghost" @click="restore(user.id)" title="Restore">
                                        <RotateCcw class="h-4 w-4" />
                                    </Button>
                                    <template v-else>
                                        <Button size="sm" variant="ghost" as-child title="View">
                                            <a :href="UserController.show.url({ user: user.id })">
                                                <Eye class="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost" as-child title="Edit">
                                            <a :href="UserController.edit.url({ user: user.id })">
                                                <Pencil class="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button size="sm" variant="ghost" class="text-destructive" @click="askDelete(user)" title="Delete">
                                            <Trash2 class="h-4 w-4" />
                                        </Button>
                                    </template>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!users.data.length">
                            <td colspan="5" class="text-muted-foreground px-4 py-12 text-center">No users found.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <AppPagination :meta="users" />
        </div>

        <ConfirmDialog
            v-model:open="confirmDelete"
            title="Delete User"
            :description="`Delete account for &quot;${target?.name}&quot;? They will no longer be able to log in.`"
            confirm-label="Delete"
            @confirm="doDelete"
        />
    </AppLayout>
</template>
