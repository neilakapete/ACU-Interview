<?php

namespace Tests\Feature\Traits;

use App\Models\OnboardingStep;

trait OnboardingSteps
{
    private function seedOnboardingSteps(): void
    {
        OnboardingStep::factory()->createMany([
            ['name' => 'Mobile App Set Up', 'sequence' => 3],
            ['name' => 'Product Conversations', 'sequence' => 4],
            ['name' => 'Account Opened', 'sequence' => 1],
            ['name' => 'E-statements Activated', 'sequence' => 2],
        ]);
    }
}
