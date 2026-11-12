<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique()->nullable();
            $table->string('type', 20);               // percentage|fixed
            $table->unsignedBigInteger('value');       // centavos or basis points (5000 = 50%)
            $table->unsignedBigInteger('min_purchase')->default(0);
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();
            $table->boolean('is_active')->default(true);
            // all|products|categories|customers
            $table->string('scope', 20)->default('all');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('discount_products', function (Blueprint $table) {
            $table->unsignedBigInteger('discount_id');
            $table->unsignedBigInteger('product_id');
            $table->primary(['discount_id', 'product_id']);
        });

        Schema::create('discount_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('discount_id');
            $table->unsignedBigInteger('category_id');
            $table->primary(['discount_id', 'category_id']);
        });

        Schema::create('discount_customers', function (Blueprint $table) {
            $table->unsignedBigInteger('discount_id');
            $table->unsignedBigInteger('customer_id');
            $table->primary(['discount_id', 'customer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discount_customers');
        Schema::dropIfExists('discount_categories');
        Schema::dropIfExists('discount_products');
        Schema::dropIfExists('discounts');
    }
};
