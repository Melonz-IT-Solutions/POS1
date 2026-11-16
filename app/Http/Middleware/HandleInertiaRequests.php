<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $flashToast = null;
        foreach (['success', 'error', 'warning', 'info'] as $type) {
            if ($message = $request->session()->get($type)) {
                $flashToast = ['type' => $type, 'message' => $message];
                break;
            }
        }

        $alerts = ['low_stock' => 0, 'draft_pos' => 0];
        if ($user = $request->user()) {
            $alerts['low_stock'] = \App\Models\Product::active()
                ->where(function ($q) {
                    $q->lowStock()->orWhere('stock_quantity', 0);
                })
                ->count();

            if ($user->hasAnyRole(['Administrator', 'Manager'])) {
                $alerts['draft_pos'] = \App\Models\PurchaseOrder::where('status', 'draft')->count();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash'        => ['toast' => $flashToast],
            'alerts'       => $alerts,
        ];
    }
}
