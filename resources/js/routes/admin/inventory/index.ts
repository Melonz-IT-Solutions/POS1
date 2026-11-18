import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\Admin\InventoryController::index
* @see app/Http/Controllers/Admin/InventoryController.php:21
* @route '/admin/inventory'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::index
* @see app/Http/Controllers/Admin/InventoryController.php:21
* @route '/admin/inventory'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::index
* @see app/Http/Controllers/Admin/InventoryController.php:21
* @route '/admin/inventory'
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
* @see \App\Http\Controllers\Admin\InventoryController::reorder
* @see app/Http/Controllers/Admin/InventoryController.php:89
* @route '/admin/inventory/reorder'
*/
const reorderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reorder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::reorder
* @see app/Http/Controllers/Admin/InventoryController.php:89
* @route '/admin/inventory/reorder'
*/
reorderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reorder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::reorder
* @see app/Http/Controllers/Admin/InventoryController.php:89
* @route '/admin/inventory/reorder'
*/
reorderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: reorder.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

reorder.form = reorderForm

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
* @see \App\Http\Controllers\Admin\InventoryController::valuation
* @see app/Http/Controllers/Admin/InventoryController.php:114
* @route '/admin/inventory/valuation'
*/
const valuationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: valuation.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::valuation
* @see app/Http/Controllers/Admin/InventoryController.php:114
* @route '/admin/inventory/valuation'
*/
valuationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: valuation.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::valuation
* @see app/Http/Controllers/Admin/InventoryController.php:114
* @route '/admin/inventory/valuation'
*/
valuationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: valuation.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

valuation.form = valuationForm

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
* @see \App\Http\Controllers\Admin\InventoryController::exportMethod
* @see app/Http/Controllers/Admin/InventoryController.php:187
* @route '/admin/inventory/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::exportMethod
* @see app/Http/Controllers/Admin/InventoryController.php:187
* @route '/admin/inventory/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::exportMethod
* @see app/Http/Controllers/Admin/InventoryController.php:187
* @route '/admin/inventory/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

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
* @see \App\Http\Controllers\Admin\InventoryController::physicalCount
* @see app/Http/Controllers/Admin/InventoryController.php:238
* @route '/admin/inventory/physical-count'
*/
const physicalCountForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: physicalCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::physicalCount
* @see app/Http/Controllers/Admin/InventoryController.php:238
* @route '/admin/inventory/physical-count'
*/
physicalCountForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: physicalCount.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::physicalCount
* @see app/Http/Controllers/Admin/InventoryController.php:238
* @route '/admin/inventory/physical-count'
*/
physicalCountForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: physicalCount.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

physicalCount.form = physicalCountForm

/**
* @see \App\Http\Controllers\Admin\InventoryController::adjust
* @see app/Http/Controllers/Admin/InventoryController.php:61
* @route '/admin/inventory/{product}/adjust'
*/
export const adjust = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
adjust.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
adjust.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::adjust
* @see app/Http/Controllers/Admin/InventoryController.php:61
* @route '/admin/inventory/{product}/adjust'
*/
const adjustForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: adjust.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::adjust
* @see app/Http/Controllers/Admin/InventoryController.php:61
* @route '/admin/inventory/{product}/adjust'
*/
adjustForm.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: adjust.url(args, options),
    method: 'post',
})

adjust.form = adjustForm

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
export const movements = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
movements.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
movements.get = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movements.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
movements.head = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movements.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
const movementsForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: movements.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
movementsForm.get = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: movements.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\InventoryController::movements
* @see app/Http/Controllers/Admin/InventoryController.php:75
* @route '/admin/inventory/{product}/movements'
*/
movementsForm.head = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: movements.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

movements.form = movementsForm

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