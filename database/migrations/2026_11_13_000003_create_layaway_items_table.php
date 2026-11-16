<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('layaway_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('layaway_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->string('product_name');           // snapshot
            $table->string('product_sku');
            $table->unsignedInteger('quantity');
            $table->unsignedBigInteger('unit_price'); // centavos
            $table->unsignedBigInteger('total');      // centavos
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('layaway_items');
    }
};
