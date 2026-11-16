<script setup lang="ts">
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import {
    AlertTriangle,
    BarChart3,
    Box,
    Building2,
    ClipboardList,
    Clock,
    CreditCard,
    DollarSign,
    FileText,
    Gift,
    History,
    LayoutGrid,
    Package,
    Percent,
    Receipt,
    RotateCcw,
    ScrollText,
    Settings,
    ShoppingCart,
    Tag,
    TrendingUp,
    Upload,
    Users,
    UsersRound,
    Wallet,
} from '@lucide/vue';
import AppLogo from '@/components/AppLogo.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import * as CategoryController from '@/actions/App/Http/Controllers/Admin/CategoryController';
import * as CustomerController from '@/actions/App/Http/Controllers/Admin/CustomerController';
import * as InventoryController from '@/actions/App/Http/Controllers/Admin/InventoryController';
import * as ProductController from '@/actions/App/Http/Controllers/Admin/ProductController';
import * as ProductImportController from '@/actions/App/Http/Controllers/Admin/ProductImportController';
import * as DiscountController from '@/actions/App/Http/Controllers/Admin/DiscountController';
import * as ExpenseController from '@/actions/App/Http/Controllers/Admin/ExpenseController';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import * as AuditLogController from '@/actions/App/Http/Controllers/Admin/AuditLogController';
import * as GiftCardController from '@/actions/App/Http/Controllers/Admin/GiftCardController';
import * as LayawayController from '@/actions/App/Http/Controllers/Admin/LayawayController';
import * as PaymentMethodController from '@/actions/App/Http/Controllers/Admin/PaymentMethodController';
import * as PriceHistoryController from '@/actions/App/Http/Controllers/Admin/PriceHistoryController';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';
import * as SaleController from '@/actions/App/Http/Controllers/POS/SaleController';
import * as ShiftController from '@/actions/App/Http/Controllers/Admin/ShiftController';
import * as SupplierController from '@/actions/App/Http/Controllers/Admin/SupplierController';
import * as SystemSettingsController from '@/actions/App/Http/Controllers/Admin/SystemSettingsController';
import * as UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const page = usePage();
const alerts = computed(() => page.props.alerts ?? { low_stock: 0, draft_pos: 0 });

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard.url(), icon: LayoutGrid },
];

const posNavItems: NavItem[] = [
    { title: 'POS Terminal',   href: '/pos',                           icon: ShoppingCart },
    { title: 'Sales History',  href: SaleController.index.url(),       icon: History },
    { title: 'Shifts',         href: ShiftController.index.url(),      icon: Clock },
    { title: 'Customers',      href: CustomerController.index.url(),   icon: Users },
];

const catalogNavItems: NavItem[] = [
    { title: 'Products',          href: ProductController.index.url(),          icon: Package },
    { title: 'Bulk Price Update', href: ProductController.bulkPriceIndex.url(), icon: DollarSign },
    { title: 'Import Products',   href: ProductImportController.create.url(),   icon: Upload },
    { title: 'Price History',     href: PriceHistoryController.index.url(),     icon: History },
    { title: 'Categories',        href: CategoryController.index.url(),         icon: Tag },
    { title: 'Discounts',         href: DiscountController.index.url(),         icon: Percent },
    { title: 'Suppliers',         href: SupplierController.index.url(),         icon: Building2 },
];

const inventoryNavItems = computed((): NavItem[] => [
    { title: 'Stock Overview',    href: InventoryController.index.url(),         icon: Box },
    { title: 'Reorder Dashboard', href: InventoryController.reorder.url(),       icon: AlertTriangle, badge: alerts.value.low_stock || undefined },
    { title: 'Valuation Report',  href: InventoryController.valuation.url(),     icon: DollarSign },
    { title: 'Physical Count',    href: InventoryController.physicalCount.url(), icon: ClipboardList },
]);

const procurementNavItems = computed((): NavItem[] => [
    { title: 'Purchase Orders', href: PurchaseOrderController.index.url(), icon: ClipboardList, badge: alerts.value.draft_pos || undefined },
    { title: 'Expenses',        href: ExpenseController.index.url(),       icon: Wallet },
    { title: 'Layaway',         href: LayawayController.index.url(),       icon: ClipboardList },
    { title: 'Gift Cards',      href: GiftCardController.index.url(),      icon: Gift },
]);

const reportNavItems: NavItem[] = [
    { title: 'Sales',          href: ReportController.sales.url(),       icon: TrendingUp },
    { title: 'Profit & Loss',  href: ReportController.profitLoss.url(),  icon: BarChart3 },
    { title: 'Products',       href: ReportController.products.url(),    icon: Package },
    { title: 'Cashiers',       href: ReportController.cashiers.url(),    icon: Users },
    { title: 'Customers',      href: ReportController.customers.url(),   icon: UsersRound },
    { title: 'VAT Summary',    href: ReportController.tax.url(),         icon: Receipt },
    { title: 'Hourly',         href: ReportController.hourly.url(),      icon: Clock },
    { title: 'Suppliers',      href: ReportController.suppliers.url(),   icon: Building2 },
    { title: 'Refunds',        href: ReportController.refunds.url(),     icon: RotateCcw },
    { title: 'Voids',          href: ReportController.voids.url(),       icon: ScrollText },
    { title: 'BIR Export',     href: ReportController.birExport.url(),   icon: FileText },
];

const adminNavItems: NavItem[] = [
    { title: 'Users',            href: UserController.index.url(),              icon: UsersRound },
    { title: 'Payment Methods',  href: PaymentMethodController.index.url(),     icon: CreditCard },
    { title: 'Audit Log',        href: AuditLogController.index.url(),          icon: ScrollText },
    { title: 'Settings',         href: SystemSettingsController.index.url(),    icon: Settings },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="dashboard.url()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" label="Overview" />
            <SidebarSeparator />
            <NavMain :items="posNavItems" label="Sales" />
            <SidebarSeparator />
            <NavMain :items="catalogNavItems" label="Catalog" collapsible />
            <SidebarSeparator />
            <NavMain :items="inventoryNavItems" label="Inventory" collapsible />
            <SidebarSeparator />
            <NavMain :items="procurementNavItems" label="Procurement" collapsible />
            <SidebarSeparator />
            <NavMain :items="reportNavItems" label="Reports" collapsible />
            <SidebarSeparator />
            <NavMain :items="adminNavItems" label="Admin" />
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
