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
        Schema::create('member_onboarding_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->foreignId('onboarding_step_id')->constrained('onboarding_steps')->cascadeOnDelete();
            $table->date('completed_at')->nullable();
            $table->timestamps();
            $table->unique(['member_id', 'onboarding_step_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_onboarding_steps');
    }
};
