<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_floor_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image_path');
            $table->string('total_area')->nullable();
            $table->string('bedrooms')->nullable();
            $table->string('bathrooms')->nullable();
            $table->string('balcony')->nullable();
            $table->string('lounge')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();

            $table->index('project_id');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_floor_plans');
    }
};
