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
        
        Schema::create('page_analytics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('content_id'); // CMS content ID
            $table->string('device_hash'); // unique per device
            $table->date('date'); // store per day
            $table->timestamps();

            $table->unique(['content_id', 'device_hash', 'date']); // prevent duplicates
        });
        
        Schema::create('tab_analytics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('content_id');
            $table->string('tab_name');
            $table->string('device_hash');
            $table->date('date'); 
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_analytics');
        Schema::dropIfExists('tab_analytics');
    }
};
