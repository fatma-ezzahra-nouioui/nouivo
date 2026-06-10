<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->restrictOnDelete();
            $table->string('buyer_name');
            $table->string('buyer_email');
            $table->string('buyer_phone');
            $table->json('custom_text');
            $table->decimal('amount_paid', 8, 3);
            $table->string('konnect_payment_id')->nullable();
            $table->string('konnect_payment_ref')->nullable();
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
