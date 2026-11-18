import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\InventoryController::apply
* @see app/Http/Controllers/Admin/InventoryController.php:252
* @route '/admin/inventory/physical-count'
*/
export const apply = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/admin/inventory/physical-count',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::apply
* @see app/Http/Controllers/Admin/InventoryController.php:252
* @route '/admin/inventory/physical-count'
*/
apply.url = (options?: RouteQueryOptions) => {
    return apply.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::apply
* @see app/Http/Controllers/Admin/InventoryController.php:252
* @route '/admin/inventory/physical-count'
*/
apply.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::apply
* @see app/Http/Controllers/Admin/InventoryController.php:252
* @route '/admin/inventory/physical-count'
*/
const applyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: apply.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::apply
* @see app/Http/Controllers/Admin/InventoryController.php:252
* @route '/admin/inventory/physical-count'
*/
applyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: apply.url(options),
    method: 'post',
})

apply.form = applyForm

const physicalCount = {
    apply: Object.assign(apply, apply),
}

export default physicalCount