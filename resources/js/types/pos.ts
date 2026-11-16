import type { Customer, DiscountType, PaymentMethodCode, Product, VatType } from './models';

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartItem {
    product_id: number;
    product_name: string;
    product_sku: string;
    product_barcode: string | null;
    product_image?: string | null;
    unit_price: number;        // centavos
    cost_price: number;        // centavos
    vat_type: VatType;
    quantity: number;
    discount_type: DiscountType | null;
    discount_value: number;    // centavos or basis points
    discount_amount: number;   // centavos (computed)
    line_total: number;        // centavos (computed: unit_price * qty - discount)
    vat_amount: number;        // centavos (computed)
}

export interface CartSummary {
    item_count: number;
    total_qty: number;
    subtotal: number;          // sum of line totals
    discount_amount: number;   // transaction-level discount
    vatable_sales: number;     // net VATable amount (excl. VAT)
    vat_exempt_sales: number;
    zero_rated_sales: number;
    vat_amount: number;
    total_amount: number;      // grand total
}

export interface CartDiscount {
    type: DiscountType | null;
    value: number;             // centavos or basis points
}

// ─── Payment ───────────────────────────────────────────────────────────────

export interface PaymentEntry {
    payment_method: PaymentMethodCode;
    amount: number;            // centavos
    reference_number: string | null;
}

// ─── Senior/PWD ────────────────────────────────────────────────────────────

export interface SeniorPwdInfo {
    sc_name: string;
    sc_id_no: string;
    pwd_name: string;
    pwd_id_no: string;
}

// ─── POS Settings ──────────────────────────────────────────────────────────

export interface POSSettings {
    business_name: string;
    receipt_prefix: string;
    vat_inclusive: boolean;
    vat_rate: number;
    currency_symbol: string;
    loyalty_enabled: boolean;
    loyalty_redeem_rate: number; // centavos per point
    max_cashier_disc: number;  // basis points
}

// ─── Checkout Payload ──────────────────────────────────────────────────────

export interface CheckoutPayload {
    items: Array<{
        product_id: number;
        product_name: string;
        product_sku: string;
        product_barcode: string | null;
        unit_price: number;
        cost_price: number;
        vat_type: VatType;
        quantity: number;
        discount_type: DiscountType | null;
        discount_value: number;
    }>;
    payments: PaymentEntry[];
    customer_id: number | null;
    discount_type: DiscountType | null;
    discount_value: number;
    notes: string | null;
    sc_name: string | null;
    sc_id_no: string | null;
    pwd_name: string | null;
    pwd_id_no: string | null;
    redeem_points: number;
}

// ─── Product search result ─────────────────────────────────────────────────

export interface ProductSearchResult extends Omit<Product, 'category'> {
    category?: { id: number; name: string };
}
