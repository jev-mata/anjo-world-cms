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
        Schema::create('question_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->foreignId('answer_id')->nullable()->constrained('answers')->onDelete('set null');
            $table->unsignedBigInteger('content_id')->nullable(); // Optional link to content/group
            $table->string('device_hash'); // unique device identifier
            $table->boolean('is_correct')->default(false);
            $table->date('date');
            $table->timestamps(); 

            $table->unique([ 'device_hash']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_analytics');
    }
};
