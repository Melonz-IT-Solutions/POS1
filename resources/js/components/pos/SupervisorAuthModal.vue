<script setup lang="ts">
import { ref } from 'vue';
import { usePosStore } from '@/stores/pos';

const pos     = usePosStore();
const pin     = ref('');
const error   = ref('');
const loading = ref(false);

async function verify() {
    if (!pin.value) {
        error.value = 'Enter supervisor PIN.';
        return;
    }
    loading.value = true;
    error.value   = '';

    try {
        const res = await fetch('/pos/supervisor/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({ pin: pin.value }),
        });

        if (res.ok) {
            pin.value = '';
            pos.supervisorApproved();
        } else {
            error.value = 'Invalid PIN. Try again.';
            pin.value   = '';
        }
    } finally {
        loading.value = false;
    }
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div class="bg-background w-full max-w-sm rounded-xl border p-6 shadow-2xl">
            <div class="mb-4 text-center">
                <div class="bg-warning/10 text-warning mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 class="text-lg font-semibold">Supervisor Required</h2>
                <p class="text-muted-foreground mt-1 text-sm">{{ pos.supervisorMessage }}</p>
            </div>

            <form @submit.prevent="verify">
                <input
                    v-model="pin"
                    v-focus
                    class="border-input bg-background mb-3 w-full rounded-lg border px-4 py-3 text-center font-mono text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                    type="password"
                    placeholder="• • • • • •"
                    autocomplete="off"
                    maxlength="6" />

                <div v-if="error" class="text-destructive mb-3 text-center text-sm">{{ error }}</div>

                <div class="flex gap-2">
                    <button
                        class="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                        type="button"
                        @click="pos.supervisorDenied">
                        Cancel
                    </button>
                    <button
                        :disabled="loading"
                        class="bg-primary text-primary-foreground hover:bg-primary/90 flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                        type="submit">
                        {{ loading ? 'Verifying...' : 'Authorize' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
