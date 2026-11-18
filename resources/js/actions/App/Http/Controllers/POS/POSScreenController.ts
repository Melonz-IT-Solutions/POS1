import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\POS\POSScreenController::index
* @see app/Http/Controllers/POS/POSScreenController.php:15
* @route '/pos'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\POSScreenController::index
* @see app/Http/Controllers/POS/POSScreenController.php:15
* @route '/pos'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\POSScreenController::index
* @see app/Http/Controllers/POS/POSScreenController.php:15
* @route '/pos'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const POSScreenController = { index }

export default POSScreenController