<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->string('unit_type');
            $table->decimal('size_sqft', 15, 2)->nullable();
            $table->decimal('price_per_sqft', 15, 2)->nullable();
            $table->decimal('total_price', 15, 2)->nullable();
            $table->decimal('booking_money', 15, 2)->nullable();
            $table->decimal('down_payment_percentage', 5, 2)->nullable();
            $table->text('installment_plan')->nullable();
            $table->string('floor_plan_image')->nullable();
            $table->string('status', 20)->default('available');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();

            $table->index('project_id');
            $table->index('status');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_pricing_plans');
    }
};
