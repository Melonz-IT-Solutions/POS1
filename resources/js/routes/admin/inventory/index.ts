import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import physicalCount48ed02 from './physical-count'
/**
* @see \App\Http\Controllers\Admin\InventoryController::index
* @see app/Http/Controllers/Admin/InventoryController.php:21
* @route '/admin/inventory'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/inventory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::index
* @see app/Http/Controllers/Admin/InventoryController.php:21
* @route '/admin/inventory'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::index
* @see app/Http/Controllers/Admin/InventoryController.php:21
* @route '/admin/inventory'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::index
* @see app/Http/Controllers/Admin/InventoryController.php:21
* @route '/admin/inventory'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::reorder
* @see app/Http/Controllers/Admin/InventoryController.php:89
* @route '/admin/inventory/reorder'
*/
export const reorder = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reorder.url(options),
    method: 'get',
})

reorder.definition = {
    methods: ["get","head"],
    url: '/admin/inventory/reorder',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::reorder
* @see app/Http/Controllers/Admin/InventoryController.php:89
* @route '/admin/inventory/reorder'
*/
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::reorder
* @see app/Http/Controllers/Admin/InventoryController.php:89
* @route '/admin/inventory/reorder'
*/
reorder.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reorder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::reorder
* @see app/Http/Controllers/Admin/InventoryController.php:89
* @route '/admin/inventory/reorder'
*/
reorder.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reorder.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::valuation
* @see app/Http/Controllers/Admin/InventoryController.php:114
* @route '/admin/inventory/valuation'
*/
export const valuation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: valuation.url(options),
    method: 'get',
})

valuation.definition = {
    methods: ["get","head"],
    url: '/admin/inventory/valuation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::valuation
* @see app/Http/Controllers/Admin/InventoryController.php:114
* @route '/admin/inventory/valuation'
*/
valuation.url = (options?: RouteQueryOptions) => {
    return valuation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::valuation
* @see app/Http/Controllers/Admin/InventoryController.php:114
* @route '/admin/inventory/valuation'
*/
valuation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: valuation.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::valuation
* @see app/Http/Controllers/Admin/InventoryController.php:114
* @route '/admin/inventory/valuation'
*/
valuation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: valuation.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::exportMethod
* @see app/Http/Controllers/Admin/InventoryController.php:187
* @route '/admin/inventory/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/inventory/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::exportMethod
* @see app/Http/Controllers/Admin/InventoryController.php:187
* @route '/admin/inventory/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::exportMethod
* @see app/Http/Controllers/Admin/InventoryController.php:187
* @route '/admin/inventory/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::exportMethod
* @see app/Http/Controllers/Admin/InventoryController.php:187
* @route '/admin/inventory/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::physicalCount
* @see app/Http/Controllers/Admin/InventoryController.php:238
* @route '/admin/inventory/physical-count'
*/
export const physicalCount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: physicalCount.url(options),
    method: 'get',
})

physicalCount.definition = {
    methods: ["get","head"],
    url: '/admin/inventory/physical-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::physicalCount
* @see app/Http/Controllers/Admin/InventoryController.php:238
* @route '/admin/inventory/physical-count'
*/
physicalCount.url = (options?: RouteQueryOptions) => {
    return physicalCount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::physicalCount
* @see app/Http/Controllers/Admin/InventoryController.php:238
* @route '/admin/inventory/physical-count'
*/
physicalCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: physicalCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::physicalCount
* @see app/Http/Controllers/Admin/InventoryController.php:238
* @route '/admin/inventory/physical-count'
*/
physicalCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: physicalCount.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::adjust
* @see app/Http/Controllers/Admin/InventoryController.php:61
* @route '/admin/inventory/{product}/adjust'
*/
export const adjust = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(args, options),
    method: 'post',
})

adjust.definition = {
    methods: ["post"],
    url: '/admin/inventory/{product}/adjust',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::adjust
* @see app/Http/Controllers/Admin/InventoryController.php:61
* @route '/admin/inventory/{product}/adjust'
*/
adjust.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return adjust.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::adjust
* @see app/Http/Controllers/Admin/InventoryController.php:61
* @route '/admin/inventory/{product}/adjust'
*/
adjust.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
export const movements = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movements.url(args, options),
    method: 'get',
})

movements.definition = {
    methods: ["get","head"],
    url: '/admin/inventory/{product}/movements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
movements.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return movements.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
movements.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movements.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
movements.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movements.url(args, options),
    method: 'head',
})

const inventory = {
    index: Object.assign(index, index),
    reorder: Object.assign(reorder, reorder),
    valuation: Object.assign(valuation, valuation),
    movements: Object.assign(movements, movements),
    export: Object.assign(exportMethod, exportMethod),
    physicalCount: Object.assign(physicalCount, physicalCount48ed02),
    adjust: Object.assign(adjust, adjust),
}

export default inventory