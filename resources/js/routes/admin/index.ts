import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import categories from './categories'
import products from './products'
import customers from './customers'
import users from './users'
import suppliers from './suppliers'
import discounts from './discounts'
import purchases from './purchases'
import expenses from './expenses'
import reports from './reports'
import layaway from './layaway'
import giftCards from './gift-cards'
import shifts from './shifts'
import audit from './audit'
import priceHistory from './price-history'
import paymentMethods from './payment-methods'
import settings from './settings'
import inventory from './inventory'
/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/admin/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

const admin = {
    categories: Object.assign(categories, categories),
    products: Object.assign(products, products),
    customers: Object.assign(customers, customers),
    users: Object.assign(users, users),
    suppliers: Object.assign(suppliers, suppliers),
    discounts: Object.assign(discounts, discounts),
    purchases: Object.assign(purchases, purchases),
    expenses: Object.assign(expenses, expenses),
    reports: Object.assign(reports, reports),
    layaway: Object.assign(layaway, layaway),
    giftCards: Object.assign(giftCards, giftCards),
    shifts: Object.assign(shifts, shifts),
    audit: Object.assign(audit, audit),
    priceHistory: Object.assign(priceHistory, priceHistory),
    paymentMethods: Object.assign(paymentMethods, paymentMethods),
    search: Object.assign(search, search),
    settings: Object.assign(settings, settings),
    inventory: Object.assign(inventory, inventory),
}

export default admin