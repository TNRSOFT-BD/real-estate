<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['developer_name', 'developer_website']);
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('developer_name')->nullable()->after('legal_approval_document');
            $table->string('developer_website')->nullable()->after('developer_name');
        });
    }
};
