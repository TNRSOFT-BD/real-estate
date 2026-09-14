<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->string('name');
            $table->string('email');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('comment');
            $table->boolean('is_approved')->default(false);
            $table->string('ip_hash')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();

            $table->index('project_id');
            $table->index(['project_id', 'is_approved']);
            $table->index('rating');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_reviews');
    }
};
