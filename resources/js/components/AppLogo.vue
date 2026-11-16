<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import AppLogoIcon from '@/components/AppLogoIcon.vue';

const name = usePage().props.name;
</script>

<template>
    <div
        class="flex aspect-square items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground"
    >
        <AppLogoIcon class="size-5 fill-current text-white dark:text-black" />
    </div>
    <div class="ml-1 grid flex-1 text-left">
        <!-- <span class="truncate leading-tight font-semibold text-xl">{{
            name
        }}</span> -->
        <span class="truncate leading-tight font-bold text-xl">POS<span style="color: #1F4FD8">1</span></span>
        <span class="text-[10px] text-muted-foreground">Powered by Melonz IT Solutions</span>
    </div>
</template>
