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
        Schema::table('tab_analytics', function (Blueprint $table) {
            //
            $table->unique(['content_id', 'device_hash', 'date']);
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tab_analytics', function (Blueprint $table) {
            //
            
            $table->dropUnique('tab_analytics_unique_combo');
        });
    }
};
