import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import importMethod7367d2 from './import'
import bulkPrice8b6138 from './bulk-price'
/**
* @see \App\Http\Controllers\Admin\ProductImportController::importMethod
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})

importMethod.definition = {
    methods: ["get","head"],
    url: '/admin/products/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductImportController::importMethod
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductImportController::importMethod
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
importMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductImportController::importMethod
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
importMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProductImportController::importMethod
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: importMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductImportController::importMethod
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
importMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: importMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductImportController::importMethod
* @see app/Http/Controllers/Admin/ProductImportController.php:17
* @route '/admin/products/import'
*/
importMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: importMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

importMethod.form = importMethodForm

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
* @see \App\Http\Controllers\Admin\ProductController::bulkPrice
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
export const bulkPrice = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPrice.url(options),
    method: 'get',
})

bulkPrice.definition = {
    methods: ["get","head"],
    url: '/admin/products/bulk-price',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPrice
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPrice.url = (options?: RouteQueryOptions) => {
    return bulkPrice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPrice
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPrice.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPrice.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPrice
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPrice.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkPrice.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPrice
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
const bulkPriceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPrice.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPrice
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPriceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPrice.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ProductController::bulkPrice
* @see app/Http/Controllers/Admin/ProductController.php:185
* @route '/admin/products/bulk-price'
*/
bulkPriceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPrice.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bulkPrice.form = bulkPriceForm

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

const products = {
    import: Object.assign(importMethod, importMethod7367d2),
    labels: Object.assign(labels, labels),
    bulkPrice: Object.assign(bulkPrice, bulkPrice8b6138),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    restore: Object.assign(restore, restore),
}

export default products