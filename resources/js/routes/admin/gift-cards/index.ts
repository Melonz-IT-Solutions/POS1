import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GiftCardController::checkBalance
* @see app/Http/Controllers/Admin/GiftCardController.php:185
* @route '/admin/gift-cards/check-balance'
*/
export const checkBalance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkBalance.url(options),
    method: 'get',
})

checkBalance.definition = {
    methods: ["get","head"],
    url: '/admin/gift-cards/check-balance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GiftCardController::checkBalance
* @see app/Http/Controllers/Admin/GiftCardController.php:185
* @route '/admin/gift-cards/check-balance'
*/
checkBalance.url = (options?: RouteQueryOptions) => {
    return checkBalance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GiftCardController::checkBalance
* @see app/Http/Controllers/Admin/GiftCardController.php:185
* @route '/admin/gift-cards/check-balance'
*/
checkBalance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkBalance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::checkBalance
* @see app/Http/Controllers/Admin/GiftCardController.php:185
* @route '/admin/gift-cards/check-balance'
*/
checkBalance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkBalance.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::checkBalance
* @see app/Http/Controllers/Admin/GiftCardController.php:185
* @route '/admin/gift-cards/check-balance'
*/
const checkBalanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkBalance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::checkBalance
* @see app/Http/Controllers/Admin/GiftCardController.php:185
* @route '/admin/gift-cards/check-balance'
*/
checkBalanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkBalance.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::checkBalance
* @see app/Http/Controllers/Admin/GiftCardController.php:185
* @route '/admin/gift-cards/check-balance'
*/
checkBalanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkBalance.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

checkBalance.form = checkBalanceForm

/**
* @see \App\Http\Controllers\Admin\GiftCardController::index
* @see app/Http/Controllers/Admin/GiftCardController.php:19
* @route '/admin/gift-cards'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/gift-cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GiftCardController::index
* @see app/Http/Controllers/Admin/GiftCardController.php:19
* @route '/admin/gift-cards'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GiftCardController::index
* @see app/Http/Controllers/Admin/GiftCardController.php:19
* @route '/admin/gift-cards'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::index
* @see app/Http/Controllers/Admin/GiftCardController.php:19
* @route '/admin/gift-cards'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::index
* @see app/Http/Controllers/Admin/GiftCardController.php:19
* @route '/admin/gift-cards'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::index
* @see app/Http/Controllers/Admin/GiftCardController.php:19
* @route '/admin/gift-cards'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::index
* @see app/Http/Controllers/Admin/GiftCardController.php:19
* @route '/admin/gift-cards'
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
* @see \App\Http\Controllers\Admin\GiftCardController::create
* @see app/Http/Controllers/Admin/GiftCardController.php:50
* @route '/admin/gift-cards/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/gift-cards/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GiftCardController::create
* @see app/Http/Controllers/Admin/GiftCardController.php:50
* @route '/admin/gift-cards/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GiftCardController::create
* @see app/Http/Controllers/Admin/GiftCardController.php:50
* @route '/admin/gift-cards/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::create
* @see app/Http/Controllers/Admin/GiftCardController.php:50
* @route '/admin/gift-cards/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::create
* @see app/Http/Controllers/Admin/GiftCardController.php:50
* @route '/admin/gift-cards/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::create
* @see app/Http/Controllers/Admin/GiftCardController.php:50
* @route '/admin/gift-cards/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::create
* @see app/Http/Controllers/Admin/GiftCardController.php:50
* @route '/admin/gift-cards/create'
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
* @see \App\Http\Controllers\Admin\GiftCardController::store
* @see app/Http/Controllers/Admin/GiftCardController.php:60
* @route '/admin/gift-cards'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/gift-cards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GiftCardController::store
* @see app/Http/Controllers/Admin/GiftCardController.php:60
* @route '/admin/gift-cards'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GiftCardController::store
* @see app/Http/Controllers/Admin/GiftCardController.php:60
* @route '/admin/gift-cards'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::store
* @see app/Http/Controllers/Admin/GiftCardController.php:60
* @route '/admin/gift-cards'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::store
* @see app/Http/Controllers/Admin/GiftCardController.php:60
* @route '/admin/gift-cards'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Admin\GiftCardController::show
* @see app/Http/Controllers/Admin/GiftCardController.php:107
* @route '/admin/gift-cards/{gift_card}'
*/
export const show = (args: { gift_card: string | number | { id: string | number } } | [gift_card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/gift-cards/{gift_card}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GiftCardController::show
* @see app/Http/Controllers/Admin/GiftCardController.php:107
* @route '/admin/gift-cards/{gift_card}'
*/
show.url = (args: { gift_card: string | number | { id: string | number } } | [gift_card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gift_card: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { gift_card: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            gift_card: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        gift_card: typeof args.gift_card === 'object'
        ? args.gift_card.id
        : args.gift_card,
    }

    return show.definition.url
            .replace('{gift_card}', parsedArgs.gift_card.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GiftCardController::show
* @see app/Http/Controllers/Admin/GiftCardController.php:107
* @route '/admin/gift-cards/{gift_card}'
*/
show.get = (args: { gift_card: string | number | { id: string | number } } | [gift_card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::show
* @see app/Http/Controllers/Admin/GiftCardController.php:107
* @route '/admin/gift-cards/{gift_card}'
*/
show.head = (args: { gift_card: string | number | { id: string | number } } | [gift_card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::show
* @see app/Http/Controllers/Admin/GiftCardController.php:107
* @route '/admin/gift-cards/{gift_card}'
*/
const showForm = (args: { gift_card: string | number | { id: string | number } } | [gift_card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::show
* @see app/Http/Controllers/Admin/GiftCardController.php:107
* @route '/admin/gift-cards/{gift_card}'
*/
showForm.get = (args: { gift_card: string | number | { id: string | number } } | [gift_card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::show
* @see app/Http/Controllers/Admin/GiftCardController.php:107
* @route '/admin/gift-cards/{gift_card}'
*/
showForm.head = (args: { gift_card: string | number | { id: string | number } } | [gift_card: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\GiftCardController::redeem
* @see app/Http/Controllers/Admin/GiftCardController.php:122
* @route '/admin/gift-cards/{giftCard}/redeem'
*/
export const redeem = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: redeem.url(args, options),
    method: 'post',
})

redeem.definition = {
    methods: ["post"],
    url: '/admin/gift-cards/{giftCard}/redeem',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GiftCardController::redeem
* @see app/Http/Controllers/Admin/GiftCardController.php:122
* @route '/admin/gift-cards/{giftCard}/redeem'
*/
redeem.url = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { giftCard: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { giftCard: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            giftCard: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        giftCard: typeof args.giftCard === 'object'
        ? args.giftCard.id
        : args.giftCard,
    }

    return redeem.definition.url
            .replace('{giftCard}', parsedArgs.giftCard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GiftCardController::redeem
* @see app/Http/Controllers/Admin/GiftCardController.php:122
* @route '/admin/gift-cards/{giftCard}/redeem'
*/
redeem.post = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: redeem.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::redeem
* @see app/Http/Controllers/Admin/GiftCardController.php:122
* @route '/admin/gift-cards/{giftCard}/redeem'
*/
const redeemForm = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: redeem.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::redeem
* @see app/Http/Controllers/Admin/GiftCardController.php:122
* @route '/admin/gift-cards/{giftCard}/redeem'
*/
redeemForm.post = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: redeem.url(args, options),
    method: 'post',
})

redeem.form = redeemForm

/**
* @see \App\Http\Controllers\Admin\GiftCardController::cancel
* @see app/Http/Controllers/Admin/GiftCardController.php:160
* @route '/admin/gift-cards/{giftCard}/cancel'
*/
export const cancel = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/gift-cards/{giftCard}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\GiftCardController::cancel
* @see app/Http/Controllers/Admin/GiftCardController.php:160
* @route '/admin/gift-cards/{giftCard}/cancel'
*/
cancel.url = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { giftCard: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { giftCard: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            giftCard: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        giftCard: typeof args.giftCard === 'object'
        ? args.giftCard.id
        : args.giftCard,
    }

    return cancel.definition.url
            .replace('{giftCard}', parsedArgs.giftCard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GiftCardController::cancel
* @see app/Http/Controllers/Admin/GiftCardController.php:160
* @route '/admin/gift-cards/{giftCard}/cancel'
*/
cancel.post = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::cancel
* @see app/Http/Controllers/Admin/GiftCardController.php:160
* @route '/admin/gift-cards/{giftCard}/cancel'
*/
const cancelForm = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\GiftCardController::cancel
* @see app/Http/Controllers/Admin/GiftCardController.php:160
* @route '/admin/gift-cards/{giftCard}/cancel'
*/
cancelForm.post = (args: { giftCard: string | number | { id: string | number } } | [giftCard: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

cancel.form = cancelForm

const giftCards = {
    checkBalance: Object.assign(checkBalance, checkBalance),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    redeem: Object.assign(redeem, redeem),
    cancel: Object.assign(cancel, cancel),
}

export default giftCards