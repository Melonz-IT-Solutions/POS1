import CategoryController from './CategoryController'
import ProductImportController from './ProductImportController'
import ProductController from './ProductController'
import CustomerImportController from './CustomerImportController'
import CustomerController from './CustomerController'
import UserController from './UserController'
import SupplierController from './SupplierController'
import DiscountController from './DiscountController'
import PurchaseOrderController from './PurchaseOrderController'
import ExpenseController from './ExpenseController'
import ReportController from './ReportController'
import LayawayController from './LayawayController'
import GiftCardController from './GiftCardController'
import ShiftController from './ShiftController'
import AuditLogController from './AuditLogController'
import PriceHistoryController from './PriceHistoryController'
import PaymentMethodController from './PaymentMethodController'
import SearchController from './SearchController'
import SystemSettingsController from './SystemSettingsController'
import InventoryController from './InventoryController'

const Admin = {
    CategoryController: Object.assign(CategoryController, CategoryController),
    ProductImportController: Object.assign(ProductImportController, ProductImportController),
    ProductController: Object.assign(ProductController, ProductController),
    CustomerImportController: Object.assign(CustomerImportController, CustomerImportController),
    CustomerController: Object.assign(CustomerController, CustomerController),
    UserController: Object.assign(UserController, UserController),
    SupplierController: Object.assign(SupplierController, SupplierController),
    DiscountController: Object.assign(DiscountController, DiscountController),
    PurchaseOrderController: Object.assign(PurchaseOrderController, PurchaseOrderController),
    ExpenseController: Object.assign(ExpenseController, ExpenseController),
    ReportController: Object.assign(ReportController, ReportController),
    LayawayController: Object.assign(LayawayController, LayawayController),
    GiftCardController: Object.assign(GiftCardController, GiftCardController),
    ShiftController: Object.assign(ShiftController, ShiftController),
    AuditLogController: Object.assign(AuditLogController, AuditLogController),
    PriceHistoryController: Object.assign(PriceHistoryController, PriceHistoryController),
    PaymentMethodController: Object.assign(PaymentMethodController, PaymentMethodController),
    SearchController: Object.assign(SearchController, SearchController),
    SystemSettingsController: Object.assign(SystemSettingsController, SystemSettingsController),
    InventoryController: Object.assign(InventoryController, InventoryController),
}

export default Admin