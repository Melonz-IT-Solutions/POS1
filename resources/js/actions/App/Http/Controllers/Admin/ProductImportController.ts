import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ProductImportController::create
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/products/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductImportController::create
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductImportController::create
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductImportController::create
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

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

const ProductImportController = { create, store }

export default ProductImportController