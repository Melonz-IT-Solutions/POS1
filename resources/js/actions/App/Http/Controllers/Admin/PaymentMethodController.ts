import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::index
* @see app/Http/Controllers/Admin/PaymentMethodController.php:15
* @route '/admin/payment-methods'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/payment-methods',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::index
* @see app/Http/Controllers/Admin/PaymentMethodController.php:15
* @route '/admin/payment-methods'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::index
* @see app/Http/Controllers/Admin/PaymentMethodController.php:15
* @route '/admin/payment-methods'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::index
* @see app/Http/Controllers/Admin/PaymentMethodController.php:15
* @route '/admin/payment-methods'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::store
* @see app/Http/Controllers/Admin/PaymentMethodController.php:26
* @route '/admin/payment-methods'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/payment-methods',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::store
* @see app/Http/Controllers/Admin/PaymentMethodController.php:26
* @route '/admin/payment-methods'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::store
* @see app/Http/Controllers/Admin/PaymentMethodController.php:26
* @route '/admin/payment-methods'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::update
* @see app/Http/Controllers/Admin/PaymentMethodController.php:47
* @route '/admin/payment-methods/{paymentMethod}'
*/
export const update = (args: { paymentMethod: number | { id: number } } | [paymentMethod: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/payment-methods/{paymentMethod}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::update
* @see app/Http/Controllers/Admin/PaymentMethodController.php:47
* @route '/admin/payment-methods/{paymentMethod}'
*/
update.url = (args: { paymentMethod: number | { id: number } } | [paymentMethod: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { paymentMethod: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { paymentMethod: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            paymentMethod: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        paymentMethod: typeof args.paymentMethod === 'object'
        ? args.paymentMethod.id
        : args.paymentMethod,
    }

    return update.definition.url
            .replace('{paymentMethod}', parsedArgs.paymentMethod.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::update
* @see app/Http/Controllers/Admin/PaymentMethodController.php:47
* @route '/admin/payment-methods/{paymentMethod}'
*/
update.put = (args: { paymentMethod: number | { id: number } } | [paymentMethod: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::toggle
* @see app/Http/Controllers/Admin/PaymentMethodController.php:64
* @route '/admin/payment-methods/{paymentMethod}/toggle'
*/
export const toggle = (args: { paymentMethod: number | { id: number } } | [paymentMethod: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/admin/payment-methods/{paymentMethod}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::toggle
* @see app/Http/Controllers/Admin/PaymentMethodController.php:64
* @route '/admin/payment-methods/{paymentMethod}/toggle'
*/
toggle.url = (args: { paymentMethod: number | { id: number } } | [paymentMethod: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { paymentMethod: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { paymentMethod: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            paymentMethod: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        paymentMethod: typeof args.paymentMethod === 'object'
        ? args.paymentMethod.id
        : args.paymentMethod,
    }

    return toggle.definition.url
            .replace('{paymentMethod}', parsedArgs.paymentMethod.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::toggle
* @see app/Http/Controllers/Admin/PaymentMethodController.php:64
* @route '/admin/payment-methods/{paymentMethod}/toggle'
*/
toggle.post = (args: { paymentMethod: number | { id: number } } | [paymentMethod: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::reorder
* @see app/Http/Controllers/Admin/PaymentMethodController.php:74
* @route '/admin/payment-methods/reorder'
*/
export const reorder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/admin/payment-methods/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::reorder
* @see app/Http/Controllers/Admin/PaymentMethodController.php:74
* @route '/admin/payment-methods/reorder'
*/
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::reorder
* @see app/Http/Controllers/Admin/PaymentMethodController.php:74
* @route '/admin/payment-methods/reorder'
*/
reorder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

const PaymentMethodController = { index, store, update, toggle, reorder }

export default PaymentMethodController