// ─── Enums ─────────────────────────────────────────────────────────────────

export type VatType = 'vatable' | 'vat_exempt' | 'zero_rated';
export type SaleStatus = 'completed' | 'held' | 'void' | 'refunded' | 'partially_refunded';
export type StockMovementType =
    | 'sale'
    | 'refund'
    | 'void'
    | 'purchase_receipt'
    | 'manual_adjustment'
    | 'damage_loss'
    | 'initial_stock';
export type PaymentMethodCode = 'cash' | 'card' | 'gcash' | 'maya' | string;
export type DiscountType = 'percentage' | 'fixed';
export type ShiftStatus = 'open' | 'closed';
export type PurchaseOrderStatus = 'draft' | 'ordered' | 'partially_received' | 'received' | 'cancelled';

// ─── Models ────────────────────────────────────────────────────────────────

export interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    roles: Role[];
    permissions: Permission[];
    created_at: string;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
    is_active: boolean;
    sort_order: number;
    children?: Category[];
    products_count?: number;
    deleted_at?: string | null;
}

export interface Product {
    id: number;
    category_id: number | null;
    name: string;
    description: string | null;
    sku: string;
    barcode: string | null;
    unit_of_measure: string;
    cost_price: number;        // centavos
    selling_price: number;     // centavos
    vat_type: VatType;
    stock_quantity: number;
    minimum_stock: number;
    is_active: boolean;
    is_bundle: boolean;
    image_path: string | null;
    category?: Category;
    bundleItems?: ProductBundleItem[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ProductBundleItem {
    id: number;
    bundle_id: number;
    component_id: number;
    quantity: number;
    component?: Pick<Product, 'id' | 'name' | 'sku' | 'selling_price'>;
}

export interface Customer {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    discount_rate: number;     // basis points, e.g., 500 = 5%
    loyalty_points: number;
    is_active: boolean;
    created_at: string;
    deleted_at: string | null;
}

export interface Discount {
    id: number;
    name: string;
    code: string | null;
    type: DiscountType;
    value: number;        // basis points (if percentage) or centavos (if fixed)
    min_purchase: number; // centavos
    start_at: string | null;
    end_at: string | null;
    is_active: boolean;
    scope: 'all' | 'products' | 'categories' | 'customers';
    products?: Pick<Product, 'id' | 'name' | 'sku'>[];
    categories?: Pick<Category, 'id' | 'name'>[];
    customers?: Pick<Customer, 'id' | 'name' | 'phone'>[];
    deleted_at: string | null;
    created_at: string;
}

export interface Supplier {
    id: number;
    company_name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    tin: string | null;
    is_active: boolean;
    products?: Pick<Product, 'id' | 'name' | 'sku'>[];
    products_count?: number;
    deleted_at: string | null;
    created_at: string;
}

export interface PaymentMethod {
    id: number;
    name: string;
    code: PaymentMethodCode;
    type: 'cash' | 'card' | 'digital_wallet' | 'other';
    requires_reference: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

export interface Shift {
    id: number;
    cashier_id: number;
    opened_at: string;
    closed_at: string | null;
    opening_float: number;      // centavos
    closing_cash: number | null;
    expected_cash: number | null;
    over_short: number | null;
    status: ShiftStatus;
    notes: string | null;
    cashier?: User;
}

export interface Sale {
    id: number;
    receipt_number: string;
    customer_id: number | null;
    cashier_id: number;
    shift_id: number | null;
    status: SaleStatus;
    subtotal: number;
    discount_type: DiscountType | null;
    discount_value: number;
    discount_amount: number;
    vatable_sales: number;
    vat_exempt_sales: number;
    zero_rated_sales: number;
    vat_amount: number;
    total_amount: number;
    amount_tendered: number;
    change_amount: number;
    notes: string | null;
    sc_name: string | null;
    sc_id_no: string | null;
    pwd_name: string | null;
    pwd_id_no: string | null;
    parked_at: string | null;
    voided_at: string | null;
    void_reason: string | null;
    created_at: string;
    items?: SaleItem[];
    payments?: SalePayment[];
    customer?: Customer;
    cashier?: User;
}

export interface SaleItem {
    id: number;
    sale_id: number;
    product_id: number | null;
    product_name: string;
    product_sku: string;
    product_barcode: string | null;
    vat_type: VatType;
    unit_price: number;
    cost_price: number;
    quantity: number;
    discount_type: DiscountType | null;
    discount_value: number;
    discount_amount: number;
    line_total: number;
    vat_amount: number;
}

export interface SalePayment {
    id: number;
    sale_id: number;
    payment_method: PaymentMethodCode;
    amount: number;
    reference_number: string | null;
}

export interface LoyaltyTransaction {
    id: number;
    customer_id: number;
    sale_id: number | null;
    type: 'earn' | 'redeem' | 'adjust' | string;
    points: number;
    running_balance: number;
    description: string | null;
    created_at: string;
}

export interface StockMovement {
    id: number;
    product_id: number;
    type: StockMovementType;
    quantity: number;
    quantity_before: number;
    quantity_after: number;
    unit_cost: number;
    reference_type: string | null;
    reference_id: number | null;
    reason: string | null;
    user_id: number;
    created_at: string;
    product?: Product;
    user?: User;
}

export interface AuditLog {
    id: number;
    user_id: number | null;
    action: string;
    auditable_type: string | null;
    auditable_id: number | null;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    ip_address: string | null;
    created_at: string;
    user?: User;
}

export interface Setting {
    key: string;
    group: string;
    label: string | null;
    value: string | null;
}

export interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier_id: number;
    status: PurchaseOrderStatus;
    ordered_by: number;
    expected_date: string | null;
    notes: string | null;
    subtotal: number;             // centavos
    supplier?: Pick<Supplier, 'id' | 'company_name' | 'contact_person' | 'phone' | 'email'>;
    orderedBy?: Pick<User, 'id' | 'name'>;
    items?: PurchaseOrderItem[];
    receipts?: PurchaseReceipt[];
    items_count?: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface PurchaseOrderItem {
    id: number;
    purchase_order_id: number;
    product_id: number;
    quantity_ordered: number;
    quantity_received: number;
    unit_cost: number;            // centavos
    total_cost: number;           // centavos
    product?: Pick<Product, 'id' | 'name' | 'sku'>;
}

export interface PurchaseReceipt {
    id: number;
    purchase_order_id: number;
    received_by: number;
    received_at: string;
    notes: string | null;
    receivedBy?: Pick<User, 'id' | 'name'>;
    items?: PurchaseReceiptItem[];
    created_at: string;
}

export interface PurchaseReceiptItem {
    id: number;
    purchase_receipt_id: number;
    purchase_order_item_id: number;
    product_id: number;
    quantity_received: number;
    unit_cost: number;
    product?: Pick<Product, 'id' | 'name' | 'sku'>;
}

// ─── Layaway ──────────────────────────────────────────────────────────────

export interface Layaway {
    id: number;
    layaway_number: string;
    customer_id: number;
    total_amount: number;      // centavos
    deposit_paid: number;      // centavos
    balance: number;           // centavos
    due_date: string | null;
    status: 'active' | 'completed' | 'cancelled';
    notes: string | null;
    created_by: number;
    completed_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    customer?: Pick<Customer, 'id' | 'name' | 'phone' | 'email'>;
    creator?: Pick<User, 'id' | 'name'>;
    items?: LayawayItem[];
    payments?: LayawayPayment[];
}

export interface LayawayItem {
    id: number;
    layaway_id: number;
    product_id: number | null;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;       // centavos
    total: number;            // centavos
}

export interface LayawayPayment {
    id: number;
    layaway_id: number;
    amount: number;            // centavos
    payment_method: string;
    reference: string | null;
    received_by: number;
    notes: string | null;
    created_at: string;
    receiver?: Pick<User, 'id' | 'name'>;
}

// ─── Gift Cards ───────────────────────────────────────────────────────────

export interface GiftCard {
    id: number;
    code: string;
    initial_value: number;    // centavos
    current_balance: number;  // centavos
    issued_to: string | null;
    customer_id: number | null;
    status: 'active' | 'depleted' | 'cancelled' | 'expired';
    expires_at: string | null;
    issued_by: number;
    notes: string | null;
    created_at: string;
    issuer?: Pick<User, 'id' | 'name'>;
    customer?: Pick<Customer, 'id' | 'name' | 'phone'>;
    transactions?: GiftCardTransaction[];
}

export interface GiftCardTransaction {
    id: number;
    gift_card_id: number;
    type: 'issue' | 'redeem' | 'cancel' | 'adjust';
    amount: number;            // centavos (negative for deductions)
    balance_before: number;
    balance_after: number;
    sale_id: number | null;
    processed_by: number;
    notes: string | null;
    created_at: string;
    processor?: Pick<User, 'id' | 'name'>;
}

// ─── Expense ──────────────────────────────────────────────────────────────

export interface Expense {
    id: number;
    category: string;
    description: string;
    amount: number;
    expense_date: string;
    reference: string | null;
    shift_id: number | null;
    recorded_by: number;
    notes: string | null;
    recorder?: Pick<User, 'id' | 'name'>;
    created_at: string;
    updated_at: string;
}

// ─── Paginated Response ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}
