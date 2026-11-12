<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');
            // sale|refund|void|purchase_receipt|manual_adjustment|damage_loss|initial_stock
            $table->string('type', 30);
            $table->integer('quantity');   // positive = stock in, negative = stock out
            $table->integer('quantity_before');
            $table->integer('quantity_after');
            $table->unsignedBigInteger('unit_cost')->default(0);
            $table->string('reference_type', 50)->nullable(); // Sale, PurchaseReceipt, etc.
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('reason')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->index(['product_id', 'created_at']);
            $table->index(['reference_type', 'reference_id']);
            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
