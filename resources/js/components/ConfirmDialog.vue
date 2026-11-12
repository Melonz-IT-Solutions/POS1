<script setup lang="ts">
import { ref } from 'vue';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const props = withDefaults(defineProps<{
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
}>(), {
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'destructive',
});

const emit = defineEmits<{
    confirm: [];
    cancel: [];
}>();

const open = defineModel<boolean>('open', { default: false });
</script>

<template>
    <Dialog v-model:open="open">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>{{ description }}</DialogDescription>
            </DialogHeader>
            <slot />
            <DialogFooter>
                <Button variant="outline" @click="open = false; $emit('cancel')">
                    {{ cancelLabel }}
                </Button>
                <Button :variant="variant" @click="open = false; $emit('confirm')">
                    {{ confirmLabel }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
