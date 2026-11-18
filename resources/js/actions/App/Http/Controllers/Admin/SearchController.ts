import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
const SearchController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SearchController.url(options),
    method: 'get',
})

SearchController.definition = {
    methods: ["get","head"],
    url: '/admin/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
SearchController.url = (options?: RouteQueryOptions) => {
    return SearchController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
SearchController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SearchController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
* @see app/Http/Controllers/Admin/SearchController.php:14
* @route '/admin/search'
*/
SearchController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SearchController.url(options),
    method: 'head',
})

export default SearchController