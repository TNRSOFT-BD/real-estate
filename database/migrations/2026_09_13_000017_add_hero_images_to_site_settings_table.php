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
            $table->json('hero_images')->nullable()->after('hero_description');
        });

        // Backfill the existing single image into the new list column.
        DB::table('site_settings')
            ->whereNotNull('hero_image')
            ->get(['id', 'hero_image'])
            ->each(function ($row): void {
                DB::table('site_settings')->where('id', $row->id)->update([
                    'hero_images' => json_encode([$row->hero_image]),
                ]);
            });

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn('hero_image');
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('hero_image')->nullable()->after('hero_description');
        });

        DB::table('site_settings')
            ->whereNotNull('hero_images')
            ->get(['id', 'hero_images'])
            ->each(function ($row): void {
                $images = json_decode((string) $row->hero_images, true);
                DB::table('site_settings')->where('id', $row->id)->update([
                    'hero_image' => is_array($images) ? ($images[0] ?? null) : null,
                ]);
            });

        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn('hero_images');
        });
    }
};
