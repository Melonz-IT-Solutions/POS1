import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ShiftController::index
* @see app/Http/Controllers/Admin/ShiftController.php:16
* @route '/admin/shifts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/shifts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ShiftController::index
* @see app/Http/Controllers/Admin/ShiftController.php:16
* @route '/admin/shifts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ShiftController::index
* @see app/Http/Controllers/Admin/ShiftController.php:16
* @route '/admin/shifts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ShiftController::index
* @see app/Http/Controllers/Admin/ShiftController.php:16
* @route '/admin/shifts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ShiftController::report
* @see app/Http/Controllers/Admin/ShiftController.php:79
* @route '/admin/shifts/{shift}/report'
*/
export const report = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: report.url(args, options),
    method: 'get',
})

report.definition = {
    methods: ["get","head"],
    url: '/admin/shifts/{shift}/report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ShiftController::report
* @see app/Http/Controllers/Admin/ShiftController.php:79
* @route '/admin/shifts/{shift}/report'
*/
report.url = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shift: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { shift: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            shift: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        shift: typeof args.shift === 'object'
        ? args.shift.id
        : args.shift,
    }

    return report.definition.url
            .replace('{shift}', parsedArgs.shift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ShiftController::report
* @see app/Http/Controllers/Admin/ShiftController.php:79
* @route '/admin/shifts/{shift}/report'
*/
report.get = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: report.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ShiftController::report
* @see app/Http/Controllers/Admin/ShiftController.php:79
* @route '/admin/shifts/{shift}/report'
*/
report.head = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: report.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ShiftController::show
* @see app/Http/Controllers/Admin/ShiftController.php:50
* @route '/admin/shifts/{shift}'
*/
export const show = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/shifts/{shift}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ShiftController::show
* @see app/Http/Controllers/Admin/ShiftController.php:50
* @route '/admin/shifts/{shift}'
*/
show.url = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shift: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { shift: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            shift: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        shift: typeof args.shift === 'object'
        ? args.shift.id
        : args.shift,
    }

    return show.definition.url
            .replace('{shift}', parsedArgs.shift.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ShiftController::show
* @see app/Http/Controllers/Admin/ShiftController.php:50
* @route '/admin/shifts/{shift}'
*/
show.get = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\ShiftController::show
* @see app/Http/Controllers/Admin/ShiftController.php:50
* @route '/admin/shifts/{shift}'
*/
show.head = (args: { shift: number | { id: number } } | [shift: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

const ShiftController = { index, report, show }

export default ShiftController