<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('layaway_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('layaway_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('amount');     // centavos
            $table->string('payment_method')->default('cash');
            $table->string('reference')->nullable();
            $table->foreignId('received_by')->constrained('users');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('layaway_payments');
    }
};
