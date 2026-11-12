import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PaymentMethod, Sale, Shift } from '@/types/models';

type ModalType = 'payment' | 'hold' | 'discount' | 'supervisor' | 'refund' | 'senior-pwd' | null;

export const usePosStore = defineStore('pos', () => {
    // ── Shift ────────────────────────────────────────────────────────────
    const shift          = ref<Shift | null>(null);
    const paymentMethods = ref<PaymentMethod[]>([]);

    // ── UI state ─────────────────────────────────────────────────────────
    const activeModal    = ref<ModalType>(null);
    const isProcessing   = ref(false);
    const lastCompletedSale = ref<Sale | null>(null);

    // Supervisor auth
    const pendingAction  = ref<(() => void) | null>(null);
    const supervisorMessage = ref('');

    // ── Actions ──────────────────────────────────────────────────────────
    function openModal(modal: ModalType) {
        activeModal.value = modal;
    }

    function closeModal() {
        activeModal.value = null;
    }

    function requireSupervisor(action: () => void, message = 'Supervisor authorization required.') {
        pendingAction.value     = action;
        supervisorMessage.value = message;
        openModal('supervisor');
    }

    function supervisorApproved() {
        const fn = pendingAction.value;
        pendingAction.value = null;
        closeModal();
        fn?.();
    }

    function supervisorDenied() {
        pendingAction.value = null;
        closeModal();
    }

    function setShift(s: Shift | null) {
        shift.value = s;
    }

    function setSaleCompleted(sale: Sale) {
        lastCompletedSale.value = sale;
        isProcessing.value      = false;
    }

    return {
        shift, paymentMethods, activeModal, isProcessing,
        lastCompletedSale, pendingAction, supervisorMessage,
        openModal, closeModal, requireSupervisor,
        supervisorApproved, supervisorDenied, setShift, setSaleCompleted,
    };
});
