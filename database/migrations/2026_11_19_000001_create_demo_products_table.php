<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('demo_products', function (Blueprint $table) {
            $table->id();
            $table->string('store_type', 32)->index();
            $table->string('name');
            $table->string('sku', 32);
            $table->string('category', 64);
            $table->unsignedBigInteger('price_cents');
            $table->unsignedInteger('stock')->default(100);
            $table->string('barcode', 64)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demo_products');
    }
};
