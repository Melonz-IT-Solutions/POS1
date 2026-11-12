<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCurrency } from '@/composables/useCurrency';

const props = defineProps<{
    modelValue: number;   // centavos
    label?: string;
    showDone?: boolean;
}>();
const emit = defineEmits<{
    'update:modelValue': [value: number];
    done: [];
}>();

const { toCentavos } = useCurrency();

// Display as pesos string
const display = ref(props.modelValue > 0 ? (props.modelValue / 100).toFixed(2) : '');

watch(() => props.modelValue, (val) => {
    if (val === 0) display.value = '';
});

function press(key: string) {
    if (key === 'C') {
        display.value = '';
        emit('update:modelValue', 0);
        return;
    }
    if (key === '⌫') {
        display.value = display.value.slice(0, -1);
    } else if (key === '.') {
        if (!display.value.includes('.')) display.value += '.';
    } else {
        // Limit to 2 decimal places
        const parts = display.value.split('.');
        if (parts[1] !== undefined && parts[1].length >= 2) return;
        display.value += key;
    }
    emit('update:modelValue', toCentavos(parseFloat(display.value) || 0));
}

const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫'];
</script>

<template>
    <div class="flex flex-col gap-2">
        <div v-if="label" class="text-muted-foreground text-sm font-medium">{{ label }}</div>

        <div
            class="bg-muted flex h-14 items-center justify-end rounded-lg px-4 font-mono text-2xl font-bold tracking-wider">
            {{ display || '0.00' }}
        </div>

        <div class="grid grid-cols-3 gap-1.5">
            <button
                v-for="key in keys"
                :key="key"
                class="bg-card hover:bg-accent active:bg-primary/10 flex h-14 items-center justify-center rounded-lg border text-lg font-semibold transition-colors select-none"
                type="button"
                @click="press(key)">
                {{ key }}
            </button>
        </div>

        <div class="grid grid-cols-2 gap-1.5">
            <button
                class="bg-destructive/10 text-destructive hover:bg-destructive/20 h-14 rounded-lg border border-transparent font-semibold transition-colors"
                type="button"
                @click="press('C')">
                Clear
            </button>
            <button
                v-if="showDone"
                class="bg-primary text-primary-foreground hover:bg-primary/90 h-14 rounded-lg font-semibold transition-colors"
                type="button"
                @click="$emit('done')">
                Done
            </button>
        </div>
    </div>
</template>
