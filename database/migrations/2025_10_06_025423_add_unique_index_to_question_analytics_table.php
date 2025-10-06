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
        Schema::table('question_analytics', function (Blueprint $table) {
            $table->unique(['question_id', 'device_hash', 'date'], 'unique_question_per_day');
        });
    }

    public function down(): void
    {
        Schema::table('question_analytics', function (Blueprint $table) {
            $table->dropUnique('unique_question_per_day');
        });
    }
};
