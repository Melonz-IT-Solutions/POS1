<script setup lang="ts">
import { computed } from 'vue';
import { useCurrency } from '@/composables/useCurrency';

const props = defineProps<{
    centavos: number;
    class?: string;
}>();

const { format } = useCurrency();
const formatted = computed(() => format(props.centavos));
</script>

<template>
    <span :class="props.class">{{ formatted }}</span>
</template>
