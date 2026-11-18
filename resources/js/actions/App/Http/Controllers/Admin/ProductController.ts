import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ProductController::labels
* @see app/Http/Controllers/Admin/ProductController.php:272
* @route '/admin/products/labels'
*/
export const labels = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: labels.url(options),
    method: 'get',
})

labels.definition = {
    methods: ["get","head"],
    url: '/admin/products/labels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::labels
* @see app/Http/Controllers/Admin/ProductController.php:272
* @route '/admin/products/labels'
*/
labels.url = (options?: RouteQueryOptions) => {
    return labels.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::labels
* @see app/Http/Controllers/Admin/ProductController.php:272
* @route '/admin/products/labels'
*/
labels.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: labels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::labels
* @see app/Http/Controllers/Admin/ProductController.php:272
* @route '/admin/products/labels'
*/
labels.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: labels.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::labels
* @see app/Http/Controllers/Admin/ProductController.php:272
* @route '/admin/products/labels'
*/
const labelsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: labels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::labels
* @see app/Http/Controllers/Admin/ProductController.php:272
* @route '/admin/products/labels'
*/
labelsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: labels.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::labels
* @see app/Http/Controllers/Admin/ProductController.php:272
* @route '/admin/products/labels'
*/
labelsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: labels.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

labels.form = labelsForm

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceIndex
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
export const bulkPriceIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPriceIndex.url(options),
    method: 'get',
})

bulkPriceIndex.definition = {
    methods: ["get","head"],
    url: '/admin/products/bulk-price',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceIndex
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPriceIndex.url = (options?: RouteQueryOptions) => {
    return bulkPriceIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceIndex
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPriceIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPriceIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceIndex
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPriceIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkPriceIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceIndex
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
const bulkPriceIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceIndex
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPriceIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceIndex
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPriceIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceIndex.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bulkPriceIndex.form = bulkPriceIndexForm

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceUpdate
* @see app/Http/Controllers/Admin/ProductController.php:208
* @route '/admin/products/bulk-price'
*/
export const bulkPriceUpdate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPriceUpdate.url(options),
    method: 'post',
})

bulkPriceUpdate.definition = {
    methods: ["post"],
    url: '/admin/products/bulk-price',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceUpdate
* @see app/Http/Controllers/Admin/ProductController.php:208
* @route '/admin/products/bulk-price'
*/
bulkPriceUpdate.url = (options?: RouteQueryOptions) => {
    return bulkPriceUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceUpdate
* @see app/Http/Controllers/Admin/ProductController.php:208
* @route '/admin/products/bulk-price'
*/
bulkPriceUpdate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPriceUpdate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceUpdate
* @see app/Http/Controllers/Admin/ProductController.php:208
* @route '/admin/products/bulk-price'
*/
const bulkPriceUpdateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkPriceUpdate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPriceUpdate
* @see app/Http/Controllers/Admin/ProductController.php:208
* @route '/admin/products/bulk-price'
*/
bulkPriceUpdateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkPriceUpdate.url(options),
    method: 'post',
})

bulkPriceUpdate.form = bulkPriceUpdateForm

/**
* @see \App\Http\Controllers\Admin\ProductController::index
* @see app/Http/Controllers/Admin/ProductController.php:22
* @route '/admin/products'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::index
* @see app/Http/Controllers/Admin/ProductController.php:22
* @route '/admin/products'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::index
* @see app/Http/Controllers/Admin/ProductController.php:22
* @route '/admin/products'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::index
* @see app/Http/Controllers/Admin/ProductController.php:22
* @route '/admin/products'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::index
* @see app/Http/Controllers/Admin/ProductController.php:22
* @route '/admin/products'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::index
* @see app/Http/Controllers/Admin/ProductController.php:22
* @route '/admin/products'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::index
* @see app/Http/Controllers/Admin/ProductController.php:22
* @route '/admin/products'
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
* @see \App\Http\Controllers\Admin\ProductController::create
* @see app/Http/Controllers/Admin/ProductController.php:53
* @route '/admin/products/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/products/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::create
* @see app/Http/Controllers/Admin/ProductController.php:53
* @route '/admin/products/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::create
* @see app/Http/Controllers/Admin/ProductController.php:53
* @route '/admin/products/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::create
* @see app/Http/Controllers/Admin/ProductController.php:53
* @route '/admin/products/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::create
* @see app/Http/Controllers/Admin/ProductController.php:53
* @route '/admin/products/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::create
* @see app/Http/Controllers/Admin/ProductController.php:53
* @route '/admin/products/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::create
* @see app/Http/Controllers/Admin/ProductController.php:53
* @route '/admin/products/create'
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
* @see \App\Http\Controllers\Admin\ProductController::store
* @see app/Http/Controllers/Admin/ProductController.php:66
* @route '/admin/products'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/products',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::store
* @see app/Http/Controllers/Admin/ProductController.php:66
* @route '/admin/products'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::store
* @see app/Http/Controllers/Admin/ProductController.php:66
* @route '/admin/products'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::store
* @see app/Http/Controllers/Admin/ProductController.php:66
* @route '/admin/products'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::store
* @see app/Http/Controllers/Admin/ProductController.php:66
* @route '/admin/products'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\ProductController::show
* @see app/Http/Controllers/Admin/ProductController.php:84
* @route '/admin/products/{product}'
*/
export const show = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::show
* @see app/Http/Controllers/Admin/ProductController.php:84
* @route '/admin/products/{product}'
*/
show.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return show.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::show
* @see app/Http/Controllers/Admin/ProductController.php:84
* @route '/admin/products/{product}'
*/
show.get = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::show
* @see app/Http/Controllers/Admin/ProductController.php:84
* @route '/admin/products/{product}'
*/
show.head = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::show
* @see app/Http/Controllers/Admin/ProductController.php:84
* @route '/admin/products/{product}'
*/
const showForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::show
* @see app/Http/Controllers/Admin/ProductController.php:84
* @route '/admin/products/{product}'
*/
showForm.get = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::show
* @see app/Http/Controllers/Admin/ProductController.php:84
* @route '/admin/products/{product}'
*/
showForm.head = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\ProductController::edit
* @see app/Http/Controllers/Admin/ProductController.php:108
* @route '/admin/products/{product}/edit'
*/
export const edit = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/products/{product}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::edit
* @see app/Http/Controllers/Admin/ProductController.php:108
* @route '/admin/products/{product}/edit'
*/
edit.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return edit.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::edit
* @see app/Http/Controllers/Admin/ProductController.php:108
* @route '/admin/products/{product}/edit'
*/
edit.get = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::edit
* @see app/Http/Controllers/Admin/ProductController.php:108
* @route '/admin/products/{product}/edit'
*/
edit.head = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::edit
* @see app/Http/Controllers/Admin/ProductController.php:108
* @route '/admin/products/{product}/edit'
*/
const editForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::edit
* @see app/Http/Controllers/Admin/ProductController.php:108
* @route '/admin/products/{product}/edit'
*/
editForm.get = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::edit
* @see app/Http/Controllers/Admin/ProductController.php:108
* @route '/admin/products/{product}/edit'
*/
editForm.head = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:122
* @route '/admin/products/{product}'
*/
export const update = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:122
* @route '/admin/products/{product}'
*/
update.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return update.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:122
* @route '/admin/products/{product}'
*/
update.put = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:122
* @route '/admin/products/{product}'
*/
update.patch = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:122
* @route '/admin/products/{product}'
*/
const updateForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:122
* @route '/admin/products/{product}'
*/
updateForm.put = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::update
* @see app/Http/Controllers/Admin/ProductController.php:122
* @route '/admin/products/{product}'
*/
updateForm.patch = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\ProductController::destroy
* @see app/Http/Controllers/Admin/ProductController.php:160
* @route '/admin/products/{product}'
*/
export const destroy = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::destroy
* @see app/Http/Controllers/Admin/ProductController.php:160
* @route '/admin/products/{product}'
*/
destroy.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return destroy.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::destroy
* @see app/Http/Controllers/Admin/ProductController.php:160
* @route '/admin/products/{product}'
*/
destroy.delete = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::destroy
* @see app/Http/Controllers/Admin/ProductController.php:160
* @route '/admin/products/{product}'
*/
const destroyForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::destroy
* @see app/Http/Controllers/Admin/ProductController.php:160
* @route '/admin/products/{product}'
*/
destroyForm.delete = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\ProductController::restore
* @see app/Http/Controllers/Admin/ProductController.php:173
* @route '/admin/products/{id}/restore'
*/
export const restore = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

restore.definition = {
    methods: ["post"],
    url: '/admin/products/{id}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::restore
* @see app/Http/Controllers/Admin/ProductController.php:173
* @route '/admin/products/{id}/restore'
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
* @see \App\Http\Controllers\Admin\ProductController::restore
* @see app/Http/Controllers/Admin/ProductController.php:173
* @route '/admin/products/{id}/restore'
*/
restore.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::restore
* @see app/Http/Controllers/Admin/ProductController.php:173
* @route '/admin/products/{id}/restore'
*/
const restoreForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::restore
* @see app/Http/Controllers/Admin/ProductController.php:173
* @route '/admin/products/{id}/restore'
*/
restoreForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: restore.url(args, options),
    method: 'post',
})

restore.form = restoreForm

const ProductController = { labels, bulkPriceIndex, bulkPriceUpdate, index, create, store, show, edit, update, destroy, restore }

export default ProductController