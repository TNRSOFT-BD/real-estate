<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_about_settings', function (Blueprint $table) {
            $table->id();
            $table->string('heading')->nullable();
            $table->longText('description')->nullable();
            $table->string('badge_figure')->nullable();
            $table->string('badge_copy')->nullable();
            $table->string('main_image')->nullable();
            $table->string('main_image_alt')->nullable();
            $table->string('accent_image')->nullable();
            $table->string('accent_image_alt')->nullable();
            $table->timestamps();
        });

        Schema::create('home_about_stats', function (Blueprint $table) {
            $table->id();
            $table->string('figure');
            $table->string('label');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_about_stats');
        Schema::dropIfExists('home_about_settings');
    }
};
