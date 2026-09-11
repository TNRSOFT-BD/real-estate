<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_page_settings', function (Blueprint $table) {
            $table->id();
            $table->string('hero_badge')->nullable();
            $table->string('hero_title')->nullable();
            $table->string('hero_highlight')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_primary_button_text')->nullable();
            $table->string('hero_primary_button_link')->nullable();
            $table->string('hero_secondary_button_text')->nullable();
            $table->string('hero_secondary_button_link')->nullable();
            $table->string('hero_background_image')->nullable();

            $table->string('form_title')->nullable();
            $table->text('form_description')->nullable();
            $table->text('form_success_message')->nullable();

            $table->string('faq_badge')->nullable();
            $table->string('faq_title')->nullable();
            $table->text('faq_description')->nullable();

            $table->string('team_badge')->nullable();
            $table->string('team_title')->nullable();
            $table->text('team_description')->nullable();

            $table->string('location_badge')->nullable();
            $table->string('location_title')->nullable();
            $table->text('location_description')->nullable();

            $table->string('live_chat_title')->nullable();
            $table->text('live_chat_description')->nullable();

            $table->string('closing_badge')->nullable();
            $table->string('closing_title')->nullable();
            $table->text('closing_description')->nullable();

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
        Schema::dropIfExists('contact_page_settings');
    }
};