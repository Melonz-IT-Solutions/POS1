import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:208
* @route '/admin/products/bulk-price'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/products/bulk-price',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:208
* @route '/admin/products/bulk-price'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:208
* @route '/admin/products/bulk-price'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

const bulkPrice = {
    update: Object.assign(update, update),
}

export default bulkPrice