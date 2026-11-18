import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:33
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
* @see app/Http/Controllers/POS/SaleController.php:33
* @route '/pos/sales'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:33
* @route '/pos/sales'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::index
* @see app/Http/Controllers/POS/SaleController.php:33
* @route '/pos/sales'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:48
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
* @see app/Http/Controllers/POS/SaleController.php:48
* @route '/pos/sales/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:48
* @route '/pos/sales/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::exportMethod
* @see app/Http/Controllers/POS/SaleController.php:48
* @route '/pos/sales/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::heldList
* @see app/Http/Controllers/POS/SaleController.php:263
* @route '/pos/sales/held'
*/
export const heldList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heldList.url(options),
    method: 'get',
})

heldList.definition = {
    methods: ["get","head"],
    url: '/pos/sales/held',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\SaleController::heldList
* @see app/Http/Controllers/POS/SaleController.php:263
* @route '/pos/sales/held'
*/
heldList.url = (options?: RouteQueryOptions) => {
    return heldList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::heldList
* @see app/Http/Controllers/POS/SaleController.php:263
* @route '/pos/sales/held'
*/
heldList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: heldList.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::heldList
* @see app/Http/Controllers/POS/SaleController.php:263
* @route '/pos/sales/held'
*/
heldList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: heldList.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:86
* @route '/pos/sales/{sale}/receipt'
*/
export const receipt = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

receipt.definition = {
    methods: ["get","head"],
    url: '/pos/sales/{sale}/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:86
* @route '/pos/sales/{sale}/receipt'
*/
receipt.url = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/POS/SaleController.php:86
* @route '/pos/sales/{sale}/receipt'
*/
receipt.get = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receipt.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::receipt
* @see app/Http/Controllers/POS/SaleController.php:86
* @route '/pos/sales/{sale}/receipt'
*/
receipt.head = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receipt.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:105
* @route '/pos/sales/{sale}'
*/
export const show = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/pos/sales/{sale}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:105
* @route '/pos/sales/{sale}'
*/
show.url = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/POS/SaleController.php:105
* @route '/pos/sales/{sale}'
*/
show.get = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\SaleController::show
* @see app/Http/Controllers/POS/SaleController.php:105
* @route '/pos/sales/{sale}'
*/
show.head = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\SaleController::store
* @see app/Http/Controllers/POS/SaleController.php:116
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
* @see app/Http/Controllers/POS/SaleController.php:116
* @route '/pos/sales'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::store
* @see app/Http/Controllers/POS/SaleController.php:116
* @route '/pos/sales'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::hold
* @see app/Http/Controllers/POS/SaleController.php:161
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
* @see app/Http/Controllers/POS/SaleController.php:161
* @route '/pos/sales/hold'
*/
hold.url = (options?: RouteQueryOptions) => {
    return hold.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\SaleController::hold
* @see app/Http/Controllers/POS/SaleController.php:161
* @route '/pos/sales/hold'
*/
hold.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hold.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::resume
* @see app/Http/Controllers/POS/SaleController.php:190
* @route '/pos/sales/{sale}/resume'
*/
export const resume = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

resume.definition = {
    methods: ["post"],
    url: '/pos/sales/{sale}/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::resume
* @see app/Http/Controllers/POS/SaleController.php:190
* @route '/pos/sales/{sale}/resume'
*/
resume.url = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/POS/SaleController.php:190
* @route '/pos/sales/{sale}/resume'
*/
resume.post = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::cancelHeld
* @see app/Http/Controllers/POS/SaleController.php:205
* @route '/pos/sales/{sale}/held'
*/
export const cancelHeld = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelHeld.url(args, options),
    method: 'delete',
})

cancelHeld.definition = {
    methods: ["delete"],
    url: '/pos/sales/{sale}/held',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\POS\SaleController::cancelHeld
* @see app/Http/Controllers/POS/SaleController.php:205
* @route '/pos/sales/{sale}/held'
*/
cancelHeld.url = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/POS/SaleController.php:205
* @route '/pos/sales/{sale}/held'
*/
cancelHeld.delete = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancelHeld.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\POS\SaleController::voidMethod
* @see app/Http/Controllers/POS/SaleController.php:216
* @route '/pos/sales/{sale}/void'
*/
export const voidMethod = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: voidMethod.url(args, options),
    method: 'post',
})

voidMethod.definition = {
    methods: ["post"],
    url: '/pos/sales/{sale}/void',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::voidMethod
* @see app/Http/Controllers/POS/SaleController.php:216
* @route '/pos/sales/{sale}/void'
*/
voidMethod.url = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/POS/SaleController.php:216
* @route '/pos/sales/{sale}/void'
*/
voidMethod.post = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: voidMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::refund
* @see app/Http/Controllers/POS/SaleController.php:232
* @route '/pos/sales/{sale}/refund'
*/
export const refund = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

refund.definition = {
    methods: ["post"],
    url: '/pos/sales/{sale}/refund',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::refund
* @see app/Http/Controllers/POS/SaleController.php:232
* @route '/pos/sales/{sale}/refund'
*/
refund.url = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/POS/SaleController.php:232
* @route '/pos/sales/{sale}/refund'
*/
refund.post = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\SaleController::emailReceipt
* @see app/Http/Controllers/POS/SaleController.php:249
* @route '/pos/sales/{sale}/email-receipt'
*/
export const emailReceipt = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: emailReceipt.url(args, options),
    method: 'post',
})

emailReceipt.definition = {
    methods: ["post"],
    url: '/pos/sales/{sale}/email-receipt',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\SaleController::emailReceipt
* @see app/Http/Controllers/POS/SaleController.php:249
* @route '/pos/sales/{sale}/email-receipt'
*/
emailReceipt.url = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see app/Http/Controllers/POS/SaleController.php:249
* @route '/pos/sales/{sale}/email-receipt'
*/
emailReceipt.post = (args: { sale: number | { id: number } } | [sale: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: emailReceipt.url(args, options),
    method: 'post',
})

const SaleController = { index, exportMethod, heldList, receipt, show, store, hold, resume, cancelHeld, voidMethod, refund, emailReceipt, export: exportMethod, void: voidMethod }

export default SaleController