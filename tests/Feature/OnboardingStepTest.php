<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Feature\Traits\OnboardingSteps;
use Tests\TestCase;

class OnboardingStepTest extends TestCase
{
    use OnboardingSteps;
    use RefreshDatabase;

    public function test_get_onboarding_steps_returns_array_ordered_by_sequence(): void
    {
        $this->seedOnboardingSteps();

        $response = $this->getJson('/api/onboarding-steps')
            ->assertStatus(200)
            ->assertJsonCount(4);

        $this->assertSame(
            [1, 2, 3, 4],
            collect($response->json())->pluck('sequence')->all()
        );

        $this->assertSame(
            ['Account Opened', 'E-statements Activated', 'Mobile App Set Up', 'Product Conversations'],
            collect($response->json())->pluck('name')->all()
        );
    }
}
