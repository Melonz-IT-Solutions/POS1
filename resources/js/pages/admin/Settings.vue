<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useForm } from '@inertiajs/vue3';
import {
    Building2, CheckCircle2, DollarSign, Gift, ReceiptText, Settings2,
} from '@lucide/vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as SystemSettingsController from '@/actions/App/Http/Controllers/Admin/SystemSettingsController';

interface SettingRow {
    key: string;
    group: string;
    label: string;
    value: string | null;
}

interface GroupedSettings {
    business: SettingRow[];
    tax: SettingRow[];
    currency: SettingRow[];
    receipt: SettingRow[];
    loyalty: SettingRow[];
    system: SettingRow[];
}

const props = defineProps<{ settings: GroupedSettings }>();

// Flatten all settings into a mutable map keyed by setting key
const values = reactive<Record<string, string>>(
    Object.values(props.settings)
        .flat()
        .reduce((acc, s) => ({ ...acc, [s.key]: s.value ?? '' }), {} as Record<string, string>),
);

const activeTab = ref<keyof GroupedSettings>('business');

const tabs: { key: keyof GroupedSettings; label: string; icon: any }[] = [
    { key: 'business', label: 'Business',   icon: Building2 },
    { key: 'tax',      label: 'Tax & VAT',  icon: DollarSign },
    { key: 'currency', label: 'Currency',   icon: DollarSign },
    { key: 'receipt',  label: 'Receipt',    icon: ReceiptText },
    { key: 'loyalty',  label: 'Loyalty',    icon: Gift },
    { key: 'system',   label: 'System',     icon: Settings2 },
];

const isSaving = ref(false);
const savedOk = ref(false);

const form = useForm({ settings: [] as { key: string; value: string }[] });

function save() {
    form.settings = Object.entries(values).map(([key, value]) => ({ key, value }));
    form.post(SystemSettingsController.update.url(), {
        preserveScroll: true,
        onSuccess: () => { savedOk.value = true; setTimeout(() => { savedOk.value = false; }, 3000); },
        onBefore: () => { isSaving.value = true; },
        onFinish: () => { isSaving.value = false; },
    });
}

function fieldType(key: string): string {
    if (['vat_inclusive', 'loyalty_enabled', 'vat_registered', 'show_vat_breakdown'].includes(key)) {
        return 'checkbox';
    }
    if (['vat_rate', 'loyalty_earn_rate', 'loyalty_redeem_rate', 'session_timeout', 'max_cashier_discount_pct'].includes(key)) {
        return 'number';
    }
    return 'text';
}

function isTruthy(val: string | null) {
    return val === 'true' || val === '1';
}

function toggleBool(key: string) {
    values[key] = isTruthy(values[key]) ? 'false' : 'true';
}
</script>

<template>
    <AppLayout :breadcrumbs="[{ title: 'Settings', href: SystemSettingsController.index.url() }]">
        <div class="p-6 space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold">System Settings</h1>
                    <p class="text-muted-foreground text-sm">Configure your store's business settings</p>
                </div>
                <div class="flex items-center gap-3">
                    <div v-if="savedOk" class="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <CheckCircle2 class="h-4 w-4" />
                        Saved
                    </div>
                    <Button @click="save" :disabled="isSaving">
                        {{ isSaving ? 'Saving…' : 'Save Changes' }}
                    </Button>
                </div>
            </div>

            <div class="flex gap-6">
                <!-- Tab nav -->
                <nav class="w-44 shrink-0 space-y-1">
                    <button
                        v-for="tab in tabs"
                        :key="tab.key"
                        @click="activeTab = tab.key"
                        :class="[
                            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left',
                            activeTab === tab.key
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        ]"
                    >
                        <component :is="tab.icon" class="h-4 w-4" />
                        {{ tab.label }}
                    </button>
                </nav>

                <!-- Settings form -->
                <div class="flex-1 rounded-xl border p-6">
                    <div
                        v-for="tab in tabs"
                        :key="tab.key"
                        v-show="activeTab === tab.key"
                        class="space-y-5"
                    >
                        <h2 class="font-semibold text-base border-b pb-3">{{ tab.label }} Settings</h2>

                        <template v-for="setting in settings[tab.key]" :key="setting.key">
                            <!-- Boolean toggle -->
                            <div v-if="fieldType(setting.key) === 'checkbox'" class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-sm">{{ setting.label }}</p>
                                    <p class="text-muted-foreground text-xs">{{ setting.key }}</p>
                                </div>
                                <button
                                    type="button"
                                    @click="toggleBool(setting.key)"
                                    :class="[
                                        'relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                                        isTruthy(values[setting.key]) ? 'bg-primary' : 'bg-muted',
                                    ]"
                                >
                                    <span
                                        :class="[
                                            'block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                                            isTruthy(values[setting.key]) ? 'translate-x-5' : 'translate-x-0.5',
                                        ]"
                                    />
                                </button>
                            </div>

                            <!-- Number / text input -->
                            <div v-else class="grid grid-cols-2 items-start gap-4">
                                <div class="pt-2">
                                    <p class="font-medium text-sm">{{ setting.label }}</p>
                                    <p class="text-muted-foreground text-xs">{{ setting.key }}</p>
                                </div>
                                <Input
                                    :type="fieldType(setting.key)"
                                    v-model="values[setting.key]"
                                    :min="fieldType(setting.key) === 'number' ? 0 : undefined"
                                />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
