<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sale_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sale_id');
            $table->string('payment_method', 30);  // cash|card|gcash|maya|...
            $table->unsignedBigInteger('amount');   // centavos
            $table->string('reference_number')->nullable();
            $table->timestamps();

            $table->foreign('sale_id')->references('id')->on('sales')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_payments');
    }
};
