<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Discount;
use App\Models\Product;
use App\Models\PurchaseOrder;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\CustomerPolicy;
use App\Policies\DiscountPolicy;
use App\Policies\ProductPolicy;
use App\Policies\PurchaseOrderPolicy;
use App\Policies\SalePolicy;
use App\Policies\SupplierPolicy;
use App\Policies\UserPolicy;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\Contracts\SaleRepositoryInterface;
use App\Repositories\ProductRepository;
use App\Repositories\SaleRepository;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
        $this->app->bind(SaleRepositoryInterface::class, SaleRepository::class);
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerPolicies();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);
        DB::prohibitDestructiveCommands(app()->isProduction());
        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)->mixedCase()->letters()->numbers()->symbols()->uncompromised()
            : null,
        );
    }

    protected function registerPolicies(): void
    {
        Gate::policy(Sale::class, SalePolicy::class);
        Gate::policy(Product::class, ProductPolicy::class);
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Customer::class, CustomerPolicy::class);
        Gate::policy(Discount::class, DiscountPolicy::class);
        Gate::policy(PurchaseOrder::class, PurchaseOrderPolicy::class);
        Gate::policy(Supplier::class, SupplierPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
    }
}
