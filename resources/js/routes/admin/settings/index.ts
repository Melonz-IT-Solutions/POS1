import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SystemSettingsController::index
* @see app/Http/Controllers/Admin/SystemSettingsController.php:17
* @route '/admin/settings'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SystemSettingsController::index
* @see app/Http/Controllers/Admin/SystemSettingsController.php:17
* @route '/admin/settings'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemSettingsController::index
* @see app/Http/Controllers/Admin/SystemSettingsController.php:17
* @route '/admin/settings'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\SystemSettingsController::index
* @see app/Http/Controllers/Admin/SystemSettingsController.php:17
* @route '/admin/settings'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SystemSettingsController::update
* @see app/Http/Controllers/Admin/SystemSettingsController.php:34
* @route '/admin/settings'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/settings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SystemSettingsController::update
* @see app/Http/Controllers/Admin/SystemSettingsController.php:34
* @route '/admin/settings'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SystemSettingsController::update
* @see app/Http/Controllers/Admin/SystemSettingsController.php:34
* @route '/admin/settings'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

const settings = {
    index: Object.assign(index, index),
    update: Object.assign(update, update),
}

export default settings