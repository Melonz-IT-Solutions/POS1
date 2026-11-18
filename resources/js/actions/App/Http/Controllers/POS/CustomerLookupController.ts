import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\POS\CustomerLookupController::search
* @see app/Http/Controllers/POS/CustomerLookupController.php:12
* @route '/pos/customers/search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/pos/customers/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\CustomerLookupController::search
* @see app/Http/Controllers/POS/CustomerLookupController.php:12
* @route '/pos/customers/search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\CustomerLookupController::search
* @see app/Http/Controllers/POS/CustomerLookupController.php:12
* @route '/pos/customers/search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\CustomerLookupController::search
* @see app/Http/Controllers/POS/CustomerLookupController.php:12
* @route '/pos/customers/search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\CustomerLookupController::search
* @see app/Http/Controllers/POS/CustomerLookupController.php:12
* @route '/pos/customers/search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\CustomerLookupController::search
* @see app/Http/Controllers/POS/CustomerLookupController.php:12
* @route '/pos/customers/search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\CustomerLookupController::search
* @see app/Http/Controllers/POS/CustomerLookupController.php:12
* @route '/pos/customers/search'
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

const CustomerLookupController = { search }

export default CustomerLookupController