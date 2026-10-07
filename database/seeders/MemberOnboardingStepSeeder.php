<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\MemberOnboardingStep;
use App\Models\OnboardingStep;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MemberOnboardingStepSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = Member::all();
        $onboardingSteps = OnboardingStep::orderBy('sequence')->get();

        foreach ($members as $member) {
            // Account Opened is the first step and should always be completed
            $memberOnboardingStepsCompleted = max(1, fake()->numberBetween(0, $onboardingSteps->count()));
            $latestStartDate = now()->subDays($onboardingSteps->count());
            $completedAtDate = Carbon::instance(
                fake()->dateTimeBetween('-30 days', $latestStartDate)
            );

            foreach ($onboardingSteps as $onboardingStep) {
                MemberOnboardingStep::factory()->create([
                    'member_id' => $member->id,
                    'onboarding_step_id' => $onboardingStep->id,
                    'completed_at' => ($onboardingStep->sequence <= $memberOnboardingStepsCompleted)
                        ? $completedAtDate->addDay()
                        : null,
                ]);
            }
        }
    }
}
