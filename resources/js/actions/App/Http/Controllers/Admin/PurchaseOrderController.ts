import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:27
* @route '/admin/purchases'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/purchases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:27
* @route '/admin/purchases'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:27
* @route '/admin/purchases'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::index
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:27
* @route '/admin/purchases'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
* @route '/admin/purchases/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/purchases/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
* @route '/admin/purchases/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
* @route '/admin/purchases/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::create
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:55
* @route '/admin/purchases/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::store
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:72
* @route '/admin/purchases'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/purchases',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::store
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:72
* @route '/admin/purchases'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::store
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:72
* @route '/admin/purchases'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:151
* @route '/admin/purchases/{purchase}/edit'
*/
export const edit = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/purchases/{purchase}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:151
* @route '/admin/purchases/{purchase}/edit'
*/
edit.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return edit.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:151
* @route '/admin/purchases/{purchase}/edit'
*/
edit.get = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::edit
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:151
* @route '/admin/purchases/{purchase}/edit'
*/
edit.head = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
* @route '/admin/purchases/{purchase}'
*/
export const update = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/purchases/{purchase}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
* @route '/admin/purchases/{purchase}'
*/
update.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return update.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
* @route '/admin/purchases/{purchase}'
*/
update.put = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::update
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:172
* @route '/admin/purchases/{purchase}'
*/
update.patch = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::destroy
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:214
* @route '/admin/purchases/{purchase}'
*/
export const destroy = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/purchases/{purchase}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::destroy
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:214
* @route '/admin/purchases/{purchase}'
*/
destroy.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return destroy.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::destroy
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:214
* @route '/admin/purchases/{purchase}'
*/
destroy.delete = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::print
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:114
* @route '/admin/purchases/{purchase}/print'
*/
export const print = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/admin/purchases/{purchase}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::print
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:114
* @route '/admin/purchases/{purchase}/print'
*/
print.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return print.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::print
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:114
* @route '/admin/purchases/{purchase}/print'
*/
print.get = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::print
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:114
* @route '/admin/purchases/{purchase}/print'
*/
print.head = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:134
* @route '/admin/purchases/{purchase}'
*/
export const show = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/purchases/{purchase}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:134
* @route '/admin/purchases/{purchase}'
*/
show.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return show.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:134
* @route '/admin/purchases/{purchase}'
*/
show.get = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::show
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:134
* @route '/admin/purchases/{purchase}'
*/
show.head = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::markOrdered
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:226
* @route '/admin/purchases/{purchase}/mark-ordered'
*/
export const markOrdered = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markOrdered.url(args, options),
    method: 'post',
})

markOrdered.definition = {
    methods: ["post"],
    url: '/admin/purchases/{purchase}/mark-ordered',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::markOrdered
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:226
* @route '/admin/purchases/{purchase}/mark-ordered'
*/
markOrdered.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return markOrdered.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::markOrdered
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:226
* @route '/admin/purchases/{purchase}/mark-ordered'
*/
markOrdered.post = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markOrdered.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::cancel
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:237
* @route '/admin/purchases/{purchase}/cancel'
*/
export const cancel = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/purchases/{purchase}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::cancel
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:237
* @route '/admin/purchases/{purchase}/cancel'
*/
cancel.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return cancel.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::cancel
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:237
* @route '/admin/purchases/{purchase}/cancel'
*/
cancel.post = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::receive
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:252
* @route '/admin/purchases/{purchase}/receive'
*/
export const receive = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receive.url(args, options),
    method: 'get',
})

receive.definition = {
    methods: ["get","head"],
    url: '/admin/purchases/{purchase}/receive',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::receive
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:252
* @route '/admin/purchases/{purchase}/receive'
*/
receive.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return receive.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::receive
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:252
* @route '/admin/purchases/{purchase}/receive'
*/
receive.get = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: receive.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::receive
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:252
* @route '/admin/purchases/{purchase}/receive'
*/
receive.head = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: receive.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::storeReceipt
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:268
* @route '/admin/purchases/{purchase}/receive'
*/
export const storeReceipt = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReceipt.url(args, options),
    method: 'post',
})

storeReceipt.definition = {
    methods: ["post"],
    url: '/admin/purchases/{purchase}/receive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::storeReceipt
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:268
* @route '/admin/purchases/{purchase}/receive'
*/
storeReceipt.url = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchase: typeof args.purchase === 'object'
        ? args.purchase.id
        : args.purchase,
    }

    return storeReceipt.definition.url
            .replace('{purchase}', parsedArgs.purchase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PurchaseOrderController::storeReceipt
* @see app/Http/Controllers/Admin/PurchaseOrderController.php:268
* @route '/admin/purchases/{purchase}/receive'
*/
storeReceipt.post = (args: { purchase: number | { id: number } } | [purchase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReceipt.url(args, options),
    method: 'post',
})

const PurchaseOrderController = { index, create, store, edit, update, destroy, print, show, markOrdered, cancel, receive, storeReceipt }

export default PurchaseOrderController