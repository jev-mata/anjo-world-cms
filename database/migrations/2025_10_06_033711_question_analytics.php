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
            // Remove the old content_id
            $table->dropColumn('content_id');
        });

        Schema::table('question_analytics', function (Blueprint $table) {
            // Add it back with proper foreign key constraint to topics
            $table->foreignId('topic_id')
                  ->nullable()
                  ->constrained('topics')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('question_analytics', function (Blueprint $table) {
            $table->dropForeign(['topic_id']);
            $table->dropColumn('topic_id');
        });

        Schema::table('question_analytics', function (Blueprint $table) {
            $table->unsignedBigInteger('content_id')->nullable();
        });
    }
};
