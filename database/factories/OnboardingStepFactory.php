<?php

namespace Database\Factories;

use App\Models\OnboardingStep;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OnboardingStep>
 */
class OnboardingStepFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'sequence' => $this->faker->unique()->numberBetween(1, 50),
        ];
    }
}
