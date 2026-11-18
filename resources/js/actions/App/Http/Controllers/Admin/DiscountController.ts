import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DiscountController::index
* @see app/Http/Controllers/Admin/DiscountController.php:20
* @route '/admin/discounts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/discounts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DiscountController::index
* @see app/Http/Controllers/Admin/DiscountController.php:20
* @route '/admin/discounts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountController::index
* @see app/Http/Controllers/Admin/DiscountController.php:20
* @route '/admin/discounts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::index
* @see app/Http/Controllers/Admin/DiscountController.php:20
* @route '/admin/discounts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::create
* @see app/Http/Controllers/Admin/DiscountController.php:48
* @route '/admin/discounts/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/discounts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DiscountController::create
* @see app/Http/Controllers/Admin/DiscountController.php:48
* @route '/admin/discounts/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountController::create
* @see app/Http/Controllers/Admin/DiscountController.php:48
* @route '/admin/discounts/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::create
* @see app/Http/Controllers/Admin/DiscountController.php:48
* @route '/admin/discounts/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::store
* @see app/Http/Controllers/Admin/DiscountController.php:59
* @route '/admin/discounts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/discounts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DiscountController::store
* @see app/Http/Controllers/Admin/DiscountController.php:59
* @route '/admin/discounts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountController::store
* @see app/Http/Controllers/Admin/DiscountController.php:59
* @route '/admin/discounts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::show
* @see app/Http/Controllers/Admin/DiscountController.php:71
* @route '/admin/discounts/{discount}'
*/
export const show = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/discounts/{discount}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DiscountController::show
* @see app/Http/Controllers/Admin/DiscountController.php:71
* @route '/admin/discounts/{discount}'
*/
show.url = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { discount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            discount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        discount: typeof args.discount === 'object'
        ? args.discount.id
        : args.discount,
    }

    return show.definition.url
            .replace('{discount}', parsedArgs.discount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountController::show
* @see app/Http/Controllers/Admin/DiscountController.php:71
* @route '/admin/discounts/{discount}'
*/
show.get = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::show
* @see app/Http/Controllers/Admin/DiscountController.php:71
* @route '/admin/discounts/{discount}'
*/
show.head = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::edit
* @see app/Http/Controllers/Admin/DiscountController.php:83
* @route '/admin/discounts/{discount}/edit'
*/
export const edit = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/discounts/{discount}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DiscountController::edit
* @see app/Http/Controllers/Admin/DiscountController.php:83
* @route '/admin/discounts/{discount}/edit'
*/
edit.url = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { discount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            discount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        discount: typeof args.discount === 'object'
        ? args.discount.id
        : args.discount,
    }

    return edit.definition.url
            .replace('{discount}', parsedArgs.discount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountController::edit
* @see app/Http/Controllers/Admin/DiscountController.php:83
* @route '/admin/discounts/{discount}/edit'
*/
edit.get = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::edit
* @see app/Http/Controllers/Admin/DiscountController.php:83
* @route '/admin/discounts/{discount}/edit'
*/
edit.head = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::update
* @see app/Http/Controllers/Admin/DiscountController.php:97
* @route '/admin/discounts/{discount}'
*/
export const update = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/discounts/{discount}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\DiscountController::update
* @see app/Http/Controllers/Admin/DiscountController.php:97
* @route '/admin/discounts/{discount}'
*/
update.url = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { discount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            discount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        discount: typeof args.discount === 'object'
        ? args.discount.id
        : args.discount,
    }

    return update.definition.url
            .replace('{discount}', parsedArgs.discount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountController::update
* @see app/Http/Controllers/Admin/DiscountController.php:97
* @route '/admin/discounts/{discount}'
*/
update.put = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::update
* @see app/Http/Controllers/Admin/DiscountController.php:97
* @route '/admin/discounts/{discount}'
*/
update.patch = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::destroy
* @see app/Http/Controllers/Admin/DiscountController.php:110
* @route '/admin/discounts/{discount}'
*/
export const destroy = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/discounts/{discount}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DiscountController::destroy
* @see app/Http/Controllers/Admin/DiscountController.php:110
* @route '/admin/discounts/{discount}'
*/
destroy.url = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { discount: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { discount: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            discount: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        discount: typeof args.discount === 'object'
        ? args.discount.id
        : args.discount,
    }

    return destroy.definition.url
            .replace('{discount}', parsedArgs.discount.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountController::destroy
* @see app/Http/Controllers/Admin/DiscountController.php:110
* @route '/admin/discounts/{discount}'
*/
destroy.delete = (args: { discount: number | { id: number } } | [discount: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\DiscountController::restore
* @see app/Http/Controllers/Admin/DiscountController.php:121
* @route '/admin/discounts/{id}/restore'
*/
export const restore = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/admin/discounts/{id}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DiscountController::restore
* @see app/Http/Controllers/Admin/DiscountController.php:121
* @route '/admin/discounts/{id}/restore'
*/
restore.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return restore.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DiscountController::restore
* @see app/Http/Controllers/Admin/DiscountController.php:121
* @route '/admin/discounts/{id}/restore'
*/
restore.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

const DiscountController = { index, create, store, show, edit, update, destroy, restore }

export default DiscountController