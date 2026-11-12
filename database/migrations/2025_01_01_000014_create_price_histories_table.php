<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('old_cost_price')->nullable();
            $table->unsignedBigInteger('new_cost_price')->nullable();
            $table->unsignedBigInteger('old_selling_price')->nullable();
            $table->unsignedBigInteger('new_selling_price')->nullable();
            $table->unsignedBigInteger('changed_by');
            $table->string('reason')->nullable();
            $table->timestamps();

            $table->index(['product_id', 'created_at']);
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->foreign('changed_by')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_histories');
    }
};
