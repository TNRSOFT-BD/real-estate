<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_items', function (Blueprint $table) {
            $table->id();

            $table->string('type', 30)->index();

            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->text('content')->nullable();

            $table->string('value', 50)->nullable();
            $table->string('label')->nullable();
            $table->string('year', 10)->nullable();
            $table->date('date')->nullable();

            $table->string('image')->nullable();
            $table->string('image_alt')->nullable();
            $table->string('icon')->nullable();
            $table->string('url', 500)->nullable();

            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_featured')->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_items');
    }
};
