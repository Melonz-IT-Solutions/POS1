<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Package } from '@lucide/vue';

const props = withDefaults(defineProps<{
    imagePath?: string | null;
    alt?: string;
    iconClass?: string;
}>(), {
    imagePath: null,
    alt: '',
    iconClass: 'h-5 w-5',
});

const failed = ref(false);
watch(() => props.imagePath, () => { failed.value = false; });

const src = computed(() => {
    if (!props.imagePath || failed.value) return null;
    if (/^(https?:)?\/\//.test(props.imagePath) || props.imagePath.startsWith('/')) return props.imagePath;
    return `/storage/${props.imagePath}`;
});
</script>

<template>
    <div class="bg-muted flex shrink-0 items-center justify-center overflow-hidden">
        <img
            v-if="src"
            :src="src"
            :alt="alt"
            loading="lazy"
            class="h-full w-full object-cover"
            @error="failed = true" />
        <Package v-else :class="iconClass" class="text-muted-foreground/50" />
    </div>
</template>
