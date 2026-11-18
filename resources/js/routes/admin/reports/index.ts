import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ReportController::sales
* @see app/Http/Controllers/Admin/ReportController.php:22
* @route '/admin/reports/sales'
*/
export const sales = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sales.url(options),
    method: 'get',
})

sales.definition = {
    methods: ["get","head"],
    url: '/admin/reports/sales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::sales
* @see app/Http/Controllers/Admin/ReportController.php:22
* @route '/admin/reports/sales'
*/
sales.url = (options?: RouteQueryOptions) => {
    return sales.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::sales
* @see app/Http/Controllers/Admin/ReportController.php:22
* @route '/admin/reports/sales'
*/
sales.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sales.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::sales
* @see app/Http/Controllers/Admin/ReportController.php:22
* @route '/admin/reports/sales'
*/
sales.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sales.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::products
* @see app/Http/Controllers/Admin/ReportController.php:75
* @route '/admin/reports/products'
*/
export const products = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: products.url(options),
    method: 'get',
})

products.definition = {
    methods: ["get","head"],
    url: '/admin/reports/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::products
* @see app/Http/Controllers/Admin/ReportController.php:75
* @route '/admin/reports/products'
*/
products.url = (options?: RouteQueryOptions) => {
    return products.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::products
* @see app/Http/Controllers/Admin/ReportController.php:75
* @route '/admin/reports/products'
*/
products.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: products.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::products
* @see app/Http/Controllers/Admin/ReportController.php:75
* @route '/admin/reports/products'
*/
products.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: products.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::cashiers
* @see app/Http/Controllers/Admin/ReportController.php:125
* @route '/admin/reports/cashiers'
*/
export const cashiers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cashiers.url(options),
    method: 'get',
})

cashiers.definition = {
    methods: ["get","head"],
    url: '/admin/reports/cashiers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::cashiers
* @see app/Http/Controllers/Admin/ReportController.php:125
* @route '/admin/reports/cashiers'
*/
cashiers.url = (options?: RouteQueryOptions) => {
    return cashiers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::cashiers
* @see app/Http/Controllers/Admin/ReportController.php:125
* @route '/admin/reports/cashiers'
*/
cashiers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cashiers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::cashiers
* @see app/Http/Controllers/Admin/ReportController.php:125
* @route '/admin/reports/cashiers'
*/
cashiers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cashiers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::customers
* @see app/Http/Controllers/Admin/ReportController.php:401
* @route '/admin/reports/customers'
*/
export const customers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customers.url(options),
    method: 'get',
})

customers.definition = {
    methods: ["get","head"],
    url: '/admin/reports/customers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::customers
* @see app/Http/Controllers/Admin/ReportController.php:401
* @route '/admin/reports/customers'
*/
customers.url = (options?: RouteQueryOptions) => {
    return customers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::customers
* @see app/Http/Controllers/Admin/ReportController.php:401
* @route '/admin/reports/customers'
*/
customers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::customers
* @see app/Http/Controllers/Admin/ReportController.php:401
* @route '/admin/reports/customers'
*/
customers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::tax
* @see app/Http/Controllers/Admin/ReportController.php:345
* @route '/admin/reports/tax'
*/
export const tax = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tax.url(options),
    method: 'get',
})

tax.definition = {
    methods: ["get","head"],
    url: '/admin/reports/tax',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::tax
* @see app/Http/Controllers/Admin/ReportController.php:345
* @route '/admin/reports/tax'
*/
tax.url = (options?: RouteQueryOptions) => {
    return tax.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::tax
* @see app/Http/Controllers/Admin/ReportController.php:345
* @route '/admin/reports/tax'
*/
tax.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tax.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::tax
* @see app/Http/Controllers/Admin/ReportController.php:345
* @route '/admin/reports/tax'
*/
tax.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tax.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::hourly
* @see app/Http/Controllers/Admin/ReportController.php:282
* @route '/admin/reports/hourly'
*/
export const hourly = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hourly.url(options),
    method: 'get',
})

hourly.definition = {
    methods: ["get","head"],
    url: '/admin/reports/hourly',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::hourly
* @see app/Http/Controllers/Admin/ReportController.php:282
* @route '/admin/reports/hourly'
*/
hourly.url = (options?: RouteQueryOptions) => {
    return hourly.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::hourly
* @see app/Http/Controllers/Admin/ReportController.php:282
* @route '/admin/reports/hourly'
*/
hourly.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hourly.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::hourly
* @see app/Http/Controllers/Admin/ReportController.php:282
* @route '/admin/reports/hourly'
*/
hourly.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hourly.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::suppliers
* @see app/Http/Controllers/Admin/ReportController.php:233
* @route '/admin/reports/suppliers'
*/
export const suppliers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: suppliers.url(options),
    method: 'get',
})

suppliers.definition = {
    methods: ["get","head"],
    url: '/admin/reports/suppliers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::suppliers
* @see app/Http/Controllers/Admin/ReportController.php:233
* @route '/admin/reports/suppliers'
*/
suppliers.url = (options?: RouteQueryOptions) => {
    return suppliers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::suppliers
* @see app/Http/Controllers/Admin/ReportController.php:233
* @route '/admin/reports/suppliers'
*/
suppliers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: suppliers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::suppliers
* @see app/Http/Controllers/Admin/ReportController.php:233
* @route '/admin/reports/suppliers'
*/
suppliers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: suppliers.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::refunds
* @see app/Http/Controllers/Admin/ReportController.php:161
* @route '/admin/reports/refunds'
*/
export const refunds = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: refunds.url(options),
    method: 'get',
})

refunds.definition = {
    methods: ["get","head"],
    url: '/admin/reports/refunds',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::refunds
* @see app/Http/Controllers/Admin/ReportController.php:161
* @route '/admin/reports/refunds'
*/
refunds.url = (options?: RouteQueryOptions) => {
    return refunds.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::refunds
* @see app/Http/Controllers/Admin/ReportController.php:161
* @route '/admin/reports/refunds'
*/
refunds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: refunds.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::refunds
* @see app/Http/Controllers/Admin/ReportController.php:161
* @route '/admin/reports/refunds'
*/
refunds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: refunds.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::profitLoss
* @see app/Http/Controllers/Admin/ReportController.php:571
* @route '/admin/reports/profit-loss'
*/
export const profitLoss = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profitLoss.url(options),
    method: 'get',
})

profitLoss.definition = {
    methods: ["get","head"],
    url: '/admin/reports/profit-loss',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::profitLoss
* @see app/Http/Controllers/Admin/ReportController.php:571
* @route '/admin/reports/profit-loss'
*/
profitLoss.url = (options?: RouteQueryOptions) => {
    return profitLoss.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::profitLoss
* @see app/Http/Controllers/Admin/ReportController.php:571
* @route '/admin/reports/profit-loss'
*/
profitLoss.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profitLoss.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::profitLoss
* @see app/Http/Controllers/Admin/ReportController.php:571
* @route '/admin/reports/profit-loss'
*/
profitLoss.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profitLoss.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::voids
* @see app/Http/Controllers/Admin/ReportController.php:463
* @route '/admin/reports/voids'
*/
export const voids = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: voids.url(options),
    method: 'get',
})

voids.definition = {
    methods: ["get","head"],
    url: '/admin/reports/voids',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::voids
* @see app/Http/Controllers/Admin/ReportController.php:463
* @route '/admin/reports/voids'
*/
voids.url = (options?: RouteQueryOptions) => {
    return voids.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::voids
* @see app/Http/Controllers/Admin/ReportController.php:463
* @route '/admin/reports/voids'
*/
voids.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: voids.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::voids
* @see app/Http/Controllers/Admin/ReportController.php:463
* @route '/admin/reports/voids'
*/
voids.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: voids.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::birExport
* @see app/Http/Controllers/Admin/ReportController.php:526
* @route '/admin/reports/bir-export'
*/
export const birExport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: birExport.url(options),
    method: 'get',
})

birExport.definition = {
    methods: ["get","head"],
    url: '/admin/reports/bir-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReportController::birExport
* @see app/Http/Controllers/Admin/ReportController.php:526
* @route '/admin/reports/bir-export'
*/
birExport.url = (options?: RouteQueryOptions) => {
    return birExport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReportController::birExport
* @see app/Http/Controllers/Admin/ReportController.php:526
* @route '/admin/reports/bir-export'
*/
birExport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: birExport.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::birExport
* @see app/Http/Controllers/Admin/ReportController.php:526
* @route '/admin/reports/bir-export'
*/
birExport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: birExport.url(options),
    method: 'head',
})

const reports = {
    sales: Object.assign(sales, sales),
    products: Object.assign(products, products),
    cashiers: Object.assign(cashiers, cashiers),
    customers: Object.assign(customers, customers),
    tax: Object.assign(tax, tax),
    hourly: Object.assign(hourly, hourly),
    suppliers: Object.assign(suppliers, suppliers),
    refunds: Object.assign(refunds, refunds),
    profitLoss: Object.assign(profitLoss, profitLoss),
    voids: Object.assign(voids, voids),
    birExport: Object.assign(birExport, birExport),
}

export default reports