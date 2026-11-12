<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_suppliers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('supplier_id');
            $table->timestamps();

            $table->unique(['product_id', 'supplier_id']);
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('supplier_id')->references('id')->on('suppliers')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_suppliers');
    }
};
