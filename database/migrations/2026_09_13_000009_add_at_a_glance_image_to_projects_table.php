<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('at_a_glance_image')->nullable()->after('hero_banner_alt');
            $table->string('at_a_glance_image_alt')->nullable()->after('at_a_glance_image');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['at_a_glance_image', 'at_a_glance_image_alt']);
        });
    }
};
