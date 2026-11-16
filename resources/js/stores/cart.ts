import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { DiscountType } from '@/types/models';
import type { CartDiscount, CartItem, CartSummary, PaymentEntry, SeniorPwdInfo } from '@/types/pos';
import { useTax } from '@/composables/useTax';
import { useDiscount } from '@/composables/useDiscount';
import type { Product, Customer } from '@/types/models';

export const useCartStore = defineStore('cart', () => {
    // ── State ────────────────────────────────────────────────────────────
    const items     = ref<CartItem[]>([]);
    const customer  = ref<Customer | null>(null);
    const discount  = ref<CartDiscount>({ type: null, value: 0 });
    const notes     = ref('');
    const seniorPwd = ref<SeniorPwdInfo>({ sc_name: '', sc_id_no: '', pwd_name: '', pwd_id_no: '' });
    const isSeniorPwd = ref(false);
    const forceVatExempt = ref(false);
    const loyaltyRedemption = ref({ points: 0, centavos: 0 });

    // ── Helpers ──────────────────────────────────────────────────────────
    const { calculate: calcVat } = useTax();
    const { calculate: calcDiscount } = useDiscount();

    function computeItem(item: Omit<CartItem, 'discount_amount' | 'line_total' | 'vat_amount'>): CartItem {
        const gross    = item.unit_price * item.quantity;
        const discAmt  = item.discount_type
            ? calcDiscount(item.discount_type, item.discount_value, gross)
            : 0;
        const lineTotal = gross - discAmt;
        const effectiveVatType = forceVatExempt.value && item.vat_type === 'vatable'
            ? 'vat_exempt'
            : item.vat_type;
        const { vatAmount } = calcVat(lineTotal, effectiveVatType);

        return { ...item, discount_amount: discAmt, line_total: lineTotal, vat_amount: vatAmount };
    }

    // ── Computed ─────────────────────────────────────────────────────────
    const computedItems = computed<CartItem[]>(() =>
        items.value.map((item) => computeItem(item)),
    );

    const summary = computed<CartSummary>(() => {
        let subtotal       = 0;
        let vatableSales   = 0;
        let vatExemptSales = 0;
        let zeroRatedSales = 0;
        let vatAmount      = 0;

        for (const item of computedItems.value) {
            subtotal += item.line_total;
            const effectiveType = forceVatExempt.value && item.vat_type === 'vatable'
                ? 'vat_exempt'
                : item.vat_type;
            const { vatBase, vatAmount: vat } = calcVat(item.line_total, effectiveType);

            if (effectiveType === 'vatable') {
                vatableSales += vatBase;
                vatAmount    += vat;
            } else if (effectiveType === 'vat_exempt') {
                vatExemptSales += item.line_total;
            } else {
                zeroRatedSales += item.line_total;
            }
        }

        // Transaction-level discount
        const discountAmount = discount.value.type
            ? calcDiscount(discount.value.type, discount.value.value, subtotal)
            : 0;

        const totalAmount = subtotal - discountAmount;

        return {
            item_count:      items.value.length,
            total_qty:       items.value.reduce((s, i) => s + i.quantity, 0),
            subtotal,
            discount_amount: discountAmount,
            vatable_sales:   vatableSales,
            vat_exempt_sales: vatExemptSales,
            zero_rated_sales: zeroRatedSales,
            vat_amount:      vatAmount,
            total_amount:    totalAmount,
        };
    });

    const isEmpty = computed(() => items.value.length === 0);

    // ── Actions ──────────────────────────────────────────────────────────
    function addItem(product: Pick<Product, 'id' | 'name' | 'sku' | 'barcode' | 'selling_price' | 'cost_price' | 'vat_type' | 'image_path'>, qty = 1) {
        const existing = items.value.find((i) => i.product_id === product.id);
        if (existing) {
            existing.quantity += qty;
            return;
        }

        items.value.push({
            product_id:      product.id,
            product_name:    product.name,
            product_sku:     product.sku,
            product_barcode: product.barcode,
            product_image:   product.image_path ?? null,
            unit_price:      product.selling_price,
            cost_price:      product.cost_price,
            vat_type:        product.vat_type,
            quantity:        qty,
            discount_type:   null,
            discount_value:  0,
            discount_amount: 0,
            line_total:      product.selling_price * qty,
            vat_amount:      0,
        });
    }

    function removeItem(productId: number) {
        const idx = items.value.findIndex((i) => i.product_id === productId);
        if (idx !== -1) items.value.splice(idx, 1);
    }

    function updateQuantity(productId: number, qty: number) {
        if (qty <= 0) {
            removeItem(productId);
            return;
        }
        const item = items.value.find((i) => i.product_id === productId);
        if (item) item.quantity = qty;
    }

    function setItemDiscount(productId: number, type: DiscountType | null, value: number) {
        const item = items.value.find((i) => i.product_id === productId);
        if (item) {
            item.discount_type  = type;
            item.discount_value = value;
        }
    }

    function setDiscount(type: DiscountType | null, value: number) {
        discount.value = { type, value };
    }

    function setCustomer(c: Customer | null) {
        customer.value = c;
        // Apply customer discount if set
        if (c?.discount_rate && c.discount_rate > 0) {
            setDiscount('percentage', c.discount_rate);
        } else if (!c) {
            setDiscount(null, 0);
        }
    }

    function setSeniorPwd(info: SeniorPwdInfo) {
        seniorPwd.value   = info;
        isSeniorPwd.value = !!(info.sc_id_no || info.pwd_id_no);
    }

    function setVatExempt(val: boolean) {
        forceVatExempt.value = val;
    }

    function setLoyaltyRedemption(points: number, centavosPerPoint: number) {
        loyaltyRedemption.value = {
            points,
            centavos: points * centavosPerPoint,
        };
    }

    function clearCart() {
        items.value     = [];
        customer.value  = null;
        discount.value  = { type: null, value: 0 };
        notes.value     = '';
        isSeniorPwd.value       = false;
        forceVatExempt.value    = false;
        loyaltyRedemption.value = { points: 0, centavos: 0 };
        seniorPwd.value = { sc_name: '', sc_id_no: '', pwd_name: '', pwd_id_no: '' };
    }

    function restoreFromHeld(heldItems: CartItem[], heldCustomer: Customer | null) {
        items.value    = heldItems;
        customer.value = heldCustomer;
    }

    return {
        items, customer, discount, notes, seniorPwd, isSeniorPwd, forceVatExempt, loyaltyRedemption,
        computedItems, summary, isEmpty,
        addItem, removeItem, updateQuantity, setItemDiscount,
        setDiscount, setCustomer, setSeniorPwd, setVatExempt, setLoyaltyRedemption,
        clearCart, restoreFromHeld,
    };
});
