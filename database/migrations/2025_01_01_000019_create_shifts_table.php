<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cashier_id');
            $table->timestamp('opened_at');
            $table->timestamp('closed_at')->nullable();
            $table->unsignedBigInteger('opening_float')->default(0);    // centavos
            $table->unsignedBigInteger('closing_cash')->nullable();     // centavos
            $table->unsignedBigInteger('expected_cash')->nullable();    // centavos
            $table->bigInteger('over_short')->nullable();               // centavos, can be negative
            $table->string('status', 20)->default('open');             // open|closed
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['cashier_id', 'status']);
            $table->foreign('cashier_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
