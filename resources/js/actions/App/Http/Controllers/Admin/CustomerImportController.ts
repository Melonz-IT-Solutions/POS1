import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CustomerImportController::create
* @see app/Http/Controllers/Admin/CustomerImportController.php:16
* @route '/admin/customers/import'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/customers/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CustomerImportController::create
* @see app/Http/Controllers/Admin/CustomerImportController.php:16
* @route '/admin/customers/import'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerImportController::create
* @see app/Http/Controllers/Admin/CustomerImportController.php:16
* @route '/admin/customers/import'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerImportController::create
* @see app/Http/Controllers/Admin/CustomerImportController.php:16
* @route '/admin/customers/import'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CustomerImportController::store
* @see app/Http/Controllers/Admin/CustomerImportController.php:23
* @route '/admin/customers/import'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/customers/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CustomerImportController::store
* @see app/Http/Controllers/Admin/CustomerImportController.php:23
* @route '/admin/customers/import'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerImportController::store
* @see app/Http/Controllers/Admin/CustomerImportController.php:23
* @route '/admin/customers/import'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const CustomerImportController = { create, store }

export default CustomerImportController