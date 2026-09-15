<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('hero_video_source', 20)->default('default')->after('hero_video_enabled');
            $table->string('hero_video_url', 500)->nullable()->after('hero_video_source');
            $table->string('hero_video_public_id', 255)->nullable()->after('hero_video_url');
            $table->string('hero_video_link', 500)->nullable()->after('hero_video_public_id');
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['hero_video_source', 'hero_video_url', 'hero_video_public_id', 'hero_video_link']);
        });
    }
};
