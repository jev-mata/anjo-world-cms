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
        //
        Schema::table('page_analytics', function (Blueprint $table) {
            // Drop the existing FK using its real name
            $table->dropForeign('FK_page_analytics_group_contents');

            // Recreate it with ON DELETE CASCADE
            $table->foreign('content_id')
                  ->references('id')
                  ->on('group_contents')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('page_analytics', function (Blueprint $table) {
            $table->dropForeign(['content_id']);
            $table->foreign('content_id')
                  ->references('id')
                  ->on('group_contents')
                  ->onDelete('restrict');
        });
    }
};
