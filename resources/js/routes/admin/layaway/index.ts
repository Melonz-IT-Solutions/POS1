import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
* @see \App\Http\Controllers\Admin\LayawayController::index
* @see app/Http/Controllers/Admin/LayawayController.php:20
* @route '/admin/layaway'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::index
* @see app/Http/Controllers/Admin/LayawayController.php:20
* @route '/admin/layaway'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::index
* @see app/Http/Controllers/Admin/LayawayController.php:20
* @route '/admin/layaway'
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
* @see \App\Http\Controllers\Admin\LayawayController::create
* @see app/Http/Controllers/Admin/LayawayController.php:53
* @route '/admin/layaway/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::create
* @see app/Http/Controllers/Admin/LayawayController.php:53
* @route '/admin/layaway/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::create
* @see app/Http/Controllers/Admin/LayawayController.php:53
* @route '/admin/layaway/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

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
* @see \App\Http\Controllers\Admin\LayawayController::store
* @see app/Http/Controllers/Admin/LayawayController.php:65
* @route '/admin/layaway'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::store
* @see app/Http/Controllers/Admin/LayawayController.php:65
* @route '/admin/layaway'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
export const show = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
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
show.url = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
show.get = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
show.head = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
const showForm = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
showForm.get = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::show
* @see app/Http/Controllers/Admin/LayawayController.php:133
* @route '/admin/layaway/{layaway}'
*/
showForm.head = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\LayawayController::payment
* @see app/Http/Controllers/Admin/LayawayController.php:150
* @route '/admin/layaway/{layaway}/payment'
*/
export const payment = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payment.url(args, options),
    method: 'post',
})

payment.definition = {
    methods: ["post"],
    url: '/admin/layaway/{layaway}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LayawayController::payment
* @see app/Http/Controllers/Admin/LayawayController.php:150
* @route '/admin/layaway/{layaway}/payment'
*/
payment.url = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return payment.definition.url
            .replace('{layaway}', parsedArgs.layaway.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LayawayController::payment
* @see app/Http/Controllers/Admin/LayawayController.php:150
* @route '/admin/layaway/{layaway}/payment'
*/
payment.post = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::payment
* @see app/Http/Controllers/Admin/LayawayController.php:150
* @route '/admin/layaway/{layaway}/payment'
*/
const paymentForm = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: payment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::payment
* @see app/Http/Controllers/Admin/LayawayController.php:150
* @route '/admin/layaway/{layaway}/payment'
*/
paymentForm.post = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: payment.url(args, options),
    method: 'post',
})

payment.form = paymentForm

/**
* @see \App\Http\Controllers\Admin\LayawayController::cancel
* @see app/Http/Controllers/Admin/LayawayController.php:189
* @route '/admin/layaway/{layaway}/cancel'
*/
export const cancel = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
cancel.url = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
cancel.post = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::cancel
* @see app/Http/Controllers/Admin/LayawayController.php:189
* @route '/admin/layaway/{layaway}/cancel'
*/
const cancelForm = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LayawayController::cancel
* @see app/Http/Controllers/Admin/LayawayController.php:189
* @route '/admin/layaway/{layaway}/cancel'
*/
cancelForm.post = (args: { layaway: string | number | { id: string | number } } | [layaway: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

cancel.form = cancelForm

const layaway = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    payment: Object.assign(payment, payment),
    cancel: Object.assign(cancel, cancel),
}

export default layaway