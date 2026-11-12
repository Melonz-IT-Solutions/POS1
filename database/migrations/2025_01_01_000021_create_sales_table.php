<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('receipt_number', 30)->unique();
            $table->unsignedBigInteger('customer_id')->nullable();
            $table->unsignedBigInteger('cashier_id');
            $table->unsignedBigInteger('shift_id')->nullable();
            $table->string('status', 30)->default('completed');
            // completed|held|void|refunded|partially_refunded

            // Monetary totals — all in centavos
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->string('discount_type', 20)->nullable();   // percentage|fixed
            $table->unsignedBigInteger('discount_value')->default(0);
            $table->unsignedBigInteger('discount_amount')->default(0);
            $table->unsignedBigInteger('vatable_sales')->default(0);     // net VATable amount (excl. VAT)
            $table->unsignedBigInteger('vat_exempt_sales')->default(0);
            $table->unsignedBigInteger('zero_rated_sales')->default(0);
            $table->unsignedBigInteger('vat_amount')->default(0);
            $table->unsignedBigInteger('total_amount')->default(0);
            $table->unsignedBigInteger('amount_tendered')->default(0);
            $table->unsignedBigInteger('change_amount')->default(0);

            $table->text('notes')->nullable();

            // Senior Citizen / PWD fields (BIR requirement)
            $table->string('sc_name')->nullable();
            $table->string('sc_id_no')->nullable();
            $table->string('pwd_name')->nullable();
            $table->string('pwd_id_no')->nullable();

            // Void
            $table->unsignedBigInteger('voided_by')->nullable();
            $table->timestamp('voided_at')->nullable();
            $table->text('void_reason')->nullable();

            // Refund reference
            $table->unsignedBigInteger('original_sale_id')->nullable();

            $table->timestamp('parked_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['receipt_number']);
            $table->index(['cashier_id', 'created_at']);
            $table->index(['status', 'created_at']);
            $table->index(['customer_id']);

            $table->foreign('customer_id')->references('id')->on('customers')->nullOnDelete();
            $table->foreign('cashier_id')->references('id')->on('users');
            $table->foreign('shift_id')->references('id')->on('shifts')->nullOnDelete();
            $table->foreign('voided_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('original_sale_id')->references('id')->on('sales')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
