<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('sku')->unique();
            $table->string('barcode')->unique()->nullable();
            $table->string('unit_of_measure', 50)->default('piece');
            // Stored in centavos (integer). ₱1.00 = 100
            $table->unsignedBigInteger('cost_price')->default(0);
            $table->unsignedBigInteger('selling_price')->default(0);
            $table->string('vat_type', 20)->default('vatable'); // vatable|vat_exempt|zero_rated
            $table->integer('stock_quantity')->default(0);
            $table->integer('minimum_stock')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('image_path')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['barcode']);
            $table->index(['sku']);
            $table->index(['is_active', 'stock_quantity']);
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
