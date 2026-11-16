<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('layaways', function (Blueprint $table) {
            $table->id();
            $table->string('layaway_number')->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('total_amount');   // centavos
            $table->unsignedBigInteger('deposit_paid')->default(0);
            $table->unsignedBigInteger('balance');        // total - deposit_paid
            $table->date('due_date')->nullable();
            $table->string('status')->default('active'); // active, completed, cancelled
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('layaways');
    }
};
