<script setup lang="ts">
import { computed, ref } from 'vue';

interface DayData {
    date: string;
    label: string;
    is_today: boolean;
    revenue: number;
    transactions: number;
}

const props = defineProps<{
    data: DayData[];
}>();

// ── Layout constants ──────────────────────────────────────────────────────────
const W          = 560;
const H          = 180;
const PAD_LEFT   = 8;
const PAD_RIGHT  = 8;
const PAD_TOP    = 36;   // room for value labels above bars
const PAD_BOTTOM = 24;   // room for day labels

const chartW = W - PAD_LEFT - PAD_RIGHT;
const chartH = H - PAD_TOP - PAD_BOTTOM;

const count    = props.data.length;         // 7
const slotW    = chartW / count;
const barW     = slotW * 0.55;
const barOff   = (slotW - barW) / 2;

// ── Computed ──────────────────────────────────────────────────────────────────
const maxRevenue = computed(() => Math.max(...props.data.map(d => d.revenue), 1));
const hasData    = computed(() => props.data.some(d => d.revenue > 0));

const gridLines = computed(() => [0.25, 0.5, 0.75, 1].map(pct => ({
    y: PAD_TOP + chartH - pct * chartH,
})));

interface Bar extends DayData {
    x: number;
    barX: number;
    barY: number;
    barH: number;
    labelX: number;
}

const bars = computed((): Bar[] =>
    props.data.map((d, i) => {
        const pct    = d.revenue / maxRevenue.value;
        const barH   = Math.max(pct > 0 ? 4 : 0, pct * chartH);
        const barY   = PAD_TOP + chartH - barH;
        const slotX  = PAD_LEFT + i * slotW;
        return {
            ...d,
            x:       slotX,
            barX:    slotX + barOff,
            barY,
            barH,
            labelX:  slotX + slotW / 2,
        };
    }),
);

// ── Hover tooltip ─────────────────────────────────────────────────────────────
const hoveredIdx = ref<number | null>(null);

function peso(c: number): string {
    if (c === 0) return '—';
    const val = c / 100;
    if (val >= 1_000_000) return `₱${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000)     return `₱${(val / 1_000).toFixed(1)}K`;
    return `₱${val.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function pesoFull(c: number): string {
    return `₱${(c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}
</script>

<template>
    <div class="relative w-full select-none">
        <svg
            :viewBox="`0 0 ${W} ${H}`"
            class="w-full overflow-visible"
            aria-label="7-day revenue chart"
        >
            <!-- Grid lines -->
            <line
                v-for="(gl, i) in gridLines"
                :key="i"
                :x1="PAD_LEFT"
                :y1="gl.y"
                :x2="W - PAD_RIGHT"
                :y2="gl.y"
                stroke="currentColor"
                stroke-width="0.5"
                class="text-border opacity-50"
                stroke-dasharray="4 3"
            />

            <!-- Bars -->
            <g v-for="(bar, idx) in bars" :key="bar.date">
                <!-- Hit area for hover -->
                <rect
                    :x="bar.x"
                    :y="PAD_TOP"
                    :width="slotW"
                    :height="chartH"
                    fill="transparent"
                    class="cursor-pointer"
                    @mouseenter="hoveredIdx = idx"
                    @mouseleave="hoveredIdx = null"
                />

                <!-- Bar fill -->
                <rect
                    :x="bar.barX"
                    :y="bar.barY"
                    :width="barW"
                    :height="bar.barH"
                    rx="3"
                    :class="[
                        'transition-all duration-200',
                        bar.is_today
                            ? 'fill-primary'
                            : hoveredIdx === idx
                                ? 'fill-primary/70'
                                : 'fill-primary/40',
                    ]"
                />

                <!-- Value label above bar -->
                <text
                    v-if="bar.revenue > 0"
                    :x="bar.labelX"
                    :y="bar.barY - 5"
                    text-anchor="middle"
                    class="fill-foreground text-[9px] font-medium"
                    :class="hoveredIdx === idx || bar.is_today ? 'opacity-100' : 'opacity-60'"
                    style="font-size: 9px; font-family: inherit;"
                >{{ peso(bar.revenue) }}</text>

                <!-- Day label below chart -->
                <text
                    :x="bar.labelX"
                    :y="PAD_TOP + chartH + 16"
                    text-anchor="middle"
                    :class="[
                        'text-[10px] font-medium',
                        bar.is_today ? 'fill-primary' : 'fill-muted-foreground',
                    ]"
                    style="font-size: 10px; font-family: inherit;"
                >{{ bar.is_today ? 'Today' : bar.label }}</text>
            </g>

            <!-- Empty state overlay -->
            <text
                v-if="!hasData"
                :x="W / 2"
                :y="H / 2"
                text-anchor="middle"
                class="fill-muted-foreground"
                style="font-size: 12px; font-family: inherit;"
            >No sales data yet</text>
        </svg>

        <!-- Hover tooltip -->
        <Transition name="fade">
            <div
                v-if="hoveredIdx !== null && bars[hoveredIdx]"
                class="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 rounded-lg border bg-popover px-3 py-2 text-xs shadow-md z-10 whitespace-nowrap"
            >
                <p class="font-semibold">{{ bars[hoveredIdx].is_today ? 'Today' : bars[hoveredIdx].label }} · {{ bars[hoveredIdx].date }}</p>
                <p class="text-muted-foreground">{{ pesoFull(bars[hoveredIdx].revenue) }}</p>
                <p class="text-muted-foreground">{{ bars[hoveredIdx].transactions }} transaction{{ bars[hoveredIdx].transactions === 1 ? '' : 's' }}</p>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.1s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
