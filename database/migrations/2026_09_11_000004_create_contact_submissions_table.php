<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->json('form_data')->nullable();
            $table->string('status')->default('new');
            $table->string('priority')->default('normal');
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->string('ip_hash')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('source')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('assigned_to')->references('id')->on('users')->nullOnDelete();
            $table->index(['status', 'created_at']);
            $table->index(['priority', 'created_at']);
            $table->index(['assigned_to', 'status']);
            $table->index(['created_at']);
            $table->index(['email']);
            $table->index(['ip_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_submissions');
    }
};