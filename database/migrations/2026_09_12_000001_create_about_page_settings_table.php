<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_page_settings', function (Blueprint $table) {
            $table->id();

            $table->string('hero_badge')->nullable();
            $table->string('hero_title')->nullable();
            $table->string('hero_highlight')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_image')->nullable();
            $table->string('hero_cta_text')->nullable();
            $table->string('hero_cta_link')->nullable();

            $table->string('intro_badge')->nullable();
            $table->string('intro_title')->nullable();
            $table->text('intro_description')->nullable();
            $table->string('intro_image')->nullable();

            $table->json('stats')->nullable();

            $table->string('direction_badge')->nullable();
            $table->string('mission_title')->nullable();
            $table->text('mission_description')->nullable();
            $table->string('mission_image')->nullable();
            $table->string('vision_title')->nullable();
            $table->text('vision_description')->nullable();
            $table->string('vision_image')->nullable();

            $table->string('values_badge')->nullable();
            $table->string('values_title')->nullable();
            $table->json('values')->nullable();

            $table->string('journey_badge')->nullable();
            $table->string('journey_title')->nullable();
            $table->json('journey')->nullable();

            $table->string('why_badge')->nullable();
            $table->string('why_title')->nullable();
            $table->json('why_items')->nullable();

            $table->string('team_badge')->nullable();
            $table->string('team_title')->nullable();
            $table->text('team_description')->nullable();

            $table->string('partners_title')->nullable();
            $table->json('partners')->nullable();

            $table->string('closing_badge')->nullable();
            $table->string('closing_title')->nullable();
            $table->text('closing_description')->nullable();
            $table->string('closing_button_text')->nullable();
            $table->string('closing_button_link')->nullable();

            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->text('seo_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('twitter_card')->nullable();

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_page_settings');
    }
};