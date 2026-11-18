import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CustomerController::index
* @see app/Http/Controllers/Admin/CustomerController.php:17
* @route '/admin/customers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/customers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::index
* @see app/Http/Controllers/Admin/CustomerController.php:17
* @route '/admin/customers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::index
* @see app/Http/Controllers/Admin/CustomerController.php:17
* @route '/admin/customers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::index
* @see app/Http/Controllers/Admin/CustomerController.php:17
* @route '/admin/customers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::index
* @see app/Http/Controllers/Admin/CustomerController.php:17
* @route '/admin/customers'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::index
* @see app/Http/Controllers/Admin/CustomerController.php:17
* @route '/admin/customers'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::index
* @see app/Http/Controllers/Admin/CustomerController.php:17
* @route '/admin/customers'
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
* @see \App\Http\Controllers\Admin\CustomerController::create
* @see app/Http/Controllers/Admin/CustomerController.php:42
* @route '/admin/customers/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/customers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::create
* @see app/Http/Controllers/Admin/CustomerController.php:42
* @route '/admin/customers/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::create
* @see app/Http/Controllers/Admin/CustomerController.php:42
* @route '/admin/customers/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::create
* @see app/Http/Controllers/Admin/CustomerController.php:42
* @route '/admin/customers/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::create
* @see app/Http/Controllers/Admin/CustomerController.php:42
* @route '/admin/customers/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::create
* @see app/Http/Controllers/Admin/CustomerController.php:42
* @route '/admin/customers/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::create
* @see app/Http/Controllers/Admin/CustomerController.php:42
* @route '/admin/customers/create'
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
* @see \App\Http\Controllers\Admin\CustomerController::store
* @see app/Http/Controllers/Admin/CustomerController.php:47
* @route '/admin/customers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/customers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::store
* @see app/Http/Controllers/Admin/CustomerController.php:47
* @route '/admin/customers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::store
* @see app/Http/Controllers/Admin/CustomerController.php:47
* @route '/admin/customers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::store
* @see app/Http/Controllers/Admin/CustomerController.php:47
* @route '/admin/customers'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::store
* @see app/Http/Controllers/Admin/CustomerController.php:47
* @route '/admin/customers'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
* @see app/Http/Controllers/Admin/CustomerController.php:57
* @route '/admin/customers/{customer}'
*/
export const show = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/customers/{customer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
* @see app/Http/Controllers/Admin/CustomerController.php:57
* @route '/admin/customers/{customer}'
*/
show.url = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return show.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
* @see app/Http/Controllers/Admin/CustomerController.php:57
* @route '/admin/customers/{customer}'
*/
show.get = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
* @see app/Http/Controllers/Admin/CustomerController.php:57
* @route '/admin/customers/{customer}'
*/
show.head = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
* @see app/Http/Controllers/Admin/CustomerController.php:57
* @route '/admin/customers/{customer}'
*/
const showForm = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
* @see app/Http/Controllers/Admin/CustomerController.php:57
* @route '/admin/customers/{customer}'
*/
showForm.get = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::show
* @see app/Http/Controllers/Admin/CustomerController.php:57
* @route '/admin/customers/{customer}'
*/
showForm.head = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\CustomerController::edit
* @see app/Http/Controllers/Admin/CustomerController.php:83
* @route '/admin/customers/{customer}/edit'
*/
export const edit = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/customers/{customer}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
* @see app/Http/Controllers/Admin/CustomerController.php:83
* @route '/admin/customers/{customer}/edit'
*/
edit.url = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return edit.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
* @see app/Http/Controllers/Admin/CustomerController.php:83
* @route '/admin/customers/{customer}/edit'
*/
edit.get = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
* @see app/Http/Controllers/Admin/CustomerController.php:83
* @route '/admin/customers/{customer}/edit'
*/
edit.head = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
* @see app/Http/Controllers/Admin/CustomerController.php:83
* @route '/admin/customers/{customer}/edit'
*/
const editForm = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
* @see app/Http/Controllers/Admin/CustomerController.php:83
* @route '/admin/customers/{customer}/edit'
*/
editForm.get = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::edit
* @see app/Http/Controllers/Admin/CustomerController.php:83
* @route '/admin/customers/{customer}/edit'
*/
editForm.head = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
* @see app/Http/Controllers/Admin/CustomerController.php:90
* @route '/admin/customers/{customer}'
*/
export const update = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/customers/{customer}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
* @see app/Http/Controllers/Admin/CustomerController.php:90
* @route '/admin/customers/{customer}'
*/
update.url = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return update.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
* @see app/Http/Controllers/Admin/CustomerController.php:90
* @route '/admin/customers/{customer}'
*/
update.put = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
* @see app/Http/Controllers/Admin/CustomerController.php:90
* @route '/admin/customers/{customer}'
*/
update.patch = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
* @see app/Http/Controllers/Admin/CustomerController.php:90
* @route '/admin/customers/{customer}'
*/
const updateForm = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
* @see app/Http/Controllers/Admin/CustomerController.php:90
* @route '/admin/customers/{customer}'
*/
updateForm.put = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::update
* @see app/Http/Controllers/Admin/CustomerController.php:90
* @route '/admin/customers/{customer}'
*/
updateForm.patch = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Admin\CustomerController::destroy
* @see app/Http/Controllers/Admin/CustomerController.php:101
* @route '/admin/customers/{customer}'
*/
export const destroy = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/customers/{customer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::destroy
* @see app/Http/Controllers/Admin/CustomerController.php:101
* @route '/admin/customers/{customer}'
*/
destroy.url = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return destroy.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::destroy
* @see app/Http/Controllers/Admin/CustomerController.php:101
* @route '/admin/customers/{customer}'
*/
destroy.delete = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::destroy
* @see app/Http/Controllers/Admin/CustomerController.php:101
* @route '/admin/customers/{customer}'
*/
const destroyForm = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::destroy
* @see app/Http/Controllers/Admin/CustomerController.php:101
* @route '/admin/customers/{customer}'
*/
destroyForm.delete = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\Admin\CustomerController::restore
* @see app/Http/Controllers/Admin/CustomerController.php:114
* @route '/admin/customers/{id}/restore'
*/
export const restore = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/admin/customers/{id}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::restore
* @see app/Http/Controllers/Admin/CustomerController.php:114
* @route '/admin/customers/{id}/restore'
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
* @see \App\Http\Controllers\Admin\CustomerController::restore
* @see app/Http/Controllers/Admin/CustomerController.php:114
* @route '/admin/customers/{id}/restore'
*/
restore.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::restore
* @see app/Http/Controllers/Admin/CustomerController.php:114
* @route '/admin/customers/{id}/restore'
*/
const restoreForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::restore
* @see app/Http/Controllers/Admin/CustomerController.php:114
* @route '/admin/customers/{id}/restore'
*/
restoreForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

restore.form = restoreForm

/**
* @see \App\Http\Controllers\Admin\CustomerController::adjustPoints
* @see app/Http/Controllers/Admin/CustomerController.php:126
* @route '/admin/customers/{customer}/points'
*/
export const adjustPoints = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjustPoints.url(args, options),
    method: 'post',
})

adjustPoints.definition = {
    methods: ["post"],
    url: '/admin/customers/{customer}/points',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CustomerController::adjustPoints
* @see app/Http/Controllers/Admin/CustomerController.php:126
* @route '/admin/customers/{customer}/points'
*/
adjustPoints.url = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { customer: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            customer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customer: typeof args.customer === 'object'
        ? args.customer.id
        : args.customer,
    }

    return adjustPoints.definition.url
            .replace('{customer}', parsedArgs.customer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CustomerController::adjustPoints
* @see app/Http/Controllers/Admin/CustomerController.php:126
* @route '/admin/customers/{customer}/points'
*/
adjustPoints.post = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjustPoints.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::adjustPoints
* @see app/Http/Controllers/Admin/CustomerController.php:126
* @route '/admin/customers/{customer}/points'
*/
const adjustPointsForm = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: adjustPoints.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CustomerController::adjustPoints
* @see app/Http/Controllers/Admin/CustomerController.php:126
* @route '/admin/customers/{customer}/points'
*/
adjustPointsForm.post = (args: { customer: string | number | { id: string | number } } | [customer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: adjustPoints.url(args, options),
    method: 'post',
})

adjustPoints.form = adjustPointsForm

const CustomerController = { index, create, store, show, edit, update, destroy, restore, adjustPoints }

export default CustomerController