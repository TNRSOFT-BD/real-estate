<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('hero_eyebrow')->nullable()->after('hero_video_enabled');
            $table->string('hero_title')->nullable()->after('hero_eyebrow');
            $table->text('hero_description')->nullable()->after('hero_title');
            $table->string('hero_image')->nullable()->after('hero_description');
        });

        // Seed the existing singleton with the copy that was previously hard-coded.
        DB::table('site_settings')->whereNull('hero_title')->update([
            'hero_eyebrow' => 'Excellence in Real Estate',
            'hero_title' => 'Crafting Iconic Landmarks & Luxury Living',
            'hero_description' => "Discover bespoke architectural designs and premium residential properties in the city's most prestigious locations.",
        ]);
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['hero_eyebrow', 'hero_title', 'hero_description', 'hero_image']);
        });
    }
};
