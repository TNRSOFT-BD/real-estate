<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('project_galleries')->where('type', 'floor_plan')->update(['type' => 'exterior']);

        Schema::table('project_pricing_plans', function (Blueprint $table) {
            $table->dropColumn('floor_plan_image');
        });
    }

    public function down(): void
    {
        Schema::table('project_pricing_plans', function (Blueprint $table) {
            $table->string('floor_plan_image')->nullable();
        });
    }
};
