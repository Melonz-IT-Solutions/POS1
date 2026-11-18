import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SupplierController::index
* @see app/Http/Controllers/Admin/SupplierController.php:18
* @route '/admin/suppliers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/suppliers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SupplierController::index
* @see app/Http/Controllers/Admin/SupplierController.php:18
* @route '/admin/suppliers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SupplierController::index
* @see app/Http/Controllers/Admin/SupplierController.php:18
* @route '/admin/suppliers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::index
* @see app/Http/Controllers/Admin/SupplierController.php:18
* @route '/admin/suppliers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::create
* @see app/Http/Controllers/Admin/SupplierController.php:48
* @route '/admin/suppliers/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/suppliers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SupplierController::create
* @see app/Http/Controllers/Admin/SupplierController.php:48
* @route '/admin/suppliers/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SupplierController::create
* @see app/Http/Controllers/Admin/SupplierController.php:48
* @route '/admin/suppliers/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::create
* @see app/Http/Controllers/Admin/SupplierController.php:48
* @route '/admin/suppliers/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::store
* @see app/Http/Controllers/Admin/SupplierController.php:60
* @route '/admin/suppliers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/suppliers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SupplierController::store
* @see app/Http/Controllers/Admin/SupplierController.php:60
* @route '/admin/suppliers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SupplierController::store
* @see app/Http/Controllers/Admin/SupplierController.php:60
* @route '/admin/suppliers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::show
* @see app/Http/Controllers/Admin/SupplierController.php:80
* @route '/admin/suppliers/{supplier}'
*/
export const show = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/suppliers/{supplier}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SupplierController::show
* @see app/Http/Controllers/Admin/SupplierController.php:80
* @route '/admin/suppliers/{supplier}'
*/
show.url = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { supplier: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { supplier: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            supplier: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        supplier: typeof args.supplier === 'object'
        ? args.supplier.id
        : args.supplier,
    }

    return show.definition.url
            .replace('{supplier}', parsedArgs.supplier.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SupplierController::show
* @see app/Http/Controllers/Admin/SupplierController.php:80
* @route '/admin/suppliers/{supplier}'
*/
show.get = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::show
* @see app/Http/Controllers/Admin/SupplierController.php:80
* @route '/admin/suppliers/{supplier}'
*/
show.head = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::edit
* @see app/Http/Controllers/Admin/SupplierController.php:111
* @route '/admin/suppliers/{supplier}/edit'
*/
export const edit = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/suppliers/{supplier}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SupplierController::edit
* @see app/Http/Controllers/Admin/SupplierController.php:111
* @route '/admin/suppliers/{supplier}/edit'
*/
edit.url = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { supplier: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { supplier: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            supplier: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        supplier: typeof args.supplier === 'object'
        ? args.supplier.id
        : args.supplier,
    }

    return edit.definition.url
            .replace('{supplier}', parsedArgs.supplier.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SupplierController::edit
* @see app/Http/Controllers/Admin/SupplierController.php:111
* @route '/admin/suppliers/{supplier}/edit'
*/
edit.get = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::edit
* @see app/Http/Controllers/Admin/SupplierController.php:111
* @route '/admin/suppliers/{supplier}/edit'
*/
edit.head = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::update
* @see app/Http/Controllers/Admin/SupplierController.php:126
* @route '/admin/suppliers/{supplier}'
*/
export const update = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/suppliers/{supplier}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\SupplierController::update
* @see app/Http/Controllers/Admin/SupplierController.php:126
* @route '/admin/suppliers/{supplier}'
*/
update.url = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { supplier: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { supplier: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            supplier: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        supplier: typeof args.supplier === 'object'
        ? args.supplier.id
        : args.supplier,
    }

    return update.definition.url
            .replace('{supplier}', parsedArgs.supplier.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SupplierController::update
* @see app/Http/Controllers/Admin/SupplierController.php:126
* @route '/admin/suppliers/{supplier}'
*/
update.put = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::update
* @see app/Http/Controllers/Admin/SupplierController.php:126
* @route '/admin/suppliers/{supplier}'
*/
update.patch = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::destroy
* @see app/Http/Controllers/Admin/SupplierController.php:148
* @route '/admin/suppliers/{supplier}'
*/
export const destroy = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/suppliers/{supplier}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SupplierController::destroy
* @see app/Http/Controllers/Admin/SupplierController.php:148
* @route '/admin/suppliers/{supplier}'
*/
destroy.url = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { supplier: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { supplier: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            supplier: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        supplier: typeof args.supplier === 'object'
        ? args.supplier.id
        : args.supplier,
    }

    return destroy.definition.url
            .replace('{supplier}', parsedArgs.supplier.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SupplierController::destroy
* @see app/Http/Controllers/Admin/SupplierController.php:148
* @route '/admin/suppliers/{supplier}'
*/
destroy.delete = (args: { supplier: number | { id: number } } | [supplier: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SupplierController::restore
* @see app/Http/Controllers/Admin/SupplierController.php:159
* @route '/admin/suppliers/{id}/restore'
*/
export const restore = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/admin/suppliers/{id}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SupplierController::restore
* @see app/Http/Controllers/Admin/SupplierController.php:159
* @route '/admin/suppliers/{id}/restore'
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
* @see \App\Http\Controllers\Admin\SupplierController::restore
* @see app/Http/Controllers/Admin/SupplierController.php:159
* @route '/admin/suppliers/{id}/restore'
*/
restore.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

const suppliers = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    restore: Object.assign(restore, restore),
}

export default suppliers