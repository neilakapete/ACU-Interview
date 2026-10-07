<?php

namespace Database\Seeders;

use App\Models\OnboardingStep;
use Illuminate\Database\Seeder;

class OnboardingStepSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OnboardingStep::factory()->createMany([
            ['name' => 'Account Opened', 'sequence' => 1],
            ['name' => 'E-statements Activated', 'sequence' => 2],
            ['name' => 'Mobile App Set Up', 'sequence' => 3],
            ['name' => 'Product Conversations', 'sequence' => 4],
        ]);
    }
}
