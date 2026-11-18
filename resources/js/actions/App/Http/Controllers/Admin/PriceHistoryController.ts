import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PriceHistoryController::index
* @see app/Http/Controllers/Admin/PriceHistoryController.php:15
* @route '/admin/price-history'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/price-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PriceHistoryController::index
* @see app/Http/Controllers/Admin/PriceHistoryController.php:15
* @route '/admin/price-history'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PriceHistoryController::index
* @see app/Http/Controllers/Admin/PriceHistoryController.php:15
* @route '/admin/price-history'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PriceHistoryController::index
* @see app/Http/Controllers/Admin/PriceHistoryController.php:15
* @route '/admin/price-history'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const PriceHistoryController = { index }

export default PriceHistoryController