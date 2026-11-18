import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Admin\ReportController::sales
* @see app/Http/Controllers/Admin/ReportController.php:22
* @route '/admin/reports/sales'
*/
const salesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sales.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::sales
* @see app/Http/Controllers/Admin/ReportController.php:22
* @route '/admin/reports/sales'
*/
salesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sales.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::sales
* @see app/Http/Controllers/Admin/ReportController.php:22
* @route '/admin/reports/sales'
*/
salesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sales.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sales.form = salesForm

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
* @see \App\Http\Controllers\Admin\ReportController::products
* @see app/Http/Controllers/Admin/ReportController.php:75
* @route '/admin/reports/products'
*/
const productsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: products.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::products
* @see app/Http/Controllers/Admin/ReportController.php:75
* @route '/admin/reports/products'
*/
productsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: products.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::products
* @see app/Http/Controllers/Admin/ReportController.php:75
* @route '/admin/reports/products'
*/
productsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: products.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

products.form = productsForm

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
* @see \App\Http\Controllers\Admin\ReportController::cashiers
* @see app/Http/Controllers/Admin/ReportController.php:125
* @route '/admin/reports/cashiers'
*/
const cashiersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cashiers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::cashiers
* @see app/Http/Controllers/Admin/ReportController.php:125
* @route '/admin/reports/cashiers'
*/
cashiersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cashiers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::cashiers
* @see app/Http/Controllers/Admin/ReportController.php:125
* @route '/admin/reports/cashiers'
*/
cashiersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: cashiers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

cashiers.form = cashiersForm

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
* @see \App\Http\Controllers\Admin\ReportController::customers
* @see app/Http/Controllers/Admin/ReportController.php:401
* @route '/admin/reports/customers'
*/
const customersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: customers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::customers
* @see app/Http/Controllers/Admin/ReportController.php:401
* @route '/admin/reports/customers'
*/
customersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: customers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::customers
* @see app/Http/Controllers/Admin/ReportController.php:401
* @route '/admin/reports/customers'
*/
customersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: customers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

customers.form = customersForm

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
* @see \App\Http\Controllers\Admin\ReportController::tax
* @see app/Http/Controllers/Admin/ReportController.php:345
* @route '/admin/reports/tax'
*/
const taxForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tax.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::tax
* @see app/Http/Controllers/Admin/ReportController.php:345
* @route '/admin/reports/tax'
*/
taxForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tax.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::tax
* @see app/Http/Controllers/Admin/ReportController.php:345
* @route '/admin/reports/tax'
*/
taxForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tax.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tax.form = taxForm

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
* @see \App\Http\Controllers\Admin\ReportController::hourly
* @see app/Http/Controllers/Admin/ReportController.php:282
* @route '/admin/reports/hourly'
*/
const hourlyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hourly.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::hourly
* @see app/Http/Controllers/Admin/ReportController.php:282
* @route '/admin/reports/hourly'
*/
hourlyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hourly.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::hourly
* @see app/Http/Controllers/Admin/ReportController.php:282
* @route '/admin/reports/hourly'
*/
hourlyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hourly.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

hourly.form = hourlyForm

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
* @see \App\Http\Controllers\Admin\ReportController::suppliers
* @see app/Http/Controllers/Admin/ReportController.php:233
* @route '/admin/reports/suppliers'
*/
const suppliersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: suppliers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::suppliers
* @see app/Http/Controllers/Admin/ReportController.php:233
* @route '/admin/reports/suppliers'
*/
suppliersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: suppliers.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::suppliers
* @see app/Http/Controllers/Admin/ReportController.php:233
* @route '/admin/reports/suppliers'
*/
suppliersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: suppliers.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

suppliers.form = suppliersForm

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
* @see \App\Http\Controllers\Admin\ReportController::refunds
* @see app/Http/Controllers/Admin/ReportController.php:161
* @route '/admin/reports/refunds'
*/
const refundsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: refunds.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::refunds
* @see app/Http/Controllers/Admin/ReportController.php:161
* @route '/admin/reports/refunds'
*/
refundsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: refunds.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::refunds
* @see app/Http/Controllers/Admin/ReportController.php:161
* @route '/admin/reports/refunds'
*/
refundsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: refunds.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

refunds.form = refundsForm

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
* @see \App\Http\Controllers\Admin\ReportController::profitLoss
* @see app/Http/Controllers/Admin/ReportController.php:571
* @route '/admin/reports/profit-loss'
*/
const profitLossForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profitLoss.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::profitLoss
* @see app/Http/Controllers/Admin/ReportController.php:571
* @route '/admin/reports/profit-loss'
*/
profitLossForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profitLoss.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::profitLoss
* @see app/Http/Controllers/Admin/ReportController.php:571
* @route '/admin/reports/profit-loss'
*/
profitLossForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: profitLoss.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

profitLoss.form = profitLossForm

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
* @see \App\Http\Controllers\Admin\ReportController::voids
* @see app/Http/Controllers/Admin/ReportController.php:463
* @route '/admin/reports/voids'
*/
const voidsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: voids.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::voids
* @see app/Http/Controllers/Admin/ReportController.php:463
* @route '/admin/reports/voids'
*/
voidsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: voids.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::voids
* @see app/Http/Controllers/Admin/ReportController.php:463
* @route '/admin/reports/voids'
*/
voidsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: voids.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

voids.form = voidsForm

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

/**
* @see \App\Http\Controllers\Admin\ReportController::birExport
* @see app/Http/Controllers/Admin/ReportController.php:526
* @route '/admin/reports/bir-export'
*/
const birExportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: birExport.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::birExport
* @see app/Http/Controllers/Admin/ReportController.php:526
* @route '/admin/reports/bir-export'
*/
birExportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: birExport.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ReportController::birExport
* @see app/Http/Controllers/Admin/ReportController.php:526
* @route '/admin/reports/bir-export'
*/
birExportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: birExport.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

birExport.form = birExportForm

const ReportController = { sales, products, cashiers, customers, tax, hourly, suppliers, refunds, profitLoss, voids, birExport }

export default ReportController