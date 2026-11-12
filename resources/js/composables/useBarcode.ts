import { onMounted, onUnmounted, ref } from 'vue';

interface UseBarcodeOptions {
    onScan: (barcode: string) => void;
    minLength?: number;
    timeout?: number;    // ms of inactivity to clear buffer
    enabled?: () => boolean;
}

export function useBarcode(options: UseBarcodeOptions) {
    const { onScan, minLength = 3, timeout = 100, enabled } = options;

    let buffer = '';
    let timer: ReturnType<typeof setTimeout> | null = null;

    function handleKeydown(event: KeyboardEvent) {
        // Skip if a form input is focused (allow normal typing in inputs)
        const target = event.target as HTMLElement;
        const tag = target.tagName.toLowerCase();
        if (['input', 'textarea', 'select'].includes(tag) && !target.classList.contains('barcode-target')) {
            return;
        }

        if (enabled && !enabled()) {
            return;
        }

        if (timer) {
            clearTimeout(timer);
        }

        if (event.key === 'Enter') {
            if (buffer.length >= minLength) {
                onScan(buffer.trim());
            }
            buffer = '';
            return;
        }

        if (event.key.length === 1) {
            buffer += event.key;
        }

        // If no Enter comes within `timeout` ms, it's keyboard input, not scanner
        timer = setTimeout(() => {
            buffer = '';
        }, timeout);
    }

    onMounted(() => window.addEventListener('keydown', handleKeydown));
    onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
}
