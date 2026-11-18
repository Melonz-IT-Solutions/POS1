import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\POS\ProductLookupController::search
* @see app/Http/Controllers/POS/ProductLookupController.php:15
* @route '/pos/products/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/pos/products/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\ProductLookupController::search
* @see app/Http/Controllers/POS/ProductLookupController.php:15
* @route '/pos/products/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ProductLookupController::search
* @see app/Http/Controllers/POS/ProductLookupController.php:15
* @route '/pos/products/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ProductLookupController::search
* @see app/Http/Controllers/POS/ProductLookupController.php:15
* @route '/pos/products/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\ProductLookupController::browse
* @see app/Http/Controllers/POS/ProductLookupController.php:26
* @route '/pos/products/browse'
*/
export const browse = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: browse.url(options),
    method: 'get',
})

browse.definition = {
    methods: ["get","head"],
    url: '/pos/products/browse',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\ProductLookupController::browse
* @see app/Http/Controllers/POS/ProductLookupController.php:26
* @route '/pos/products/browse'
*/
browse.url = (options?: RouteQueryOptions) => {
    return browse.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ProductLookupController::browse
* @see app/Http/Controllers/POS/ProductLookupController.php:26
* @route '/pos/products/browse'
*/
browse.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: browse.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ProductLookupController::browse
* @see app/Http/Controllers/POS/ProductLookupController.php:26
* @route '/pos/products/browse'
*/
browse.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: browse.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\ProductLookupController::barcode
* @see app/Http/Controllers/POS/ProductLookupController.php:40
* @route '/pos/products/barcode'
*/
export const barcode = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: barcode.url(options),
    method: 'get',
})

barcode.definition = {
    methods: ["get","head"],
    url: '/pos/products/barcode',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\ProductLookupController::barcode
* @see app/Http/Controllers/POS/ProductLookupController.php:40
* @route '/pos/products/barcode'
*/
barcode.url = (options?: RouteQueryOptions) => {
    return barcode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ProductLookupController::barcode
* @see app/Http/Controllers/POS/ProductLookupController.php:40
* @route '/pos/products/barcode'
*/
barcode.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: barcode.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ProductLookupController::barcode
* @see app/Http/Controllers/POS/ProductLookupController.php:40
* @route '/pos/products/barcode'
*/
barcode.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: barcode.url(options),
    method: 'head',
})

const ProductLookupController = { search, browse, barcode }

export default ProductLookupController