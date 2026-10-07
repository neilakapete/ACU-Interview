<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\Feature\Traits\OnboardingSteps;
use Tests\TestCase;

class MemberOnboardingStepTest extends TestCase
{
    use OnboardingSteps;
    use RefreshDatabase;

    private function getNewMember(): TestResponse
    {
        return $this->postJson('/api/members', [
            'name' => 'An Other',
            'email' => 'an@other.com',
        ]);
    }

    public function test_update_with_no_post_data(): void
    {
        $this->seedOnboardingSteps();

        $member = $this->getNewMember();

        $memberOnboardingStepProgressId = $member->json('onboarding_steps_progress.1.id');

        $this->patchJson('/api/member-onboarding-steps/'.$memberOnboardingStepProgressId, [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('completed_at');

    }

    public function test_update_completed_at_is_not_a_date(): void
    {
        $this->seedOnboardingSteps();

        $member = $this->getNewMember();

        $memberOnboardingStepProgressId = $member->json('onboarding_steps_progress.1.id');

        $this->patchJson('/api/member-onboarding-steps/'.$memberOnboardingStepProgressId, [
            'completed_at' => 'not-a-date',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('completed_at');
    }

    public function test_update_completed_at_is_not_a_future_date(): void
    {
        $this->seedOnboardingSteps();

        $member = $this->getNewMember();

        $memberOnboardingStepProgressId = $member->json('onboarding_steps_progress.1.id');

        $this->patchJson('/api/member-onboarding-steps/'.$memberOnboardingStepProgressId, [
            'completed_at' => now()->addDay()->toDateString(),
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('completed_at');
    }

    public function test_update_completed_at_for_unknown_id(): void
    {
        $date = now()->toDateString();

        $this->patchJson('/api/member-onboarding-steps/99999', [
            'completed_at' => $date,
        ])->assertNotFound();
    }

    public function test_update_completed_at_sets_the_date(): void
    {
        $this->seedOnboardingSteps();

        $member = $this->getNewMember();

        $memberOnboardingStepProgressId = $member->json('onboarding_steps_progress.1.id');
        $date = now()->toDateString();

        $response = $this->patchJson('/api/member-onboarding-steps/'.$memberOnboardingStepProgressId, [
            'completed_at' => $date,
        ])->assertOk();

        $this->assertSame($memberOnboardingStepProgressId, $response->json('id'));
        $this->assertSame($date, $response->json('completed_at'));

        $this->assertDatabaseHas('member_onboarding_steps', [
            'id' => $memberOnboardingStepProgressId,
            'completed_at' => $date,
        ]);
    }

    public function test_remove_completed_at_sets_the_date_as_null(): void
    {
        $this->seedOnboardingSteps();

        $member = $this->getNewMember();

        $memberOnboardingStepProgressId = $member->json('onboarding_steps_progress.1.id');
        $endpoint = '/api/member-onboarding-steps/'.$memberOnboardingStepProgressId;

        $this->patchJson($endpoint, [
            'completed_at' => now()->toDateString(),
        ])->assertOk();

        $response = $this->patchJson($endpoint, [
            'completed_at' => null,
        ])->assertOk();

        $this->assertSame($memberOnboardingStepProgressId, $response->json('id'));
        $this->assertSame(null, $response->json('completed_at'));

        $this->assertDatabaseHas('member_onboarding_steps', [
            'id' => $memberOnboardingStepProgressId,
            'completed_at' => null,
        ]);
    }
}
