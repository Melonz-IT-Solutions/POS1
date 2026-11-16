<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { usePosStore } from '@/stores/pos';

const cart = useCartStore();
const pos  = usePosStore();

// ── Beneficiary type ───────────────────────────────────────────────────────
type BeneficiaryType = 'sc' | 'pwd' | 'both';
const beneficiaryType = ref<BeneficiaryType>(
    cart.seniorPwd.sc_id_no ? (cart.seniorPwd.pwd_id_no ? 'both' : 'sc') : 'pwd'
);

// ── Form fields ────────────────────────────────────────────────────────────
const scName  = ref(cart.seniorPwd.sc_name);
const scIdNo  = ref(cart.seniorPwd.sc_id_no);
const pwdName = ref(cart.seniorPwd.pwd_name);
const pwdIdNo = ref(cart.seniorPwd.pwd_id_no);

const showSc  = computed(() => beneficiaryType.value === 'sc'  || beneficiaryType.value === 'both');
const showPwd = computed(() => beneficiaryType.value === 'pwd' || beneficiaryType.value === 'both');

// Clear fields when type changes so stale data isn't sent
watch(beneficiaryType, (type) => {
    if (type !== 'sc'   && type !== 'both') { scName.value  = ''; scIdNo.value  = ''; }
    if (type !== 'pwd'  && type !== 'both') { pwdName.value = ''; pwdIdNo.value = ''; }
});

// ── Validation ─────────────────────────────────────────────────────────────
const scValid  = computed(() => !showSc.value  || (scName.value.trim().length >= 2  && scIdNo.value.trim().length >= 2));
const pwdValid = computed(() => !showPwd.value || (pwdName.value.trim().length >= 2 && pwdIdNo.value.trim().length >= 2));
const canApply = computed(() => scValid.value && pwdValid.value);

// ── Philippine SC/PWD discount: 20% + VAT exemption ───────────────────────
// Legal basis: RA 9994 (SC), RA 10754 (PWD)
// 20% discount on the net price (VAT-exclusive) for VAT-registered businesses
// We apply 20% cart-level discount and force all VATable items to VAT-exempt

function apply() {
    cart.setSeniorPwd({
        sc_name:  scName.value.trim(),
        sc_id_no: scIdNo.value.trim(),
        pwd_name: pwdName.value.trim(),
        pwd_id_no: pwdIdNo.value.trim(),
    });
    cart.setDiscount('percentage', 2000);  // 2000 basis points = 20%
    cart.setVatExempt(true);
    pos.closeModal();
}

function clear() {
    cart.setSeniorPwd({ sc_name: '', sc_id_no: '', pwd_name: '', pwd_id_no: '' });
    cart.setDiscount(null, 0);
    cart.setVatExempt(false);
    pos.closeModal();
}

const isAlreadyApplied = computed(() => cart.isSeniorPwd);
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div class="bg-background w-full max-w-md rounded-2xl border shadow-2xl">

            <!-- Header -->
            <div class="flex items-center justify-between border-b px-5 py-4">
                <div>
                    <h2 class="font-semibold text-base">Senior Citizen / PWD Discount</h2>
                    <p class="text-muted-foreground text-xs mt-0.5">20% discount + VAT exemption (RA 9994 / RA 10754)</p>
                </div>
                <button
                    class="text-muted-foreground hover:text-foreground transition-colors"
                    @click="pos.closeModal()">
                    ✕
                </button>
            </div>

            <div class="px-5 py-4 space-y-5">

                <!-- Currently applied banner -->
                <div v-if="isAlreadyApplied" class="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3">
                    <span class="text-emerald-600 font-semibold text-sm">SC/PWD discount is currently applied.</span>
                    <button
                        class="ml-auto text-xs text-destructive hover:underline"
                        @click="clear">
                        Remove
                    </button>
                </div>

                <!-- Beneficiary type selector -->
                <div>
                    <label class="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Beneficiary Type
                    </label>
                    <div class="grid grid-cols-3 gap-2">
                        <button
                            v-for="opt in [
                                { value: 'sc',   label: 'Senior Citizen' },
                                { value: 'pwd',  label: 'PWD' },
                                { value: 'both', label: 'Both' },
                            ]"
                            :key="opt.value"
                            class="rounded-lg border py-2.5 text-sm font-medium transition-colors"
                            :class="beneficiaryType === opt.value
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'hover:bg-muted'"
                            @click="beneficiaryType = opt.value as BeneficiaryType"
                        >
                            {{ opt.label }}
                        </button>
                    </div>
                </div>

                <!-- Senior Citizen fields -->
                <div v-if="showSc" class="space-y-3">
                    <div class="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1">
                        Senior Citizen
                    </div>
                    <div>
                        <label class="mb-1 block text-xs text-muted-foreground">Full Name</label>
                        <input
                            v-model="scName"
                            type="text"
                            placeholder="e.g. Juan Dela Cruz"
                            class="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label class="mb-1 block text-xs text-muted-foreground">Senior Citizen ID No.</label>
                        <input
                            v-model="scIdNo"
                            type="text"
                            placeholder="e.g. OSCA-123456"
                            class="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <!-- PWD fields -->
                <div v-if="showPwd" class="space-y-3">
                    <div class="text-xs font-semibold uppercase tracking-wide text-muted-foreground border-b pb-1">
                        Person with Disability (PWD)
                    </div>
                    <div>
                        <label class="mb-1 block text-xs text-muted-foreground">Full Name</label>
                        <input
                            v-model="pwdName"
                            type="text"
                            placeholder="e.g. Maria Santos"
                            class="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label class="mb-1 block text-xs text-muted-foreground">PWD ID No.</label>
                        <input
                            v-model="pwdIdNo"
                            type="text"
                            placeholder="e.g. PWD-2024-00001"
                            class="border-input bg-background w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <!-- Discount preview -->
                <div class="rounded-lg bg-muted/40 border px-4 py-3 text-xs space-y-1">
                    <p class="font-semibold text-sm mb-1">What will be applied</p>
                    <div class="flex items-center gap-2">
                        <span class="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                        <span>20% discount on the total order</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                        <span>VAT-exempt (removes 12% VAT from VATable items)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                        <span>Beneficiary info printed on receipt</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="border-t px-5 py-4 flex gap-3">
                <button
                    class="flex-1 rounded-lg border py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                    @click="pos.closeModal()">
                    Cancel
                </button>
                <button
                    :disabled="!canApply"
                    class="flex-1 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    @click="apply">
                    Apply SC/PWD Discount
                </button>
            </div>
        </div>
    </div>
</template>
