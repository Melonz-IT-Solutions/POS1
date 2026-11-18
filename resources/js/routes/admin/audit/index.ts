import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
* @see app/Http/Controllers/Admin/AuditLogController.php:14
* @route '/admin/audit'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/audit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
* @see app/Http/Controllers/Admin/AuditLogController.php:14
* @route '/admin/audit'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
* @see app/Http/Controllers/Admin/AuditLogController.php:14
* @route '/admin/audit'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
* @see app/Http/Controllers/Admin/AuditLogController.php:14
* @route '/admin/audit'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
* @see app/Http/Controllers/Admin/AuditLogController.php:14
* @route '/admin/audit'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
* @see app/Http/Controllers/Admin/AuditLogController.php:14
* @route '/admin/audit'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::index
* @see app/Http/Controllers/Admin/AuditLogController.php:14
* @route '/admin/audit'
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
* @see \App\Http\Controllers\Admin\AuditLogController::show
* @see app/Http/Controllers/Admin/AuditLogController.php:55
* @route '/admin/audit/{auditLog}'
*/
export const show = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/audit/{auditLog}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuditLogController::show
* @see app/Http/Controllers/Admin/AuditLogController.php:55
* @route '/admin/audit/{auditLog}'
*/
show.url = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditLog: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { auditLog: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            auditLog: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        auditLog: typeof args.auditLog === 'object'
        ? args.auditLog.id
        : args.auditLog,
    }

    return show.definition.url
            .replace('{auditLog}', parsedArgs.auditLog.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuditLogController::show
* @see app/Http/Controllers/Admin/AuditLogController.php:55
* @route '/admin/audit/{auditLog}'
*/
show.get = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::show
* @see app/Http/Controllers/Admin/AuditLogController.php:55
* @route '/admin/audit/{auditLog}'
*/
show.head = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::show
* @see app/Http/Controllers/Admin/AuditLogController.php:55
* @route '/admin/audit/{auditLog}'
*/
const showForm = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::show
* @see app/Http/Controllers/Admin/AuditLogController.php:55
* @route '/admin/audit/{auditLog}'
*/
showForm.get = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AuditLogController::show
* @see app/Http/Controllers/Admin/AuditLogController.php:55
* @route '/admin/audit/{auditLog}'
*/
showForm.head = (args: { auditLog: string | number | { id: string | number } } | [auditLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const audit = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
}

export default audit