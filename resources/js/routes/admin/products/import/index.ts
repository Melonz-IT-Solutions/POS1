import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ProductImportController::store
* @see app/Http/Controllers/Admin/ProductImportController.php:24
* @route '/admin/products/import'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/products/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ProductImportController::store
* @see app/Http/Controllers/Admin/ProductImportController.php:24
* @route '/admin/products/import'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductImportController::store
* @see app/Http/Controllers/Admin/ProductImportController.php:24
* @route '/admin/products/import'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const importMethod = {
    store: Object.assign(store, store),
}

export default importMethod