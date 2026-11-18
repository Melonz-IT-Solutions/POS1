import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import products from './products'
import customers from './customers'
import shifts from './shifts'
import sales from './sales'
/**
* @see \App\Http\Controllers\POS\POSScreenController::index
* @see app/Http/Controllers/POS/POSScreenController.php:15
* @route '/pos'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\POSScreenController::index
* @see app/Http/Controllers/POS/POSScreenController.php:15
* @route '/pos'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\POSScreenController::index
* @see app/Http/Controllers/POS/POSScreenController.php:15
* @route '/pos'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\POSScreenController::index
* @see app/Http/Controllers/POS/POSScreenController.php:15
* @route '/pos'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const pos = {
    index: Object.assign(index, index),
    products: Object.assign(products, products),
    customers: Object.assign(customers, customers),
    shifts: Object.assign(shifts, shifts),
    sales: Object.assign(sales, sales),
}

export default pos