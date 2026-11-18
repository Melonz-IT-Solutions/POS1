import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:34
* @route '/pos/sales'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pos/sales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:34
* @route '/pos/sales'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:34
* @route '/pos/sales'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:34
* @route '/pos/sales'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:34
* @route '/pos/sales'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:34
* @route '/pos/sales'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:34
* @route '/pos/sales'
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
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:49
* @route '/pos/sales/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/pos/sales/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:49
* @route '/pos/sales/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:49
* @route '/pos/sales/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:49
* @route '/pos/sales/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:49
* @route '/pos/sales/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:49
* @route '/pos/sales/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:49
* @route '/pos/sales/export'
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
* @see \App\Http\Controllers\POS\SaleController::held
* @see app/Http/Controllers/POS/SaleController.php:264
* @route '/pos/sales/held'
*/
export const held = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: held.url(options),
    method: 'get',
})

held.definition = {
    methods: ["get","head"],
    url: '/pos/sales/held',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\SaleController::held
* @see app/Http/Controllers/POS/SaleController.php:264
* @route '/pos/sales/held'
*/
held.url = (options?: RouteQueryOptions) => {
    return held.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::held
* @see app/Http/Controllers/POS/SaleController.php:264
* @route '/pos/sales/held'
*/
held.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: held.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::held
* @see app/Http/Controllers/POS/SaleController.php:264
* @route '/pos/sales/held'
*/
held.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: held.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::held
* @see app/Http/Controllers/POS/SaleController.php:264
* @route '/pos/sales/held'
*/
const heldForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: held.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::held
* @see app/Http/Controllers/POS/SaleController.php:264
* @route '/pos/sales/held'
*/
heldForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: held.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::held
* @see app/Http/Controllers/POS/SaleController.php:264
* @route '/pos/sales/held'
*/
heldForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: held.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

held.form = heldForm

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:87
* @route '/pos/sales/{sale}/receipt'
*/
export const receipt = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

receipt.definition = {
    methods: ["get","head"],
    url: '/pos/sales/{sale}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:87
* @route '/pos/sales/{sale}/receipt'
*/
receipt.url = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sale: typeof args.sale === 'object'
        ? args.sale.id
        : args.sale,
    }

    return receipt.definition.url
            .replace('{sale}', parsedArgs.sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:87
* @route '/pos/sales/{sale}/receipt'
*/
receipt.get = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:87
* @route '/pos/sales/{sale}/receipt'
*/
receipt.head = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:87
* @route '/pos/sales/{sale}/receipt'
*/
const receiptForm = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: receipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:87
* @route '/pos/sales/{sale}/receipt'
*/
receiptForm.get = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: receipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:87
* @route '/pos/sales/{sale}/receipt'
*/
receiptForm.head = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: receipt.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

receipt.form = receiptForm

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:106
* @route '/pos/sales/{sale}'
*/
export const show = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/pos/sales/{sale}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:106
* @route '/pos/sales/{sale}'
*/
show.url = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sale: typeof args.sale === 'object'
        ? args.sale.id
        : args.sale,
    }

    return show.definition.url
            .replace('{sale}', parsedArgs.sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:106
* @route '/pos/sales/{sale}'
*/
show.get = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:106
* @route '/pos/sales/{sale}'
*/
show.head = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:106
* @route '/pos/sales/{sale}'
*/
const showForm = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:106
* @route '/pos/sales/{sale}'
*/
showForm.get = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:106
* @route '/pos/sales/{sale}'
*/
showForm.head = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\POS\SaleController::store
* @see app/Http/Controllers/POS/SaleController.php:117
* @route '/pos/sales'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/pos/sales',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::store
* @see app/Http/Controllers/POS/SaleController.php:117
* @route '/pos/sales'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::store
* @see app/Http/Controllers/POS/SaleController.php:117
* @route '/pos/sales'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::store
* @see app/Http/Controllers/POS/SaleController.php:117
* @route '/pos/sales'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::store
* @see app/Http/Controllers/POS/SaleController.php:117
* @route '/pos/sales'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\POS\SaleController::hold
* @see app/Http/Controllers/POS/SaleController.php:162
* @route '/pos/sales/hold'
*/
export const hold = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hold.url(options),
    method: 'post',
})

hold.definition = {
    methods: ["post"],
    url: '/pos/sales/hold',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::hold
* @see app/Http/Controllers/POS/SaleController.php:162
* @route '/pos/sales/hold'
*/
hold.url = (options?: RouteQueryOptions) => {
    return hold.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::hold
* @see app/Http/Controllers/POS/SaleController.php:162
* @route '/pos/sales/hold'
*/
hold.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hold.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::hold
* @see app/Http/Controllers/POS/SaleController.php:162
* @route '/pos/sales/hold'
*/
const holdForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hold.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::hold
* @see app/Http/Controllers/POS/SaleController.php:162
* @route '/pos/sales/hold'
*/
holdForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hold.url(options),
    method: 'post',
})

hold.form = holdForm

/**
* @see \App\Http\Controllers\POS\SaleController::resume
* @see app/Http/Controllers/POS/SaleController.php:191
* @route '/pos/sales/{sale}/resume'
*/
export const resume = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

resume.definition = {
    methods: ["post"],
    url: '/pos/sales/{sale}/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::resume
* @see app/Http/Controllers/POS/SaleController.php:191
* @route '/pos/sales/{sale}/resume'
*/
resume.url = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sale: typeof args.sale === 'object'
        ? args.sale.id
        : args.sale,
    }

    return resume.definition.url
            .replace('{sale}', parsedArgs.sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::resume
* @see app/Http/Controllers/POS/SaleController.php:191
* @route '/pos/sales/{sale}/resume'
*/
resume.post = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::resume
* @see app/Http/Controllers/POS/SaleController.php:191
* @route '/pos/sales/{sale}/resume'
*/
const resumeForm = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::resume
* @see app/Http/Controllers/POS/SaleController.php:191
* @route '/pos/sales/{sale}/resume'
*/
resumeForm.post = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resume.url(args, options),
    method: 'post',
})

resume.form = resumeForm

/**
* @see \App\Http\Controllers\POS\SaleController::cancelHeld
* @see app/Http/Controllers/POS/SaleController.php:206
* @route '/pos/sales/{sale}/held'
*/
export const cancelHeld = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelHeld.url(args, options),
    method: 'delete',
})

cancelHeld.definition = {
    methods: ["delete"],
    url: '/pos/sales/{sale}/held',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\POS\SaleController::cancelHeld
* @see app/Http/Controllers/POS/SaleController.php:206
* @route '/pos/sales/{sale}/held'
*/
cancelHeld.url = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sale: typeof args.sale === 'object'
        ? args.sale.id
        : args.sale,
    }

    return cancelHeld.definition.url
            .replace('{sale}', parsedArgs.sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::cancelHeld
* @see app/Http/Controllers/POS/SaleController.php:206
* @route '/pos/sales/{sale}/held'
*/
cancelHeld.delete = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelHeld.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\POS\SaleController::cancelHeld
* @see app/Http/Controllers/POS/SaleController.php:206
* @route '/pos/sales/{sale}/held'
*/
const cancelHeldForm = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelHeld.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::cancelHeld
* @see app/Http/Controllers/POS/SaleController.php:206
* @route '/pos/sales/{sale}/held'
*/
cancelHeldForm.delete = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelHeld.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

cancelHeld.form = cancelHeldForm

/**
* @see \App\Http\Controllers\POS\SaleController::voidMethod
* @see app/Http/Controllers/POS/SaleController.php:217
* @route '/pos/sales/{sale}/void'
*/
export const voidMethod = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: voidMethod.url(args, options),
    method: 'post',
})

voidMethod.definition = {
    methods: ["post"],
    url: '/pos/sales/{sale}/void',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::voidMethod
* @see app/Http/Controllers/POS/SaleController.php:217
* @route '/pos/sales/{sale}/void'
*/
voidMethod.url = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sale: typeof args.sale === 'object'
        ? args.sale.id
        : args.sale,
    }

    return voidMethod.definition.url
            .replace('{sale}', parsedArgs.sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::voidMethod
* @see app/Http/Controllers/POS/SaleController.php:217
* @route '/pos/sales/{sale}/void'
*/
voidMethod.post = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: voidMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::voidMethod
* @see app/Http/Controllers/POS/SaleController.php:217
* @route '/pos/sales/{sale}/void'
*/
const voidMethodForm = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: voidMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::voidMethod
* @see app/Http/Controllers/POS/SaleController.php:217
* @route '/pos/sales/{sale}/void'
*/
voidMethodForm.post = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: voidMethod.url(args, options),
    method: 'post',
})

voidMethod.form = voidMethodForm

/**
* @see \App\Http\Controllers\POS\SaleController::refund
* @see app/Http/Controllers/POS/SaleController.php:233
* @route '/pos/sales/{sale}/refund'
*/
export const refund = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

refund.definition = {
    methods: ["post"],
    url: '/pos/sales/{sale}/refund',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::refund
* @see app/Http/Controllers/POS/SaleController.php:233
* @route '/pos/sales/{sale}/refund'
*/
refund.url = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sale: typeof args.sale === 'object'
        ? args.sale.id
        : args.sale,
    }

    return refund.definition.url
            .replace('{sale}', parsedArgs.sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::refund
* @see app/Http/Controllers/POS/SaleController.php:233
* @route '/pos/sales/{sale}/refund'
*/
refund.post = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::refund
* @see app/Http/Controllers/POS/SaleController.php:233
* @route '/pos/sales/{sale}/refund'
*/
const refundForm = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: refund.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::refund
* @see app/Http/Controllers/POS/SaleController.php:233
* @route '/pos/sales/{sale}/refund'
*/
refundForm.post = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: refund.url(args, options),
    method: 'post',
})

refund.form = refundForm

/**
* @see \App\Http\Controllers\POS\SaleController::emailReceipt
* @see app/Http/Controllers/POS/SaleController.php:250
* @route '/pos/sales/{sale}/email-receipt'
*/
export const emailReceipt = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: emailReceipt.url(args, options),
    method: 'post',
})

emailReceipt.definition = {
    methods: ["post"],
    url: '/pos/sales/{sale}/email-receipt',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::emailReceipt
* @see app/Http/Controllers/POS/SaleController.php:250
* @route '/pos/sales/{sale}/email-receipt'
*/
emailReceipt.url = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sale: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { sale: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            sale: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        sale: typeof args.sale === 'object'
        ? args.sale.id
        : args.sale,
    }

    return emailReceipt.definition.url
            .replace('{sale}', parsedArgs.sale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::emailReceipt
* @see app/Http/Controllers/POS/SaleController.php:250
* @route '/pos/sales/{sale}/email-receipt'
*/
emailReceipt.post = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: emailReceipt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::emailReceipt
* @see app/Http/Controllers/POS/SaleController.php:250
* @route '/pos/sales/{sale}/email-receipt'
*/
const emailReceiptForm = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: emailReceipt.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::emailReceipt
* @see app/Http/Controllers/POS/SaleController.php:250
* @route '/pos/sales/{sale}/email-receipt'
*/
emailReceiptForm.post = (args: { sale: string | number | { id: string | number } } | [sale: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: emailReceipt.url(args, options),
    method: 'post',
})

emailReceipt.form = emailReceiptForm

const sales = {
    index: Object.assign(index, index),
    export: Object.assign(exportMethod, exportMethod),
    held: Object.assign(held, held),
    receipt: Object.assign(receipt, receipt),
    show: Object.assign(show, show),
    store: Object.assign(store, store),
    hold: Object.assign(hold, hold),
    resume: Object.assign(resume, resume),
    cancelHeld: Object.assign(cancelHeld, cancelHeld),
    void: Object.assign(voidMethod, voidMethod),
    refund: Object.assign(refund, refund),
    emailReceipt: Object.assign(emailReceipt, emailReceipt),
}

export default sales