<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number', 30)->unique();
            $table->unsignedBigInteger('supplier_id');
            // draft|ordered|partially_received|received|cancelled
            $table->string('status', 30)->default('draft');
            $table->unsignedBigInteger('ordered_by');
            $table->date('expected_date')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->foreign('ordered_by')->references('id')->on('users');
        });

        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_order_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedInteger('quantity_ordered');
            $table->unsignedInteger('quantity_received')->default(0);
            $table->unsignedBigInteger('unit_cost');   // centavos
            $table->unsignedBigInteger('total_cost');  // centavos
            $table->timestamps();

            $table->foreign('purchase_order_id')->references('id')->on('purchase_orders')->cascadeOnDelete();
            $table->foreign('product_id')->references('id')->on('products');
        });

        Schema::create('purchase_receipts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_order_id');
            $table->unsignedBigInteger('received_by');
            $table->timestamp('received_at');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('purchase_order_id')->references('id')->on('purchase_orders');
            $table->foreign('received_by')->references('id')->on('users');
        });

        Schema::create('purchase_receipt_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('purchase_receipt_id');
            $table->unsignedBigInteger('purchase_order_item_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedInteger('quantity_received');
            $table->unsignedBigInteger('unit_cost');
            $table->timestamps();

            $table->foreign('purchase_receipt_id')->references('id')->on('purchase_receipts')->cascadeOnDelete();
            $table->foreign('purchase_order_item_id')->references('id')->on('purchase_order_items');
            $table->foreign('product_id')->references('id')->on('products');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_receipt_items');
        Schema::dropIfExists('purchase_receipts');
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
    }
};
