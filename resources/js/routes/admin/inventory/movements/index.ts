import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\InventoryController::all
* @see app/Http/Controllers/Admin/InventoryController.php:290
* @route '/admin/inventory/movements/all'
*/
export const all = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: all.url(options),
    method: 'get',
})

all.definition = {
    methods: ["get","head"],
    url: '/admin/inventory/movements/all',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::all
* @see app/Http/Controllers/Admin/InventoryController.php:290
* @route '/admin/inventory/movements/all'
*/
all.url = (options?: RouteQueryOptions) => {
    return all.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::all
* @see app/Http/Controllers/Admin/InventoryController.php:290
* @route '/admin/inventory/movements/all'
*/
all.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: all.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::all
* @see app/Http/Controllers/Admin/InventoryController.php:290
* @route '/admin/inventory/movements/all'
*/
all.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: all.url(options),
    method: 'head',
})

