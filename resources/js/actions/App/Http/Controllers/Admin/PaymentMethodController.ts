import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Admin\PaymentMethodController::index
* @see app/Http/Controllers/Admin/PaymentMethodController.php:15
* @route '/admin/payment-methods'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::index
* @see app/Http/Controllers/Admin/PaymentMethodController.php:15
* @route '/admin/payment-methods'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::index
* @see app/Http/Controllers/Admin/PaymentMethodController.php:15
* @route '/admin/payment-methods'
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
* @see \App\Http\Controllers\Admin\PaymentMethodController::store
* @see app/Http/Controllers/Admin/PaymentMethodController.php:26
* @route '/admin/payment-methods'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::store
* @see app/Http/Controllers/Admin/PaymentMethodController.php:26
* @route '/admin/payment-methods'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::update
* @see app/Http/Controllers/Admin/PaymentMethodController.php:47
* @route '/admin/payment-methods/{paymentMethod}'
*/
export const update = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
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
update.url = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
update.put = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::update
* @see app/Http/Controllers/Admin/PaymentMethodController.php:47
* @route '/admin/payment-methods/{paymentMethod}'
*/
const updateForm = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::update
* @see app/Http/Controllers/Admin/PaymentMethodController.php:47
* @route '/admin/payment-methods/{paymentMethod}'
*/
updateForm.put = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::toggle
* @see app/Http/Controllers/Admin/PaymentMethodController.php:64
* @route '/admin/payment-methods/{paymentMethod}/toggle'
*/
export const toggle = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
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
toggle.url = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
toggle.post = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::toggle
* @see app/Http/Controllers/Admin/PaymentMethodController.php:64
* @route '/admin/payment-methods/{paymentMethod}/toggle'
*/
const toggleForm = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::toggle
* @see app/Http/Controllers/Admin/PaymentMethodController.php:64
* @route '/admin/payment-methods/{paymentMethod}/toggle'
*/
toggleForm.post = (args: { paymentMethod: string | number | { id: string | number } } | [paymentMethod: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggle.url(args, options),
    method: 'post',
})

toggle.form = toggleForm

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

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::reorder
* @see app/Http/Controllers/Admin/PaymentMethodController.php:74
* @route '/admin/payment-methods/reorder'
*/
const reorderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PaymentMethodController::reorder
* @see app/Http/Controllers/Admin/PaymentMethodController.php:74
* @route '/admin/payment-methods/reorder'
*/
reorderForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(options),
    method: 'post',
})

reorder.form = reorderForm

const PaymentMethodController = { index, store, update, toggle, reorder }

export default PaymentMethodController