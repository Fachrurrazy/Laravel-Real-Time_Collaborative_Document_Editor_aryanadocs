<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('user_name');
            $table->string('user_color', 20)->nullable();
            $table->unsignedInteger('edits')->default(0);
            $table->timestamp('last_edited_at')->nullable();
            $table->timestamps();
            $table->unique(['document_id', 'user_id', 'user_name'], 'document_activity_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_activities');
    }
};
