<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' =>fake()->sentence(),
            'description' => fake()->realText(),
            'due_date' => fake()->dateTimeBetween('now','+1 years'),
            'status' => fake()->randomElement(['To Do', 'Progress','Done']),
            'priority' => fake()->randomElement(['Low', 'Medium','High']),
            'created_at' => 1,
            'updated_at' => 1
        ];
    }
}
