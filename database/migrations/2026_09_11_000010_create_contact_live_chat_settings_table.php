<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_live_chat_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('enabled')->default(false);
            $table->string('provider')->default('custom');
            $table->string('script_url')->nullable();
            $table->string('widget_id')->nullable();
            $table->string('button_text')->nullable();
            $table->string('position')->default('bottom_right');
            $table->string('availability_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_live_chat_settings');
    }
};