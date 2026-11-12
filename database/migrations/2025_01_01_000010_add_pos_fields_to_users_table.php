<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('pin', 60)->nullable()->after('password');
            $table->string('status', 20)->default('active')->after('pin');
            $table->timestamp('last_login_at')->nullable()->after('status');
            $table->unsignedSmallInteger('failed_login_attempts')->default(0)->after('last_login_at');
            $table->timestamp('locked_until')->nullable()->after('failed_login_attempts');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['pin', 'status', 'last_login_at', 'failed_login_attempts', 'locked_until']);
            $table->dropSoftDeletes();
        });
    }
};
