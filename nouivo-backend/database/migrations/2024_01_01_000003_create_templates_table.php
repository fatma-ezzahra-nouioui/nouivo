<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('category', [
                'wedding', 'birthday', 'engagement', 'circumcision',
                'eid', 'ramadan', 'corporate', 'business_card',
            ]);
            $table->string('thumbnail_path');
            $table->string('component_name');
            $table->decimal('price', 8, 3);
            $table->json('text_fields');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
