<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    BarChart3,
    Box,
    Building2,
    ClipboardList,
    LayoutGrid,
    Package,
    Percent,
    Settings,
    ShoppingCart,
    Tag,
    TrendingUp,
    Users,
    UsersRound,
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
import * as DiscountController from '@/actions/App/Http/Controllers/Admin/DiscountController';
import * as PurchaseOrderController from '@/actions/App/Http/Controllers/Admin/PurchaseOrderController';
import * as ReportController from '@/actions/App/Http/Controllers/Admin/ReportController';
import * as SupplierController from '@/actions/App/Http/Controllers/Admin/SupplierController';
import * as SystemSettingsController from '@/actions/App/Http/Controllers/Admin/SystemSettingsController';
import * as UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard.url(), icon: LayoutGrid },
];

const posNavItems: NavItem[] = [
    { title: 'POS Terminal', href: '/pos', icon: ShoppingCart },
    { title: 'Customers', href: CustomerController.index.url(), icon: Users },
];

const catalogNavItems: NavItem[] = [
    { title: 'Products', href: ProductController.index.url(), icon: Package },
    { title: 'Categories', href: CategoryController.index.url(), icon: Tag },
    { title: 'Discounts', href: DiscountController.index.url(), icon: Percent },
    { title: 'Suppliers', href: SupplierController.index.url(), icon: Building2 },
];

const inventoryNavItems: NavItem[] = [
    { title: 'Stock Overview', href: InventoryController.index.url(), icon: Box },
];

const procurementNavItems: NavItem[] = [
    { title: 'Purchase Orders', href: PurchaseOrderController.index.url(), icon: ClipboardList },
];

const reportNavItems: NavItem[] = [
    { title: 'Sales',    href: ReportController.sales.url(),    icon: TrendingUp },
    { title: 'Products', href: ReportController.products.url(), icon: BarChart3 },
    { title: 'Cashiers', href: ReportController.cashiers.url(), icon: Users },
];

const adminNavItems: NavItem[] = [
    { title: 'Users', href: UserController.index.url(), icon: UsersRound },
    { title: 'Settings', href: SystemSettingsController.index.url(), icon: Settings },
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
            <NavMain :items="catalogNavItems" label="Catalog" />
            <SidebarSeparator />
            <NavMain :items="inventoryNavItems" label="Inventory" />
            <SidebarSeparator />
            <NavMain :items="procurementNavItems" label="Procurement" />
            <SidebarSeparator />
            <NavMain :items="reportNavItems" label="Reports" />
            <SidebarSeparator />
            <NavMain :items="adminNavItems" label="Admin" />
        </SidebarContent>

        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
