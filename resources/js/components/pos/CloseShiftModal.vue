<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePosStore } from '@/stores/pos';
import * as ShiftController from '@/actions/App/Http/Controllers/POS/ShiftController';

const pos = usePosStore();

// ── Denomination definitions ───────────────────────────────────────────────
interface Denom {
    label: string;
    value: number; // centavos
}

const DENOMS: Denom[] = [
    { label: '₱1,000', value: 100_000 },
    { label: '₱500',   value:  50_000 },
    { label: '₱200',   value:  20_000 },
    { label: '₱100',   value:  10_000 },
    { label: '₱50',    value:   5_000 },
    { label: '₱20',    value:   2_000 },
    { label: '₱10',    value:   1_000 },
    { label: '₱5',     value:     500 },
    { label: '₱1',     value:     100 },
];

const counts = ref<Record<number, number>>(
    Object.fromEntries(DENOMS.map(d => [d.value, 0]))
);

// ── Shift summary (fetched from server) ───────────────────────────────────
interface ShiftSummary {
    opening_float:     number;
    cash_sales:        number;
    cash_in:           number;
    cash_out:          number;
    expected_cash:     number;
    total_sales:       number;
    transaction_count: number;
}

const summary   = ref<ShiftSummary | null>(null);
const fetchError = ref('');

async function fetchSummary() {
    try {
        const res = await fetch(ShiftController.summary.url(), {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        });
        if (!res.ok) throw new Error('Failed to load shift summary.');
        summary.value = await res.json();
    } catch (e: any) {
        fetchError.value = e.message ?? 'Unknown error.';
    }
}

onMounted(fetchSummary);

// ── Computed totals ────────────────────────────────────────────────────────
const countedCash = computed(() =>
    DENOMS.reduce((sum, d) => sum + d.value * (counts.value[d.value] ?? 0), 0)
);

const variance = computed(() =>
    summary.value ? countedCash.value - summary.value.expected_cash : 0
);

const varianceLabel = computed(() => {
    if (variance.value === 0) return 'Balanced';
    return variance.value > 0 ? 'Over' : 'Under';
});

// ── Notes + submit ─────────────────────────────────────────────────────────
const notes    = ref('');
const loading  = ref(false);
const closeErr = ref('');

async function confirmClose() {
    loading.value  = true;
    closeErr.value = '';
    try {
        const res = await fetch(ShiftController.close.url(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': decodeURIComponent(
                    document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? ''
                ),
            },
            body: JSON.stringify({
                closing_cash: countedCash.value,
                notes: notes.value || null,
            }),
        });
        const data = await res.json();
        if (!res.ok) {
            closeErr.value = data.message ?? 'Could not close shift.';
            return;
        }
        pos.setShift(null);
        pos.closeModal();
        // Reload to show the "open shift" gate
        window.location.reload();
    } finally {
        loading.value = false;
    }
}

function peso(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div class="bg-background w-full max-w-lg rounded-2xl border shadow-2xl flex flex-col max-h-[95vh]">

            <!-- Header -->
            <div class="flex items-center justify-between border-b px-5 py-4">
                <div>
                    <h2 class="font-semibold text-base">Close Shift</h2>
                    <p class="text-muted-foreground text-xs mt-0.5">Count your drawer before closing</p>
                </div>
                <button
                    class="text-muted-foreground hover:text-foreground transition-colors"
                    @click="pos.closeModal()">
                    ✕
                </button>
            </div>

            <div class="overflow-y-auto flex-1 px-5 py-4 space-y-5">

                <!-- Shift summary cards -->
                <div v-if="summary" class="grid grid-cols-3 gap-2">
                    <div class="rounded-lg border p-3 text-center">
                        <div class="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">Transactions</div>
                        <div class="font-bold text-lg">{{ summary.transaction_count }}</div>
                    </div>
                    <div class="rounded-lg border p-3 text-center">
                        <div class="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">Total Sales</div>
                        <div class="font-bold text-sm">{{ peso(summary.total_sales) }}</div>
                    </div>
                    <div class="rounded-lg border p-3 text-center">
                        <div class="text-muted-foreground text-[10px] uppercase tracking-wide mb-1">Expected Cash</div>
                        <div class="font-bold text-sm text-primary">{{ peso(summary.expected_cash) }}</div>
                    </div>
                </div>
                <div v-else-if="fetchError" class="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {{ fetchError }}
                </div>
                <div v-else class="text-muted-foreground text-sm text-center py-2">Loading shift data…</div>

                <!-- Expected cash breakdown -->
                <div v-if="summary" class="rounded-lg bg-muted/40 border px-4 py-3 text-xs space-y-1.5">
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">Opening float</span>
                        <span>{{ peso(summary.opening_float) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-muted-foreground">+ Cash sales</span>
                        <span>{{ peso(summary.cash_sales) }}</span>
                    </div>
                    <div v-if="summary.cash_in" class="flex justify-between">
                        <span class="text-muted-foreground">+ Cash in</span>
                        <span>{{ peso(summary.cash_in) }}</span>
                    </div>
                    <div v-if="summary.cash_out" class="flex justify-between">
                        <span class="text-muted-foreground">− Cash out</span>
                        <span>{{ peso(summary.cash_out) }}</span>
                    </div>
                    <div class="flex justify-between border-t border-border pt-1.5 font-semibold">
                        <span>Expected in drawer</span>
                        <span class="text-primary">{{ peso(summary.expected_cash) }}</span>
                    </div>
                </div>

                <!-- Denomination counter -->
                <div>
                    <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cash Count</div>
                    <div class="rounded-lg border overflow-hidden">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="bg-muted/40 border-b">
                                    <th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Denomination</th>
                                    <th class="px-3 py-2 text-center font-medium text-muted-foreground text-xs w-24">Count</th>
                                    <th class="px-3 py-2 text-right font-medium text-muted-foreground text-xs">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="denom in DENOMS"
                                    :key="denom.value"
                                    class="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                    <td class="px-3 py-2 font-medium">{{ denom.label }}</td>
                                    <td class="px-3 py-1.5 text-center">
                                        <input
                                            v-model.number="counts[denom.value]"
                                            type="number"
                                            min="0"
                                            class="border-input bg-background w-16 rounded border px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                            @focus="($event.target as HTMLInputElement).select()"
                                        />
                                    </td>
                                    <td class="px-3 py-2 text-right text-muted-foreground">
                                        {{ counts[denom.value] > 0 ? peso(denom.value * counts[denom.value]) : '—' }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Totals row -->
                <div class="rounded-lg border px-4 py-3 space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground">Counted cash</span>
                        <span class="font-semibold">{{ peso(countedCash) }}</span>
                    </div>
                    <div v-if="summary" class="flex justify-between text-sm">
                        <span class="text-muted-foreground">Expected cash</span>
                        <span>{{ peso(summary.expected_cash) }}</span>
                    </div>
                    <div v-if="summary" class="flex justify-between font-semibold border-t pt-2">
                        <span>Variance ({{ varianceLabel }})</span>
                        <span
                            :class="[
                                variance === 0
                                    ? 'text-muted-foreground'
                                    : variance > 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-destructive',
                            ]">
                            {{ variance === 0 ? '—' : (variance > 0 ? '+' : '') + peso(variance) }}
                        </span>
                    </div>
                </div>

                <!-- Notes -->
                <div>
                    <label class="mb-1 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Notes (optional)
                    </label>
                    <textarea
                        v-model="notes"
                        rows="2"
                        maxlength="500"
                        placeholder="Any remarks about this shift…"
                        class="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                </div>

                <!-- Error -->
                <p v-if="closeErr" class="text-sm text-destructive">{{ closeErr }}</p>
            </div>

            <!-- Footer -->
            <div class="border-t px-5 py-4 flex gap-3">
                <button
                    class="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    @click="pos.closeModal()">
                    Cancel
                </button>
                <button
                    :disabled="loading || !summary"
                    class="text-white flex-1 rounded-lg bg-destructive py-2.5 text-sm font-semibold hover:bg-destructive/90 disabled:opacity-50 transition-colors"
                    @click="confirmClose">
                    {{ loading ? 'Closing…' : 'Close Shift' }}
                </button>
            </div>
        </div>
    </div>
</template>
