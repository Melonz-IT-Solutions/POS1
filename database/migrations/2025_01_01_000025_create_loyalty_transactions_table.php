<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id');
            $table->unsignedBigInteger('sale_id')->nullable();
            $table->string('type', 20); // earned|redeemed|adjusted
            $table->integer('points');  // positive=earned, negative=redeemed
            $table->integer('running_balance');
            $table->string('description')->nullable();
            $table->timestamps();

            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('sale_id')->references('id')->on('sales')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_transactions');
    }
};
