<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['elementary', 'highschool']);
            $table->foreignId('group_contents_id')->constrained('group_contents')->onDelete('cascade'); // Foreign key to the project
            $table->text('description')->nullable();
            $table->string('video')->nullable(); // URL for video
            $table->string('image_path')->nullable(); // For image upload
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contents');
    }
};
