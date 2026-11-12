<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sale_id');
            $table->unsignedBigInteger('product_id')->nullable(); // null if product deleted

            // Snapshot of product data at time of sale
            $table->string('product_name');
            $table->string('product_sku');
            $table->string('product_barcode')->nullable();
            $table->string('vat_type', 20)->default('vatable');

            // Pricing (centavos)
            $table->unsignedBigInteger('unit_price');
            $table->unsignedBigInteger('cost_price')->default(0);
            $table->integer('quantity');
            $table->string('discount_type', 20)->nullable();
            $table->unsignedBigInteger('discount_value')->default(0);
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->unsignedBigInteger('line_total');  // unit_price * qty - discount
            $table->unsignedBigInteger('vat_amount')->default(0);

            $table->timestamps();

            $table->foreign('sale_id')->references('id')->on('sales')->cascadeOnDelete();
            $table->foreign('product_id')->references('id')->on('products')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
