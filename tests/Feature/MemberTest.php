<?php

namespace Tests\Feature;

use App\Models\Member;
use App\Models\MemberOnboardingStep;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\OnboardingSteps;
use Tests\TestCase;

class MemberTest extends TestCase
{
    use OnboardingSteps;
    use RefreshDatabase;

    public function test_index_returns_members_by_name_with_progress_in_sequence_order(): void
    {
        $this->seedOnboardingSteps();

        $this->postJson('/api/members', ['name' => 'Zed', 'email' => 'zed@example.com']);
        $this->postJson('/api/members', ['name' => 'Amy', 'email' => 'amy@example.com']);

        $response = $this->getJson('/api/members')
            ->assertOk()
            ->assertJsonCount(2);

        $this->assertSame(['Amy', 'Zed'], collect($response->json())->pluck('name')->all());

        $this->assertSame(
            ['Account Opened', 'E-statements Activated', 'Mobile App Set Up', 'Product Conversations'],
            collect($response->json('0.onboarding_steps_progress'))->pluck('onboarding_step.name')->all()
        );
    }

    public function test_store_member_with_no_post_data(): void
    {
        $this->postJson('/api/members', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
            ]);

        $this->assertDatabaseCount('members', 0);
    }

    public function test_store_member_name_and_email_empty(): void
    {
        $this->postJson('/api/members', [
            'name' => '',
            'email' => '',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
            ]);

        $this->assertDatabaseCount('members', 0);
    }

    public function test_store_member_duplicate_email_error(): void
    {
        $duplicateEmail = 'duplicate@email.com';

        Member::factory()->create([
            'name' => 'Duplicate Email',
            'email' => $duplicateEmail,
        ]);

        $this->postJson('/api/members', [
            'name' => 'Someone Else',
            'email' => $duplicateEmail,
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->assertDatabaseCount('members', 1);
    }

    public function test_store_member_creates_all_member_onboarding_steps_and_sets_account_open_completed_at_date(): void
    {
        $this->seedOnboardingSteps();

        $response = $this->postJson('/api/members', [
            'name' => 'An Other',
            'email' => 'an@other.com',
        ]);

        $response->assertCreated()
            ->assertJsonCount(4, 'onboarding_steps_progress')
            ->assertJsonPath('onboarding_steps_progress.0.onboarding_step.name', 'Account Opened');

        $this->assertDatabaseHas('members', ['email' => 'an@other.com']);

        $memberFirstOnboardingStep = MemberOnboardingStep::whereHas(
            'onboardingStep',
            fn ($query) => $query->where('sequence', 1)
        )->first();

        $this->assertSame('Account Opened', $memberFirstOnboardingStep->onboardingStep->name);
        $this->assertSame(now()->toDateString(), $memberFirstOnboardingStep->completed_at->toDateString());
        $this->assertSame(1, MemberOnboardingStep::whereNotNull('completed_at')->count());
        $this->assertSame(3, MemberOnboardingStep::whereNull('completed_at')->count());
    }
}
