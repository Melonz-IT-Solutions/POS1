import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\Admin\CustomerImportController::store
* @see app/Http/Controllers/Admin/CustomerImportController.php:23
* @route '/admin/customers/import'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerImportController::store
* @see app/Http/Controllers/Admin/CustomerImportController.php:23
* @route '/admin/customers/import'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const importMethod = {
    store: Object.assign(store, store),
}

export default importMethod