<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('extension_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->restrictOnDelete();
            $table->decimal('amount_paid', 8, 3);
            $table->string('konnect_payment_id')->nullable();
            $table->unsignedInteger('months_added');
            $table->timestamp('new_expires_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extension_payments');
    }
};
