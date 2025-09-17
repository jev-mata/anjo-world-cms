<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('topics', function (Blueprint $table) {
            //
            $table->string('video')->nullable()->after('description');
            $table->string('image_path')->nullable()->after('video');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('topics', function (Blueprint $table) {
            //
            $table->dropColumn(['video', 'image_path']);
        });
    }
};
