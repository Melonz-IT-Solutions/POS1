import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LayawayController::index
* @see app/Http/Controllers/Admin/LayawayController.php:20
* @route '/admin/layaway'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/layaway',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LayawayController::index
* @see app/Http/Controllers/Admin/LayawayController.php:20
* @route '/admin/layaway'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LayawayController::index
* @see app/Http/Controllers/Admin/LayawayController.php:20
* @route '/admin/layaway'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::index
* @see app/Http/Controllers/Admin/LayawayController.php:20
* @route '/admin/layaway'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::create
* @see app/Http/Controllers/Admin/LayawayController.php:53
* @route '/admin/layaway/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/layaway/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LayawayController::create
* @see app/Http/Controllers/Admin/LayawayController.php:53
* @route '/admin/layaway/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LayawayController::create
* @see app/Http/Controllers/Admin/LayawayController.php:53
* @route '/admin/layaway/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::create
* @see app/Http/Controllers/Admin/LayawayController.php:53
* @route '/admin/layaway/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::store
* @see app/Http/Controllers/Admin/LayawayController.php:65
* @route '/admin/layaway'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/layaway',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LayawayController::store
* @see app/Http/Controllers/Admin/LayawayController.php:65
* @route '/admin/layaway'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LayawayController::store
* @see app/Http/Controllers/Admin/LayawayController.php:65
* @route '/admin/layaway'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
export const show = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/layaway/{layaway}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
show.url = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { layaway: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { layaway: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            layaway: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        layaway: typeof args.layaway === 'object'
        ? args.layaway.id
        : args.layaway,
    }

    return show.definition.url
            .replace('{layaway}', parsedArgs.layaway.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
show.get = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
show.head = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::addPayment
* @see app/Http/Controllers/Admin/LayawayController.php:150
* @route '/admin/layaway/{layaway}/payment'
*/
export const addPayment = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addPayment.url(args, options),
    method: 'post',
})

addPayment.definition = {
    methods: ["post"],
    url: '/admin/layaway/{layaway}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LayawayController::addPayment
* @see app/Http/Controllers/Admin/LayawayController.php:150
* @route '/admin/layaway/{layaway}/payment'
*/
addPayment.url = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { layaway: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { layaway: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            layaway: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        layaway: typeof args.layaway === 'object'
        ? args.layaway.id
        : args.layaway,
    }

    return addPayment.definition.url
            .replace('{layaway}', parsedArgs.layaway.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LayawayController::addPayment
* @see app/Http/Controllers/Admin/LayawayController.php:150
* @route '/admin/layaway/{layaway}/payment'
*/
addPayment.post = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addPayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::cancel
* @see app/Http/Controllers/Admin/LayawayController.php:189
* @route '/admin/layaway/{layaway}/cancel'
*/
export const cancel = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/layaway/{layaway}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LayawayController::cancel
* @see app/Http/Controllers/Admin/LayawayController.php:189
* @route '/admin/layaway/{layaway}/cancel'
*/
cancel.url = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { layaway: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { layaway: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            layaway: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        layaway: typeof args.layaway === 'object'
        ? args.layaway.id
        : args.layaway,
    }

    return cancel.definition.url
            .replace('{layaway}', parsedArgs.layaway.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LayawayController::cancel
* @see app/Http/Controllers/Admin/LayawayController.php:189
* @route '/admin/layaway/{layaway}/cancel'
*/
cancel.post = (args: { layaway: number | { id: number } } | [layaway: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

const LayawayController = { index, create, store, show, addPayment, cancel }

export default LayawayController