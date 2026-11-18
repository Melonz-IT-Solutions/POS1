import POSScreenController from './POSScreenController'
import ProductLookupController from './ProductLookupController'
import CustomerLookupController from './CustomerLookupController'
import ShiftController from './ShiftController'
import SaleController from './SaleController'

const POS = {
    POSScreenController: Object.assign(POSScreenController, POSScreenController),
    ProductLookupController: Object.assign(ProductLookupController, ProductLookupController),
    CustomerLookupController: Object.assign(CustomerLookupController, CustomerLookupController),
    ShiftController: Object.assign(ShiftController, ShiftController),
    SaleController: Object.assign(SaleController, SaleController),
}

export default POS