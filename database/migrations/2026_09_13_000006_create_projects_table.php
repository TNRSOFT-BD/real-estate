<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('project_code', 50)->nullable()->unique();
            $table->unsignedBigInteger('project_type_id');
            $table->unsignedBigInteger('project_status_id');
            $table->text('short_description')->nullable();
            $table->longText('overview')->nullable();

            // Publishing / featured
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);

            // Location
            $table->string('location_address')->nullable();
            $table->string('location_area')->nullable();
            $table->string('location_city')->nullable();
            $table->string('location_country')->nullable();
            $table->string('google_map_url')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Property information
            $table->decimal('total_land_area', 15, 2)->nullable();
            $table->unsignedInteger('total_units')->nullable();
            $table->unsignedInteger('number_of_floors')->nullable();
            $table->unsignedInteger('number_of_buildings')->nullable();
            $table->unsignedInteger('units_per_floor')->nullable();
            $table->date('handover_date')->nullable();

            // Flexible data
            $table->json('property_features')->nullable();
            $table->json('amenities')->nullable();

            // Media
            $table->string('hero_banner')->nullable();
            $table->string('hero_banner_alt')->nullable();
            $table->string('brochure_pdf')->nullable();
            $table->string('promo_video_url')->nullable();

            // Legal
            $table->string('legal_approval_no')->nullable();
            $table->string('legal_approval_document')->nullable();

            // Developer
            $table->string('developer_name')->nullable();
            $table->string('developer_website')->nullable();

            // SEO
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('robots')->nullable();

            // Open Graph
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();

            // Twitter / X
            $table->string('twitter_card')->nullable();
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->string('twitter_image')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_type_id')->references('id')->on('project_types')->restrictOnDelete();
            $table->foreign('project_status_id')->references('id')->on('project_statuses')->restrictOnDelete();

            $table->index(['project_type_id', 'project_status_id']);
            $table->index('is_published');
            $table->index('is_featured');
            $table->index('sort_order');
            $table->index('location_city');
            $table->index('published_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
