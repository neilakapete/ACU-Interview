<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\MemberOnboardingStep;
use App\Models\OnboardingStep;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MemberOnboardingStep>
 */
class MemberOnboardingStepFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'member_id' => Member::factory(),
            'onboarding_step_id' => OnboardingStep::factory(),
            'completed_at' => null,
        ];
    }
}
