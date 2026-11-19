import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\POS\ShiftController::current
* @see app/Http/Controllers/POS/ShiftController.php:17
* @route '/pos/shifts/current'
*/
export const current = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: current.url(options),
    method: 'get',
})

current.definition = {
    methods: ["get","head"],
    url: '/pos/shifts/current',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\ShiftController::current
* @see app/Http/Controllers/POS/ShiftController.php:17
* @route '/pos/shifts/current'
*/
current.url = (options?: RouteQueryOptions) => {
    return current.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ShiftController::current
* @see app/Http/Controllers/POS/ShiftController.php:17
* @route '/pos/shifts/current'
*/
current.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: current.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::current
* @see app/Http/Controllers/POS/ShiftController.php:17
* @route '/pos/shifts/current'
*/
current.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: current.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::current
* @see app/Http/Controllers/POS/ShiftController.php:17
* @route '/pos/shifts/current'
*/
const currentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: current.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::current
* @see app/Http/Controllers/POS/ShiftController.php:17
* @route '/pos/shifts/current'
*/
currentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: current.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::current
* @see app/Http/Controllers/POS/ShiftController.php:17
* @route '/pos/shifts/current'
*/
currentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: current.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

current.form = currentForm

/**
* @see \App\Http\Controllers\POS\ShiftController::summary
* @see app/Http/Controllers/POS/ShiftController.php:69
* @route '/pos/shifts/summary'
*/
export const summary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

summary.definition = {
    methods: ["get","head"],
    url: '/pos/shifts/summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\POS\ShiftController::summary
* @see app/Http/Controllers/POS/ShiftController.php:69
* @route '/pos/shifts/summary'
*/
summary.url = (options?: RouteQueryOptions) => {
    return summary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ShiftController::summary
* @see app/Http/Controllers/POS/ShiftController.php:69
* @route '/pos/shifts/summary'
*/
summary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: summary.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::summary
* @see app/Http/Controllers/POS/ShiftController.php:69
* @route '/pos/shifts/summary'
*/
summary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: summary.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::summary
* @see app/Http/Controllers/POS/ShiftController.php:69
* @route '/pos/shifts/summary'
*/
const summaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: summary.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::summary
* @see app/Http/Controllers/POS/ShiftController.php:69
* @route '/pos/shifts/summary'
*/
summaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: summary.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::summary
* @see app/Http/Controllers/POS/ShiftController.php:69
* @route '/pos/shifts/summary'
*/
summaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: summary.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

summary.form = summaryForm

/**
* @see \App\Http\Controllers\POS\ShiftController::open
* @see app/Http/Controllers/POS/ShiftController.php:26
* @route '/pos/shifts/open'
*/
export const open = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: open.url(options),
    method: 'post',
})

open.definition = {
    methods: ["post"],
    url: '/pos/shifts/open',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\ShiftController::open
* @see app/Http/Controllers/POS/ShiftController.php:26
* @route '/pos/shifts/open'
*/
open.url = (options?: RouteQueryOptions) => {
    return open.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ShiftController::open
* @see app/Http/Controllers/POS/ShiftController.php:26
* @route '/pos/shifts/open'
*/
open.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: open.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::open
* @see app/Http/Controllers/POS/ShiftController.php:26
* @route '/pos/shifts/open'
*/
const openForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: open.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::open
* @see app/Http/Controllers/POS/ShiftController.php:26
* @route '/pos/shifts/open'
*/
openForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: open.url(options),
    method: 'post',
})

open.form = openForm

/**
* @see \App\Http\Controllers\POS\ShiftController::close
* @see app/Http/Controllers/POS/ShiftController.php:42
* @route '/pos/shifts/close'
*/
export const close = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/pos/shifts/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\ShiftController::close
* @see app/Http/Controllers/POS/ShiftController.php:42
* @route '/pos/shifts/close'
*/
close.url = (options?: RouteQueryOptions) => {
    return close.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ShiftController::close
* @see app/Http/Controllers/POS/ShiftController.php:42
* @route '/pos/shifts/close'
*/
close.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::close
* @see app/Http/Controllers/POS/ShiftController.php:42
* @route '/pos/shifts/close'
*/
const closeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: close.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::close
* @see app/Http/Controllers/POS/ShiftController.php:42
* @route '/pos/shifts/close'
*/
closeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: close.url(options),
    method: 'post',
})

close.form = closeForm

/**
* @see \App\Http\Controllers\POS\ShiftController::cashIn
* @see app/Http/Controllers/POS/ShiftController.php:97
* @route '/pos/shifts/cash-in'
*/
export const cashIn = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cashIn.url(options),
    method: 'post',
})

cashIn.definition = {
    methods: ["post"],
    url: '/pos/shifts/cash-in',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\ShiftController::cashIn
* @see app/Http/Controllers/POS/ShiftController.php:97
* @route '/pos/shifts/cash-in'
*/
cashIn.url = (options?: RouteQueryOptions) => {
    return cashIn.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ShiftController::cashIn
* @see app/Http/Controllers/POS/ShiftController.php:97
* @route '/pos/shifts/cash-in'
*/
cashIn.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cashIn.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::cashIn
* @see app/Http/Controllers/POS/ShiftController.php:97
* @route '/pos/shifts/cash-in'
*/
const cashInForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cashIn.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::cashIn
* @see app/Http/Controllers/POS/ShiftController.php:97
* @route '/pos/shifts/cash-in'
*/
cashInForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cashIn.url(options),
    method: 'post',
})

cashIn.form = cashInForm

/**
* @see \App\Http\Controllers\POS\ShiftController::cashOut
* @see app/Http/Controllers/POS/ShiftController.php:114
* @route '/pos/shifts/cash-out'
*/
export const cashOut = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cashOut.url(options),
    method: 'post',
})

cashOut.definition = {
    methods: ["post"],
    url: '/pos/shifts/cash-out',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\POS\ShiftController::cashOut
* @see app/Http/Controllers/POS/ShiftController.php:114
* @route '/pos/shifts/cash-out'
*/
cashOut.url = (options?: RouteQueryOptions) => {
    return cashOut.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\POS\ShiftController::cashOut
* @see app/Http/Controllers/POS/ShiftController.php:114
* @route '/pos/shifts/cash-out'
*/
cashOut.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cashOut.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::cashOut
* @see app/Http/Controllers/POS/ShiftController.php:114
* @route '/pos/shifts/cash-out'
*/
const cashOutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cashOut.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\POS\ShiftController::cashOut
* @see app/Http/Controllers/POS/ShiftController.php:114
* @route '/pos/shifts/cash-out'
*/
cashOutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cashOut.url(options),
    method: 'post',
})

cashOut.form = cashOutForm

const shifts = {
    current: Object.assign(current, current),
    summary: Object.assign(summary, summary),
    open: Object.assign(open, open),
    close: Object.assign(close, close),
    cashIn: Object.assign(cashIn, cashIn),
    cashOut: Object.assign(cashOut, cashOut),
}

export default shifts