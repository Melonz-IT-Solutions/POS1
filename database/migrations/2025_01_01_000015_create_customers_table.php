<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone', 30)->nullable()->index();
            $table->string('email')->nullable()->index();
            $table->text('address')->nullable();
            $table->text('notes')->nullable();
            // Discount in basis points: 500 = 5.00%, 2000 = 20.00%
            $table->unsignedSmallInteger('discount_rate')->default(0);
            $table->integer('loyalty_points')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
